import { Injectable, Logger } from '@nestjs/common';
import { addDays, fromDbDate, nyToday, toDbDate } from '../common/dates';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import type { Prisma } from '../generated/prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { requirementsInForce } from './certifications.service';
import {
  requirementLabel,
  RequirementEvidenceService,
} from './requirement-evidence.service';

/**
 * Days before a requirement takes effect that its holders are told, if they
 * have not already met it. Twice: once with time to do something about it,
 * and once more when it is close.
 */
export const ADVANCE_REMINDER_DAYS = [14, 3];

/** Days before what somebody has stops counting that they are told. */
export const RENEWAL_REMINDER_DAYS = [30, 7];

const REQUIREMENT_INCLUDE = {
  credentialType: { select: { name: true } },
  certificationType: { select: { name: true } },
  evalTemplate: { select: { name: true } },
  class: { select: { name: true } },
  classSeries: { select: { name: true } },
} as const;

/** "October 1, 2026", for a date column. */
function longDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function listed(items: string[]): string {
  return items.length < 2
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

type Requirement = Prisma.CredentialRequirementGetPayload<{
  include: typeof REQUIREMENT_INCLUDE;
}>;

/**
 * Telling people before a requirement costs them a credential.
 *
 * A suspension nobody saw coming reads as the system being wrong, even when
 * it is right. So a requirement dated ahead is announced to everybody it
 * would catch, twice, and something that has to be renewed is flagged before
 * it lapses — to the member, and, for a cut-off everybody shares, to the
 * officers who have to set the next one.
 *
 * Run once a day, after the suspension check.
 */
@Injectable()
export class RequirementRemindersService {
  private readonly logger = new Logger(RequirementRemindersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly credentialGraph: CredentialGraphService,
    private readonly evidence: RequirementEvidenceService,
    private readonly notifications: NotificationsService,
  ) {}

  async run(today: Date = nyToday()) {
    const upcoming = await this.remindUpcoming(today);
    const renewals = await this.remindRenewals(today);
    const cutoffs = await this.remindCutoffs(today);
    this.logger.log(
      `Requirement reminders: ${upcoming} upcoming, ${renewals} renewals, ${cutoffs} cut-offs`,
    );
  }

  /**
   * Ahead of a requirement taking effect, everybody who would not meet it on
   * the day.
   *
   * Counted rather than matched to the exact day, so a night the job did not
   * run is caught up the next morning instead of skipped, and a rerun sends
   * nothing twice. A requirement first dated only a few days out gets the
   * one reminder there is still time for.
   */
  async remindUpcoming(today: Date): Promise<number> {
    const requirements = await this.prisma.credentialRequirement.findMany({
      where: {
        scope: { in: ['ONGOING', 'BOTH'] },
        effectiveFrom: { gt: today },
      },
      include: REQUIREMENT_INCLUDE,
    });
    let sent = 0;
    for (const req of requirements) {
      const daysLeft = daysBetween(today, req.effectiveFrom!);
      const due = ADVANCE_REMINDER_DAYS.filter((d) => daysLeft <= d).length;
      if (due <= req.remindersSent) continue;
      // A requirement that ends before it starts asks nothing of anybody.
      if (req.effectiveUntil && req.effectiveUntil < req.effectiveFrom!) {
        continue;
      }

      const behind = await this.notMeeting(req, req.effectiveFrom!);
      const when = longDate(req.effectiveFrom!);
      const through = req.effectiveUntil
        ? ` It applies through ${longDate(req.effectiveUntil)}.`
        : '';
      for (const [memberId, credentials] of behind) {
        await this.notifications.notify(memberId, {
          type: 'credential.requirement-upcoming',
          subject: `Needed by ${when}: ${requirementLabel(req)}`,
          body:
            `From ${when}, holding ${listed(credentials)} requires: ` +
            `${requirementLabel(req)}. We do not have that on record for you yet. ` +
            `If it is not in by then, ${listed(credentials)} will be suspended ` +
            `until it is.${through}`,
          task: { actionLabel: 'See your training', actionUrl: '/training' },
        });
        sent++;
      }
      if (req.remindersSent === 0) {
        await this.notifications.notifyPermissionHolders(
          PERMISSIONS.CREDENTIALS_GRANT,
          {
            type: 'credential.requirement-upcoming.officers',
            subject: `${behind.size} not yet meeting a requirement starting ${when}`,
            body:
              `${requirementLabel(req)} becomes a requirement for ` +
              `${req.credentialType.name} on ${when}. ${behind.size} ` +
              `${behind.size === 1 ? 'member holding it has' : 'members holding it have'} ` +
              'not met it yet and have been reminded. Anybody who still has not by ' +
              'then will be suspended that morning.',
          },
        );
      }
      await this.prisma.credentialRequirement.update({
        where: { id: req.id },
        data: {
          remindersSent: due,
          announcedAt: req.announcedAt ?? new Date(),
        },
      });
    }
    return sent;
  }

  /**
   * Before somebody's evidence stops counting: the end of the cycle, or the
   * end of a class series' validity.
   *
   * A certification's own expiry is left alone — those already have their
   * own reminders, and saying it twice teaches people to ignore both.
   */
  async remindRenewals(today: Date): Promise<number> {
    const requirements = await this.prisma.credentialRequirement.findMany({
      where: {
        ...requirementsInForce(today),
        OR: [{ validThrough: { not: null } }, { classSeriesId: { not: null } }],
      },
      include: REQUIREMENT_INCLUDE,
    });
    const targets = new Set(
      RENEWAL_REMINDER_DAYS.map((d) => addDays(fromDbDate(today), d)),
    );
    let sent = 0;
    for (const req of requirements) {
      const holders = await this.holders(req);
      for (const [memberId, credentials] of holders) {
        const standing = await this.evidence.standing(memberId, req, today);
        if (!standing.met || !standing.until) continue;
        if (standing.lapsesBy === 'certification') continue;
        if (!targets.has(fromDbDate(standing.until))) continue;
        const until = longDate(standing.until);
        await this.notifications.notify(memberId, {
          type: 'credential.requirement-renewal',
          subject: `Due for renewal: ${requirementLabel(req)}`,
          body:
            standing.lapsesBy === 'cutoff'
              ? `What you have on record for ${requirementLabel(req)} counts ` +
                `through ${until}, when this cycle ends for everybody. To keep ` +
                `${listed(credentials)} after that, it will need doing again for ` +
                'the next cycle.'
              : `Your ${requirementLabel(req)} counts through ${until}. To keep ` +
                `${listed(credentials)} after that, complete it again before then.`,
          task: { actionLabel: 'See your training', actionUrl: '/training' },
        });
        sent++;
      }
    }
    return sent;
  }

  /**
   * Before a cut-off everybody shares, the officers who would have to set the
   * next one.
   *
   * Once it passes, nothing done before it counts until they do, so every
   * holder fails together — and the suspension check holds a crowd like
   * that back rather than act on it, which leaves the requirement meaning
   * nothing until somebody notices.
   */
  async remindCutoffs(today: Date): Promise<number> {
    const targets = RENEWAL_REMINDER_DAYS.map((d) =>
      toDbDate(addDays(fromDbDate(today), d)),
    );
    const requirements = await this.prisma.credentialRequirement.findMany({
      where: {
        ...requirementsInForce(today),
        validThrough: { in: targets },
      },
      include: REQUIREMENT_INCLUDE,
    });
    for (const req of requirements) {
      const until = longDate(req.validThrough!);
      await this.notifications.notifyPermissionHolders(
        PERMISSIONS.CREDENTIALS_GRANT,
        {
          type: 'credential.requirement-upcoming.officers',
          subject: `${requirementLabel(req)}: this cycle ends ${until}`,
          body:
            `For ${req.credentialType.name}, ${requirementLabel(req)} counts ` +
            `through ${until} for everybody. After that nothing done before it ` +
            'counts until the next cycle is set, and everybody holding the ' +
            'credential would fall short together. Set the next cycle’s dates ' +
            'on the requirement before then.',
          task: {
            actionLabel: 'Set the next cycle',
            actionUrl: '/admin/settings/credentials',
          },
        },
      );
    }
    return requirements.length;
  }

  /**
   * Active holders of the requirement's credential or anything above it,
   * each with the credentials of theirs it would cost — less anybody excused
   * it.
   */
  private async holders(req: Requirement): Promise<Map<number, string[]>> {
    const types = await this.prisma.credentialType.findMany({
      select: { id: true },
    });
    const reaching: number[] = [];
    for (const type of types) {
      const covered = await this.credentialGraph.idsAtOrBelow(type.id);
      if (covered.includes(req.credentialTypeId)) reaching.push(type.id);
    }
    const credentials = await this.prisma.memberCredential.findMany({
      where: {
        typeId: { in: reaching },
        status: 'ACTIVE',
        member: { active: true },
      },
      select: { memberId: true, type: { select: { name: true } } },
      orderBy: { typeId: 'asc' },
    });
    const waived = new Set(
      (
        await this.prisma.promotionRequirementAdjustment.findMany({
          where: { kind: 'WAIVER', requirementId: req.id },
          select: { memberId: true },
        })
      ).map((row) => row.memberId),
    );
    const out = new Map<number, string[]>();
    for (const cred of credentials) {
      if (waived.has(cred.memberId)) continue;
      out.set(cred.memberId, [
        ...(out.get(cred.memberId) ?? []),
        cred.type.name,
      ]);
    }
    return out;
  }

  /**
   * Holders who would not meet the requirement on a day — or any of its
   * alternatives, since meeting one of those is meeting it.
   */
  private async notMeeting(
    req: Requirement,
    onDay: Date,
  ): Promise<Map<number, string[]>> {
    const options = req.alternativeGroup
      ? await this.prisma.credentialRequirement.findMany({
          where: {
            credentialTypeId: req.credentialTypeId,
            alternativeGroup: req.alternativeGroup,
          },
          include: REQUIREMENT_INCLUDE,
        })
      : [req];
    const out = new Map<number, string[]>();
    for (const [memberId, credentials] of await this.holders(req)) {
      let met = false;
      for (const option of options) {
        if (await this.evidence.isMet(memberId, option, onDay)) {
          met = true;
          break;
        }
      }
      if (!met) out.set(memberId, credentials);
    }
    return out;
  }
}
