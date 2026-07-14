import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { AGENCY_TZ, nyNow, toDbDate } from '../common/dates';
import { PrismaService } from '../prisma/prisma.service';

const POSITION_LABELS: Record<string, string> = {
  CC: 'Crew Chief',
  DRIVER: 'Driver',
  ATTENDANT: 'Rider',
  OBSERVER: 'Rider',
  DUTY_SUP: 'Duty Supervisor',
};

/**
 * Nightly "who's on tonight" Slack post — replaces slack-whoson.php.
 * Enabled by SLACK_BOT_TOKEN + SLACK_WHOSON_CHANNEL.
 */
@Injectable()
export class WhosOnJobs {
  private readonly logger = new Logger(WhosOnJobs.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Cron('0 17 * * *', { timeZone: AGENCY_TZ })
  async postWhosOn() {
    const token = this.config.get<string>('SLACK_BOT_TOKEN');
    const channel = this.config.get<string>('SLACK_WHOSON_CHANNEL');
    if (!token || !channel) return;

    const crew = await this.prisma.crew.findUnique({
      where: { date: toDbDate(nyNow().dateStr) },
      include: {
        slots: {
          include: {
            member: { select: { firstName: true, lastName: true, slackId: true } },
          },
        },
      },
    });
    if (!crew) return;

    const lines = ['*Tonight’s crew:*'];
    for (const position of ['CC', 'DRIVER', 'ATTENDANT', 'OBSERVER', 'DUTY_SUP'] as const) {
      const slot = crew.slots.find((s) => s.position === position);
      const who = slot?.member
        ? slot.member.slackId
          ? `<@${slot.member.slackId}>`
          : `${slot.member.firstName} ${slot.member.lastName}`
        : (slot?.placeholder ?? '_open_');
      lines.push(`• ${POSITION_LABELS[position]}: ${who}`);
    }

    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ channel, text: lines.join('\n') }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (!data.ok) this.logger.error(`whoson post failed: ${data.error}`);
  }
}
