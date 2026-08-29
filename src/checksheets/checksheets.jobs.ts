import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AGENCY_TZ, nyToday } from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChecksheetsService,
  DEFAULT_EXPIRY_WARNING_DAYS,
} from './checksheets.service';

/**
 * The daily look at what is running out.
 *
 * A date written on a sheet and never looked at again is a date nobody acts
 * on, which makes logging it a waste of the checker's time. This is the part
 * that makes the logging worth doing.
 */
@Injectable()
export class ChecksheetsJobs {
  private readonly logger = new Logger(ChecksheetsJobs.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly checksheets: ChecksheetsService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('20 7 * * *', { timeZone: AGENCY_TZ })
  async dailyExpirySweep() {
    // The widest window any template asks for; each row is then held to its
    // own template's threshold, so a truck warning at 60 days does not make
    // every bag warn at 60 too.
    const templates = await this.prisma.checksheetTemplate.findMany({
      where: { active: true },
      select: {
        id: true,
        expiryWarningDays: true,
        notifyRoles: { select: { id: true } },
      },
    });
    if (!templates.length) return;
    const widest = Math.max(
      DEFAULT_EXPIRY_WARNING_DAYS,
      ...templates.map(
        (t) => t.expiryWarningDays ?? DEFAULT_EXPIRY_WARNING_DAYS,
      ),
    );

    const rows = await this.checksheets.expiring(widest);
    if (!rows.length) return;

    const thresholds = new Map(
      templates.map((t) => [
        t.id,
        t.expiryWarningDays ?? DEFAULT_EXPIRY_WARNING_DAYS,
      ]),
    );
    const rolesByTemplate = new Map(
      templates.map((t) => [t.id, t.notifyRoles.map((role) => role.id)]),
    );

    const today = nyToday();
    const perTemplate = new Map<number, string[]>();
    for (const row of rows) {
      const limit = thresholds.get(row.template.id);
      if (limit === undefined) continue;
      const days = Math.round(
        (row.expiresAt.getTime() - today.getTime()) / 86_400_000,
      );
      if (days > limit) continue;
      const where = row.asset ? ` on ${row.asset.name}` : '';
      const when =
        days < 0
          ? `expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`
          : days === 0
            ? 'expires today'
            : `expires in ${days} day${days === 1 ? '' : 's'}`;
      const list = perTemplate.get(row.template.id) ?? [];
      list.push(`${row.item.label}${where} — ${when}`);
      perTemplate.set(row.template.id, list);
    }

    let sent = 0;
    for (const [templateId, lines] of perTemplate) {
      const roleIds = rolesByTemplate.get(templateId) ?? [];
      if (!roleIds.length) continue;
      const template = await this.prisma.checksheetTemplate.findUnique({
        where: { id: templateId },
        select: { name: true },
      });
      const recipients = await this.prisma.memberRole.findMany({
        where: {
          roleId: { in: roleIds },
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
          member: { active: true },
        },
        select: { memberId: true },
        distinct: ['memberId'],
      });
      for (const recipient of recipients) {
        await this.notifications.notify(recipient.memberId, {
          type: 'checksheet.expiring',
          subject: `${template?.name ?? 'Checksheet'}: ${lines.length} item${lines.length === 1 ? '' : 's'} expiring`,
          body: lines.join('\n'),
          task: {
            actionLabel: 'See what is expiring',
            actionUrl: '/checksheets/expiring',
          },
        });
        sent += 1;
      }
    }
    if (sent) this.logger.log(`Checksheet expiry warnings sent: ${sent}`);
  }
}
