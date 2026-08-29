import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { looksLikeSlackId } from './slack-id';
import { SlackService } from './slack.service';
import { nyToday } from '../common/dates';
import { renderEmail } from './email-template';
import {
  channelsFor,
  NOTIFICATION_SETTING_KEY,
  type ChannelSettings,
} from './message-types';

/** A message bound for a member's inbox, and possibly other channels. */
/**
 * A portal path as something somebody can click from outside the portal.
 *
 * Task URLs are stored relative because that is what the inbox needs, so the
 * base is only attached at the point a message leaves for email or Slack.
 * Anything already absolute is left alone.
 */
export function portalUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = (
    process.env.WEB_BASE_URL ??
    process.env.WEB_ORIGIN?.split(',')[0] ??
    ''
  )
    .trim()
    .replace(/\/$/, '');
  if (!base) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export interface Notice {
  /** Message type key; decides email/Slack delivery. See message-types.ts. */
  type: string;
  subject: string;
  body: string;
  /** Something to be done, not merely read. */
  task?: { actionLabel: string; actionUrl: string };
  /**
   * The record this is about, when there is one. A task sent to everybody who
   * could deal with something can then be closed for all of them the moment
   * one of them does. See completeTasksAbout.
   */
  about?: { type: string; id: number };
}

/** Email settings as held in AppSetting; see the console's Email card. */
export interface EmailSettings {
  host: string;
  port: number;
  secure: boolean;
  user?: string | null;
  pass?: string | null;
  from: string;
  /**
   * Hostname announced in EHLO. Left unset, nodemailer uses the machine's
   * own — inside a container that is a random hex string, which Google and
   * others reject outright ("421 4.7.0 Try again later, closing connection").
   */
  ehloName?: string | null;
}

/**
 * Turns a server's refusal into something actionable. These are the failures
 * that actually come up against Gmail and Microsoft 365.
 */
function hintFor(detail: string): string | undefined {
  const text = detail.toLowerCase();
  if (text.includes('421') && text.includes('ehlo')) {
    return (
      'The server rejected the greeting itself, before any login. Set the ' +
      'EHLO name to a real domain you control — a container announces a ' +
      'random hostname, which Google refuses. Gmail also wants port 587 ' +
      'with implicit TLS off, or 465 with it on.'
    );
  }
  if (text.includes('535') || text.includes('username and password')) {
    return (
      'The credentials were rejected. A Google account with 2-step ' +
      'verification needs an app password, not the account password.'
    );
  }
  if (text.includes('wrong version number') || text.includes('ssl')) {
    return (
      'That looks like the wrong TLS mode for the port: use 587 with ' +
      'implicit TLS off, or 465 with it on.'
    );
  }
  if (text.includes('timeout') || text.includes('etimedout')) {
    return (
      'Nothing answered. Check the host and port, and that the API can ' +
      'reach it — outbound SMTP is often blocked by default.'
    );
  }
  return undefined;
}

/** Domain of a From header, used as a sane default EHLO name. */
function domainOf(from: string): string | undefined {
  const match = /@([^\s>]+)>?\s*$/.exec(from.trim());
  return match?.[1];
}

export const EMAIL_SETTING_KEY = 'email.smtp';

/**
 * Notification fan-out.
 *
 * Email is configured in the console and stored in AppSetting, so an
 * administrator can fix a mail problem without a redeploy. SMTP_URL and
 * EMAIL_FROM still work as a fallback for environments configured before
 * that existed. Slack uses SLACK_BOT_TOKEN and SLACK_OFFICERS_CHANNEL.
 *
 * Unset transports degrade to log-only so the rest of the system never blocks.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly envMailer?: nodemailer.Transporter;
  private readonly envEmailFrom?: string;
  /** Rebuilt when the console saves new settings. */
  private stored?: {
    at: number;
    transport?: nodemailer.Transporter;
    from?: string;
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly slack: SlackService,
    config: ConfigService,
  ) {
    const smtpUrl = config.get<string>('SMTP_URL');
    this.envEmailFrom = config.get<string>('EMAIL_FROM');
    if (smtpUrl && this.envEmailFrom) {
      this.envMailer = nodemailer.createTransport(smtpUrl);
    }
  }

  /** Drop the cached transport so the next send picks up saved settings. */
  invalidateEmailSettings(): void {
    this.stored = undefined;
  }

  async readEmailSettings(): Promise<EmailSettings | null> {
    const row = await this.prisma.appSetting.findUnique({
      where: { key: EMAIL_SETTING_KEY },
    });
    return (row?.value as unknown as EmailSettings) ?? null;
  }

  /** The transport to use: console settings first, environment as fallback. */
  private async transport(): Promise<{
    mailer?: nodemailer.Transporter;
    from?: string;
  }> {
    if (this.stored && Date.now() - this.stored.at < 60_000) {
      return { mailer: this.stored.transport, from: this.stored.from };
    }
    const settings = await this.readEmailSettings().catch(() => null);
    if (settings?.host && settings.from) {
      const transport = nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        // Announce a real domain rather than the container's hostname.
        name: settings.ehloName?.trim() || domainOf(settings.from),
        // On a STARTTLS port, refuse to fall back to an unencrypted session.
        ...(settings.secure ? {} : { requireTLS: true }),
        ...(settings.user
          ? { auth: { user: settings.user, pass: settings.pass ?? '' } }
          : {}),
        // Fail in seconds rather than hanging a request behind a dead server.
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      });
      this.stored = { at: Date.now(), transport, from: settings.from };
      return { mailer: transport, from: settings.from };
    }
    this.stored = { at: Date.now() };
    return { mailer: this.envMailer, from: this.envEmailFrom };
  }

  private async channels(): Promise<ChannelSettings | null> {
    const row = await this.prisma.appSetting
      .findUnique({ where: { key: NOTIFICATION_SETTING_KEY } })
      .catch(() => null);
    return (row?.value as unknown as ChannelSettings) ?? null;
  }

  /**
   * The main path for anything addressed to a member. The inbox copy is
   * always written; email and Slack follow the configured channels for the
   * message type, so a delivery problem never loses the message itself.
   */
  async notify(
    memberId: number,
    notice: Notice,
    /**
     * Forces the channels rather than reading them from the member's
     * settings. For a message somebody is deliberately sending, now, having
     * chosen how — an officer telling five people their credential is about
     * to lapse should not have it silently dropped because the type is
     * configured inbox-only.
     */
    channels?: { email: boolean; slack: boolean },
  ) {
    const message = await this.prisma.inboxMessage.create({
      data: {
        memberId,
        type: notice.type,
        subject: notice.subject,
        body: notice.body,
        isTask: !!notice.task,
        actionLabel: notice.task?.actionLabel ?? null,
        actionUrl: notice.task?.actionUrl ?? null,
        subjectType: notice.about?.type ?? null,
        subjectId: notice.about?.id ?? null,
      },
    });

    const wanted = channels ?? channelsFor(await this.channels(), notice.type);
    if (wanted.email || wanted.slack) {
      await this.deliver(memberId, notice, wanted);
    }
    return message;
  }

  private async deliver(
    memberId: number,
    notice: Notice,
    wanted: { email: boolean; slack: boolean },
  ) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { email: true, slackId: true },
    });
    if (!member) return;

    // Absolute for anything leaving the building. The inbox keeps the
    // relative path — it is an in-app link — but a bare "/availability" in an
    // email or a Slack message is not a link at all, just text.
    const body = notice.task
      ? `${notice.body}\n\n${notice.task.actionLabel}: ${portalUrl(notice.task.actionUrl)}`
      : notice.body;

    if (wanted.email && member.email) {
      await this.sendEmail(member.email, notice.subject, body);
    }
    // A direct message: the "channel" is the member's own Slack id, so it has
    // to be an id. A handle left by the legacy import would be posted to a
    // channel that does not exist.
    if (wanted.slack && looksLikeSlackId(member.slackId)) {
      await this.slack.postTo(member.slackId!, `*${notice.subject}*\n${body}`);
    }
  }

  /** Raw email to an outside address (e.g. coverage requesters). */
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    const { mailer, from } = await this.transport();
    if (!mailer) {
      this.logger.warn(
        `email (no transport configured) to=${to} :: ${subject} — ${body}`,
      );
      return false;
    }
    try {
      // Both parts: HTML for clients that render it, the original text for
      // those that do not, and for anyone reading it as plain mail.
      await mailer.sendMail({
        from,
        to,
        subject,
        text: body,
        html: renderEmail({ subject, text: body }),
      });
      return true;
    } catch (error) {
      this.logger.error(`email to ${to} failed: ${error}`);
      return false;
    }
  }

  /** Sends a themed test message, surfacing why it failed rather than a bool. */
  async sendTestEmail(
    to: string,
  ): Promise<{ ok: boolean; detail?: string; hint?: string }> {
    const { mailer, from } = await this.transport();
    if (!mailer) {
      return {
        ok: false,
        detail: 'No mail server is configured yet — save the settings first.',
      };
    }
    const subject = 'RPI Ambulance — test message';
    const text =
      'This is a test from the Rampart admin console.\n\n' +
      'If you can read this, outgoing mail is working: coverage ' +
      'confirmations, approvals and follow-ups will reach their recipients.';
    try {
      await mailer.sendMail({
        from,
        to,
        subject,
        text,
        html: renderEmail({ subject, text }),
      });
      return { ok: true };
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      return { ok: false, detail, hint: hintFor(detail) };
    }
  }

  /**
   * To everyone holding a permission — the people who can actually act on it.
   * Used for a task that names a job rather than a role.
   */
  /**
   * Close every outstanding task about a record, naming who dealt with it.
   *
   * A task sent to everyone who could verify a certification is finished the
   * moment one of them verifies it. Leaving the other copies open asks four
   * more people to look at something already done; deleting them leaves a
   * gap where a task used to be. So they are completed, and credited.
   */
  async completeTasksAbout(
    about: { type: string; id: number },
    byMemberId: number | null,
  ): Promise<number> {
    const result = await this.prisma.inboxMessage.updateMany({
      where: {
        subjectType: about.type,
        subjectId: about.id,
        isTask: true,
        completedAt: null,
      },
      data: { completedAt: new Date(), completedById: byMemberId },
    });
    return result.count;
  }

  async notifyPermissionHolders(permission: string, notice: Notice) {
    const today = nyToday();
    const [byRole, byCredential] = await Promise.all([
      this.prisma.memberRole.findMany({
        where: {
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
          member: { active: true },
          role: { permissions: { some: { permission } } },
        },
        select: { memberId: true },
      }),
      this.prisma.memberCredential.findMany({
        where: {
          status: 'ACTIVE',
          member: { active: true },
          type: {
            linkedRoles: {
              some: { role: { permissions: { some: { permission } } } },
            },
          },
        },
        select: { memberId: true },
      }),
    ]);
    const recipients = new Set([
      ...byRole.map((r) => r.memberId),
      ...byCredential.map((r) => r.memberId),
    ]);
    for (const memberId of recipients) {
      await this.notify(memberId, notice);
    }
    if (!recipients.size) {
      this.logger.warn(
        `nobody holds ${permission}; notice went nowhere :: ${notice.subject}`,
      );
    }
  }

  /** Broadcast to every active member (availability requests). */
  async notifyAllActiveMembers(notice: Notice) {
    const members = await this.prisma.member.findMany({
      where: { active: true },
      select: { id: true },
    });
    for (const member of members) {
      await this.notify(member.id, notice);
    }
  }

  /**
   * To every officer: an inbox copy each, plus the channels configured for
   * the type. Officers are members holding a role marked isOfficer.
   */
  async notifyOfficerInboxes(notice: Notice) {
    const today = nyToday();
    const assignments = await this.prisma.memberRole.findMany({
      where: {
        startDate: { lte: today },
        OR: [{ endDate: null }, { endDate: { gte: today } }],
        member: { active: true },
        role: { isOfficer: true },
      },
      select: { memberId: true },
      distinct: ['memberId'],
    });
    for (const assignment of assignments) {
      await this.notify(assignment.memberId, notice);
    }
    // The officers channel still gets one post, rather than one per officer —
    // carrying the link, since a channel post nobody can act on from is just
    // an announcement that something needs doing somewhere else.
    const body = notice.task
      ? `${notice.body}\n\n${notice.task.actionLabel}: ${portalUrl(notice.task.actionUrl)}`
      : notice.body;
    await this.postSlack('officers', `*${notice.subject}*\n${body}`);
    if (!assignments.length) {
      this.logger.warn(
        `notice for officers had nobody to reach :: ${notice.subject}`,
      );
    }
  }

  /** Slack is a courtesy copy; where it posts is configured in the console. */
  private async postSlack(channelKey: string, text: string): Promise<boolean> {
    return this.slack.post(channelKey, text);
  }
}
