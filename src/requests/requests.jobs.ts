import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AGENCY_TZ } from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

/**
 * One message a day about people asking for accounts.
 *
 * Deliberately not one per request: an open house or a recruiting post puts
 * thirty of these in overnight, and thirty notifications is a way of making
 * sure none of them are read. Sent only when something is actually waiting,
 * so a quiet week is silent.
 */
@Injectable()
export class RequestsJobs {
  private readonly logger = new Logger(RequestsJobs.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('30 7 * * *', { timeZone: AGENCY_TZ })
  async dailyAccountRequestDigest() {
    const waiting = await this.prisma.accountRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      select: { firstName: true, lastName: true, email: true, createdAt: true },
    });
    if (!waiting.length) return;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const fresh = waiting.filter((row) => row.createdAt >= since).length;
    const lines = waiting
      .slice(0, 20)
      .map((row) => `• ${row.firstName} ${row.lastName} — ${row.email}`);
    if (waiting.length > lines.length) {
      lines.push(`…and ${waiting.length - lines.length} more.`);
    }

    await this.notifications.notifyPermissionHolders(
      PERMISSIONS.MEMBERS_WRITE,
      {
        type: 'account.requested',
        subject:
          waiting.length === 1
            ? '1 person is waiting for an account'
            : `${waiting.length} people are waiting for accounts`,
        body:
          (fresh
            ? `${fresh} came in since yesterday.`
            : 'Nothing new since yesterday, but these are still waiting.') +
          `\n\n${lines.join('\n')}`,
        task: {
          actionLabel: 'Review account requests',
          actionUrl: '/admin/members/requests',
        },
        // One subject for the whole queue: whoever works through it closes the
        // task for everybody, and tomorrow's digest raises a fresh one if
        // anything is still waiting.
        about: { type: 'AccountRequestQueue', id: 0 },
      },
    );
    this.logger.log(`Account request digest: ${waiting.length} waiting`);
  }
}
