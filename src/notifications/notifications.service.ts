import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { renderEmail } from './email-template';

/** Email settings as held in AppSetting; see the console's Email card. */
export interface EmailSettings {
  host: string;
  port: number;
  secure: boolean;
  user?: string | null;
  pass?: string | null;
  from: string;
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
  private readonly slackToken?: string;
  private readonly officersChannel?: string;
  /** Rebuilt when the console saves new settings. */
  private stored?: { at: number; transport?: nodemailer.Transporter; from?: string };

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    const smtpUrl = config.get<string>('SMTP_URL');
    this.envEmailFrom = config.get<string>('EMAIL_FROM');
    if (smtpUrl && this.envEmailFrom) {
      this.envMailer = nodemailer.createTransport(smtpUrl);
    }
    this.slackToken = config.get<string>('SLACK_BOT_TOKEN');
    this.officersChannel = config.get<string>('SLACK_OFFICERS_CHANNEL');
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
        ...(settings.user
          ? { auth: { user: settings.user, pass: settings.pass ?? '' } }
          : {}),
      });
      this.stored = { at: Date.now(), transport, from: settings.from };
      return { mailer: transport, from: settings.from };
    }
    this.stored = { at: Date.now() };
    return { mailer: this.envMailer, from: this.envEmailFrom };
  }

  async notifyMember(memberId: number, subject: string, body: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { email: true, slackId: true },
    });
    if (!member) return;

    let delivered = false;
    if (member.email) {
      // Through sendEmail so members get the same themed message, and the
      // same console-configured transport, as anyone outside the corps.
      delivered = await this.sendEmail(member.email, subject, body);
    }
    if (this.slackToken && member.slackId) {
      delivered = (await this.postSlack(member.slackId, `*${subject}*\n${body}`)) || delivered;
    }
    if (!delivered) {
      this.logger.log(`notify member=${memberId} (no transport) :: ${subject} — ${body}`);
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
  async sendTestEmail(to: string): Promise<{ ok: boolean; detail?: string }> {
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
      return { ok: false, detail: error instanceof Error ? error.message : String(error) };
    }
  }

  /** Broadcast to every active member (availability requests). */
  async notifyAllActiveMembers(subject: string, body: string) {
    const members = await this.prisma.member.findMany({
      where: { active: true },
      select: { id: true },
    });
    for (const member of members) {
      await this.notifyMember(member.id, subject, body);
    }
  }

  async notifyOfficers(subject: string, body: string) {
    if (this.slackToken && this.officersChannel) {
      const ok = await this.postSlack(this.officersChannel, `*${subject}*\n${body}`);
      if (ok) return;
    }
    this.logger.log(`notify officers (no transport) :: ${subject} — ${body}`);
  }

  private async postSlack(channel: string, text: string): Promise<boolean> {
    try {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.slackToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ channel, text }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        this.logger.error(`slack post to ${channel} failed: ${data.error}`);
      }
      return data.ok;
    } catch (error) {
      this.logger.error(`slack post to ${channel} failed: ${error}`);
      return false;
    }
  }
}
