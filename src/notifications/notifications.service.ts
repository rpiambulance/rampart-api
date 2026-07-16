import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Notification fan-out. Transports are enabled by environment:
 *   SMTP_URL + EMAIL_FROM            → email
 *   SLACK_BOT_TOKEN                  → Slack DMs (member.slackId)
 *   SLACK_OFFICERS_CHANNEL           → officer broadcasts
 * Unset transports degrade to log-only so the rest of the system never blocks.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly mailer?: nodemailer.Transporter;
  private readonly emailFrom?: string;
  private readonly slackToken?: string;
  private readonly officersChannel?: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    const smtpUrl = config.get<string>('SMTP_URL');
    this.emailFrom = config.get<string>('EMAIL_FROM');
    if (smtpUrl && this.emailFrom) {
      this.mailer = nodemailer.createTransport(smtpUrl);
    }
    this.slackToken = config.get<string>('SLACK_BOT_TOKEN');
    this.officersChannel = config.get<string>('SLACK_OFFICERS_CHANNEL');
  }

  async notifyMember(memberId: number, subject: string, body: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { email: true, slackId: true },
    });
    if (!member) return;

    let delivered = false;
    if (this.mailer && member.email) {
      try {
        await this.mailer.sendMail({
          from: this.emailFrom,
          to: member.email,
          subject: `[RPIA] ${subject}`,
          text: body,
        });
        delivered = true;
      } catch (error) {
        this.logger.error(`email to member=${memberId} failed: ${error}`);
      }
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
    if (!this.mailer) {
      this.logger.log(`email (no transport) to=${to} :: ${subject} — ${body}`);
      return false;
    }
    try {
      await this.mailer.sendMail({ from: this.emailFrom, to, subject, text: body });
      return true;
    } catch (error) {
      this.logger.error(`email to ${to} failed: ${error}`);
      return false;
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
