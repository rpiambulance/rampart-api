import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { addDays, AGENCY_TZ, nyNow, toDbDate } from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CertificationsService } from './certifications.service';

const REMINDER_DAYS = [60, 30, 7];

/** Daily cert-expiry sweep: reminders + credential suspension recompute. */
@Injectable()
export class CertificationsJobs {
  private readonly logger = new Logger(CertificationsJobs.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly certs: CertificationsService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 7 * * *', { timeZone: AGENCY_TZ })
  async dailySweep() {
    const { changed } = await this.certs.recomputeSuspensions();
    this.logger.log(`Suspension recompute: ${changed} credential(s) changed`);

    for (const days of REMINDER_DAYS) {
      // The day being warned about is a New York calendar day counted from
      // today's, not an instant sliced in UTC — which is a day ahead of local
      // for the last four hours of every evening.
      const target = addDays(nyNow().dateStr, days);
      const start = toDbDate(target);
      const end = toDbDate(addDays(target, 1));
      const expiring = await this.prisma.memberCertification.findMany({
        where: {
          status: 'VERIFIED',
          expiresAt: { gte: start, lt: end },
          member: { active: true },
        },
        include: { type: true, member: { select: { id: true } } },
      });
      for (const cert of expiring) {
        await this.notifications.notify(cert.member.id, {
          type: 'cert.expiring',
          subject: `${cert.type.name} expires in ${days} days`,
          body: `Your ${cert.type.name} expires on ${cert
            .expiresAt!.toISOString()
            .slice(0, 10)}.`,
          task: {
            actionLabel: 'Upload your renewal',
            actionUrl: '/training',
          },
        });
      }
    }
  }
}
