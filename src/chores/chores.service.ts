import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { addDays, nyNow, toDbDate, weekdayOf } from '../common/dates';
import { SlackService } from '../notifications/slack.service';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceStatusService } from '../service-status/service-status.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import type { ChoreCadence } from '../generated/prisma/enums';
import { displayName } from '../common/name';

/**
 * The lines ChoreBot opened and closed with. Kept because they are the
 * reason people read the post rather than scrolling past it.
 */
const GREETINGS = [
  'Evening, all.',
  'Hello hello.',
  'Right then.',
  'Good evening!',
];
const REQUESTS = [
  'Press the button when yours is done.',
  'Hit “Done!” once you have finished.',
  'Tap Done and it will cross itself off.',
];
const NOTHING = [
  'No chores tonight. Enjoy it.',
  'Nothing on the list tonight.',
  'The list is empty tonight.',
];

/**
 * Picks a line that does not change through the day.
 *
 * Seeded on the date rather than randomly: the post is edited in place every
 * time somebody presses a button, and a greeting that changed underneath them
 * each time would be unsettling.
 */
function phraseFor(list: string[], dateStr: string): string {
  const seed = [...dateStr].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return list[seed % list.length];
}

@Injectable()
export class ChoresService {
  private readonly logger = new Logger(ChoresService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slack: SlackService,
    private readonly audit: AuditService,
    private readonly webhooks: WebhooksService,
    private readonly serviceStatus: ServiceStatusService,
  ) {}

  /** Whether a chore falls on a given date. */
  private fallsOn(
    chore: {
      cadence: ChoreCadence;
      dayOfWeek: number | null;
      dayOfMonth: number | null;
    },
    dateStr: string,
  ): boolean {
    switch (chore.cadence) {
      case 'DAILY':
        return true;
      case 'WEEKLY':
        return chore.dayOfWeek === weekdayOf(dateStr);
      case 'MONTHLY':
        return chore.dayOfMonth === Number(dateStr.slice(8, 10));
      case 'ONCE':
        // A one-off is scheduled by creating its occurrence directly, so the
        // recurrence rules have nothing to say about it.
        return false;
    }
  }

  /**
   * Makes sure every chore due on a date has an occurrence row.
   *
   * Occurrences are created rather than derived so a completion has something
   * durable to attach to — changing a chore's cadence later must not orphan
   * the night somebody did it.
   */
  async ensureOccurrences(dateStr: string) {
    const chores = await this.prisma.chore.findMany({
      where: { active: true },
    });
    const due = chores.filter((chore) => this.fallsOn(chore, dateStr));
    if (!due.length) return [];
    await this.prisma.choreOccurrence.createMany({
      data: due.map((chore) => ({
        choreId: chore.id,
        dueOn: toDbDate(dateStr),
      })),
      skipDuplicates: true,
    });
    return this.occurrencesOn(dateStr);
  }

  /** The chore, its standing assignee, and whoever has this night. */
  private static readonly OCCURRENCE_INCLUDE = {
    chore: {
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
    },
    assignee: {
      select: {
        id: true,
        firstName: true,
        preferredFirstName: true,
        lastName: true,
      },
    },
    completedBy: {
      select: {
        id: true,
        firstName: true,
        preferredFirstName: true,
        lastName: true,
      },
    },
  } as const;

  occurrencesOn(dateStr: string) {
    return this.prisma.choreOccurrence.findMany({
      where: { dueOn: toDbDate(dateStr) },
      include: ChoresService.OCCURRENCE_INCLUDE,
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Who this night falls to: the override if one was set, otherwise the
   * chore's standing assignee, otherwise nobody in particular.
   */
  private static whoseNight(occurrence: {
    assignee: { firstName: string; lastName: string } | null;
    chore: { assignee: { firstName: string; lastName: string } | null };
  }) {
    return occurrence.assignee ?? occurrence.chore.assignee;
  }

  /** Hands one night to somebody, or puts it back to the standing assignee. */
  async assignNight(
    auth: AuthContext,
    occurrenceId: number,
    memberId: number | null,
  ) {
    const updated = await this.prisma.choreOccurrence.update({
      where: { id: occurrenceId },
      data: { assigneeId: memberId },
      include: ChoresService.OCCURRENCE_INCLUDE,
    });
    await this.audit.log(
      auth,
      'chore.assign',
      'ChoreOccurrence',
      occurrenceId,
      { memberId, chore: updated.chore.name },
    );
    await this.refreshSlack(occurrenceId);
    return updated;
  }

  /** Today and the next fortnight, for the portal. */
  async upcoming(days = 14) {
    const today = nyNow().dateStr;
    return this.prisma.choreOccurrence.findMany({
      where: {
        dueOn: { gte: toDbDate(today), lt: toDbDate(addDays(today, days)) },
      },
      include: ChoresService.OCCURRENCE_INCLUDE,
      orderBy: [{ dueOn: 'asc' }, { id: 'asc' }],
    });
  }

  // ------------------------------------------------------------------ Slack

  private blocksFor(
    dateStr: string,
    occurrences: Awaited<ReturnType<ChoresService['occurrencesOn']>>,
  ) {
    const line = (
      occurrence: (typeof occurrences)[number],
    ): Record<string, unknown> => {
      const whose = ChoresService.whoseNight(occurrence);
      const assigned = whose ? ` _(${displayName(whose)})_` : '';
      if (occurrence.completedAt) {
        const who = occurrence.completedBy
          ? displayName(occurrence.completedBy)
          : 'someone';
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `>~${occurrence.chore.name}~ — done by ${who}`,
          },
        };
      }
      return {
        type: 'section',
        text: { type: 'mrkdwn', text: `>${occurrence.chore.name}${assigned}` },
        accessory: {
          type: 'button',
          text: { type: 'plain_text', text: 'Done!', emoji: true },
          // Carries the occurrence, so a press is unambiguous even after the
          // list is reordered or another chore is added.
          action_id: `chore:${occurrence.id}`,
          value: String(occurrence.id),
        },
      };
    };

    const section = (text: string) => ({
      type: 'section',
      text: { type: 'mrkdwn', text },
    });

    if (!occurrences.length) {
      return [section(phraseFor(NOTHING, dateStr))];
    }
    return [
      section(phraseFor(GREETINGS, dateStr)),
      section('*Tonight’s chores:*'),
      ...occurrences.map(line),
      section(phraseFor(REQUESTS, dateStr)),
    ];
  }

  /** Posts the day's chores, or edits the existing post if there is one. */
  async postToSlack(dateStr = nyNow().dateStr): Promise<boolean> {
    // Nothing is asked of anybody while the agency is shut down. The
    // occurrences are still created, so the record of what was due survives
    // and the portal can show it — only the asking stops.
    const status = await this.serviceStatus.current();
    if (!status.inService) {
      this.logger.log('chores: agency is out of service, not posting');
      return false;
    }

    const occurrences = await this.ensureOccurrences(dateStr);
    const blocks = this.blocksFor(dateStr, occurrences);
    const text = occurrences.length
      ? 'Tonight’s chores have been posted.'
      : 'No chores tonight.';

    const posted = occurrences.find((o) => o.slackTs);
    if (posted?.slackTs && posted.slackChannel) {
      return this.slack.update(
        posted.slackChannel,
        posted.slackTs,
        text,
        blocks,
      );
    }

    const result = await this.slack.postReturning('chores', text, blocks);
    if (!result) return false;
    await this.prisma.choreOccurrence.updateMany({
      where: { id: { in: occurrences.map((o) => o.id) } },
      data: {
        slackChannel: result.channel,
        slackTs: result.ts,
        postedAt: new Date(),
      },
    });
    return true;
  }

  /** Redraws the Slack post for whatever day an occurrence belongs to. */
  private async refreshSlack(occurrenceId: number) {
    const occurrence = await this.prisma.choreOccurrence.findUnique({
      where: { id: occurrenceId },
    });
    if (!occurrence?.slackTs || !occurrence.slackChannel) return;
    const dateStr = occurrence.dueOn.toISOString().slice(0, 10);
    const occurrences = await this.occurrencesOn(dateStr);
    await this.slack.update(
      occurrence.slackChannel,
      occurrence.slackTs,
      'Tonight’s chores.',
      this.blocksFor(dateStr, occurrences),
    );
  }

  // ------------------------------------------------------------- completion

  /**
   * Marks a chore done. Idempotent: a second press, from Slack or the portal,
   * leaves the first person's name on it rather than quietly reassigning
   * credit to whoever clicked last.
   */
  async complete(
    occurrenceId: number,
    memberId: number | null,
    opts: { note?: string; auth?: AuthContext } = {},
  ) {
    const occurrence = await this.prisma.choreOccurrence.findUnique({
      where: { id: occurrenceId },
      include: { chore: true },
    });
    if (!occurrence) throw new NotFoundException('Chore not found');
    if (occurrence.completedAt) {
      await this.refreshSlack(occurrenceId);
      return occurrence;
    }

    const updated = await this.prisma.choreOccurrence.update({
      where: { id: occurrenceId },
      data: {
        completedAt: new Date(),
        completedById: memberId,
        note: opts.note?.trim() || null,
      },
      include: {
        chore: true,
        completedBy: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
    });

    if (opts.auth) {
      await this.audit.log(
        opts.auth,
        'chore.complete',
        'ChoreOccurrence',
        occurrenceId,
        { chore: occurrence.chore.name },
      );
    }
    this.webhooks.emit('chore.completed', {
      occurrenceId,
      chore: occurrence.chore.name,
      memberId,
      completedAt: updated.completedAt?.toISOString(),
    });
    await this.refreshSlack(occurrenceId);
    return updated;
  }

  /** Undoes a completion, for the inevitable wrong button. */
  async reopen(auth: AuthContext, occurrenceId: number) {
    const updated = await this.prisma.choreOccurrence.update({
      where: { id: occurrenceId },
      data: { completedAt: null, completedById: null, note: null },
    });
    await this.audit.log(auth, 'chore.reopen', 'ChoreOccurrence', occurrenceId);
    await this.refreshSlack(occurrenceId);
    return updated;
  }
}
