import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AGENCY_TZ } from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Monthly lapse report (spec §4.4): for each current-year annual training
 * with alertOnLapse enabled, tell the officers which active members haven't
 * completed it. Per-training toggle; trainings never gate credentials.
 */
@Injectable()
export class TrainingsJobs {
  private readonly logger = new Logger(TrainingsJobs.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 8 1 * *', { timeZone: AGENCY_TZ })
  async monthlyLapseReport() {
    const year = new Date().getFullYear();
    const requirements = await this.prisma.annualTrainingRequirement.findMany({
      where: { year, active: true, alertOnLapse: true },
      include: { completions: true },
    });
    if (!requirements.length) return;

    const activeMembers = await this.prisma.member.findMany({
      where: { active: true },
      select: { id: true, firstName: true, lastName: true },
    });

    for (const requirement of requirements) {
      const done = new Set(
        requirement.completions
          .filter((c) => c.completedAt)
          .map((c) => c.memberId),
      );
      const lapsed = activeMembers.filter((m) => !done.has(m.id));
      if (!lapsed.length) continue;
      await this.notifications.notifyOfficerInboxes({
        type: 'training.outstanding',
        subject: `${requirement.name} (${requirement.year}): ${lapsed.length} member(s) incomplete`,
        body: lapsed.map((m) => `${m.firstName} ${m.lastName}`).join(', '),
        task: {
          actionLabel: 'Review completions',
          actionUrl: `/admin/trainings/annual/${requirement.id}`,
        },
      });
    }
    this.logger.log(`Lapse report sent for ${requirements.length} requirement(s)`);
  }
}
