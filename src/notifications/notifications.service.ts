import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Notification fan-out. Email and Slack transports are TODO (spec §5.3);
 * until wired, notifications are logged so callers can integrate now.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async notifyMember(memberId: number, subject: string, body: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { email: true, slackId: true },
    });
    // TODO: email transport + Slack DM via bot token
    this.logger.log(
      `notify member=${memberId} email=${member?.email} slack=${member?.slackId} :: ${subject} — ${body}`,
    );
  }

  async notifyOfficers(subject: string, body: string) {
    // TODO: officer channel (Slack) + email distribution
    this.logger.log(`notify officers :: ${subject} — ${body}`);
  }
}
