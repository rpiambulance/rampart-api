import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AGENCY_TZ } from '../common/dates';
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
      const target = new Date();
      target.setDate(target.getDate() + days);
      const start = new Date(target.toISOString().slice(0, 10));
      const end = new Date(start.getTime() + 86_400_000);
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
          body: `Your ${cert.type.name} expires on ${cert.expiresAt!
            .toISOString()
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
