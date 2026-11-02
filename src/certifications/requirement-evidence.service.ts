import { Injectable } from '@nestjs/common';
import { fromDbDate, nyDayStart, nyToday, toDbDate } from '../common/dates';
import { ChecklistsService } from '../checklists/checklists.service';
import type { RequirementKind } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CertificationGraphService } from './certification-graph.service';

/** What deciding a requirement needs to know about it. */
export interface RequirementToCheck {
  kind: RequirementKind;
  certificationTypeId: number | null;
  evalTemplateId: number | null;
  count: number | null;
  classId: number | null;
  classSeriesId: number | null;
  countsFrom: Date | null;
  validThrough: Date | null;
  /** Evaluations are counted by the form's name; see signedEvaluations. */
  evalTemplate?: { name: string } | null;
}

/**
 * Where a member stands against a requirement.
 *
 * `until` is the last day what they have keeps meeting it — null when it
 * does not lapse. `lapsesBy` says what ends it: the requirement's cut-off
 * for everybody, or the thing itself running out (a class series' validity,
 * a certification's expiry). Reminders tell the two apart, because a
 * certification already warns about its own expiry and a cut-off is news
 * nobody else is sending.
 */
export interface Standing {
  met: boolean;
  until: Date | null;
  lapsesBy: 'cutoff' | 'certification' | 'series' | null;
}

const UNMET: Standing = { met: false, until: null, lapsesBy: null };

/** A calendar date this many months on, as certification expiry counts it. */
export function addMonthsToDate(date: Date, months: number): Date {
  const out = new Date(date);
  out.setUTCMonth(out.getUTCMonth() + months);
  return toDbDate(fromDbDate(out));
}

/** A requirement's name, as a member or an officer would read it. */
export function requirementLabel(req: {
  kind: string;
  count: number | null;
  countsFrom?: Date | null;
  certificationType?: { name: string } | null;
  evalTemplate?: { name: string } | null;
  class?: { name: string } | null;
  classSeries?: { name: string } | null;
}): string {
  const since = req.countsFrom
    ? ` dated ${fromDbDate(req.countsFrom)} or later`
    : '';
  if (req.kind === 'CERTIFICATION' && req.certificationType) {
    return `Verified ${req.certificationType.name}${since}`;
  }
  if (req.kind === 'EVALUATION_COUNT' && req.evalTemplate) {
    return `${req.count} signed “${req.evalTemplate.name}” evaluations${since}`;
  }
  if (req.kind === 'CHECKLIST' && req.evalTemplate) {
    return `Complete the “${req.evalTemplate.name}” checklist${since}`;
  }
  if (req.kind === 'CLASS' && req.classSeries) {
    return `Complete a ${req.classSeries.name} session${since}`;
  }
  if (req.kind === 'CLASS' && req.class) {
    return `Complete ${req.class.name}`;
  }
  return 'Requirement';
}

/**
 * Whether a member has done what a requirement asks, and for how long that
 * keeps counting.
 *
 * One answer for every place that asks — the promotion checklist, the nightly
 * suspension check, the preview of who a change would catch, and the
 * reminders. Each kept its own copy once, and copies drift: a preview that
 * counts differently from the sweep it previews is worse than no preview.
 *
 * Two dates on the requirement apply here, to whatever date each kind of
 * evidence carries: `countsFrom` (nothing older counts — last season's flu
 * shot is not this season's) and `validThrough` (nothing counts past it — the
 * end of this refresher cycle, for everybody).
 */
@Injectable()
export class RequirementEvidenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly certGraph: CertificationGraphService,
    private readonly checklists: ChecklistsService,
  ) {}

  async isMet(
    memberId: number,
    req: RequirementToCheck,
    today: Date = nyToday(),
  ): Promise<boolean> {
    return (await this.standing(memberId, req, today)).met;
  }

  async standing(
    memberId: number,
    req: RequirementToCheck,
    today: Date = nyToday(),
  ): Promise<Standing> {
    // Past the cut-off nothing counts, however recent: the next cycle has
    // not been set, and last cycle's evidence was only ever good to here.
    if (req.validThrough && req.validThrough < today) return UNMET;

    let own: Standing;
    switch (req.kind) {
      case 'CERTIFICATION':
        own =
          req.certificationTypeId === null
            ? UNMET
            : await this.certificationStanding(
                memberId,
                req.certificationTypeId,
                today,
                req.countsFrom,
              );
        break;
      case 'EVALUATION_COUNT':
        own =
          req.evalTemplate &&
          (await this.signedEvaluations(
            memberId,
            req.evalTemplate.name,
            req.countsFrom,
          )) >= (req.count ?? 1)
            ? { met: true, until: null, lapsesBy: null }
            : UNMET;
        break;
      case 'CHECKLIST':
        own =
          req.evalTemplateId !== null &&
          (await this.checklists.isComplete(
            req.evalTemplateId,
            memberId,
            req.countsFrom ? nyDayStart(fromDbDate(req.countsFrom)) : undefined,
          ))
            ? { met: true, until: null, lapsesBy: null }
            : UNMET;
        break;
      case 'CLASS':
        own =
          req.classSeriesId !== null
            ? await this.seriesStanding(
                memberId,
                req.classSeriesId,
                today,
                req.countsFrom,
              )
            : req.classId !== null &&
                (await this.completedClass(memberId, req.classId))
              ? { met: true, until: null, lapsesBy: null }
              : UNMET;
        break;
    }
    if (!own.met || !req.validThrough) return own;
    // Whichever comes first: the evidence running out, or the cycle ending.
    return own.until && own.until <= req.validThrough
      ? own
      : { met: true, until: req.validThrough, lapsesBy: 'cutoff' };
  }

  /**
   * A verified, unexpired certification of this type or one that outranks
   * it — a Paramedic meets a requirement for EMT — good until the latest
   * expiry among them.
   *
   * With `since`, it must also have been issued on or after that day. One
   * with no issue date cannot be shown to be recent enough, so it does not
   * count; a type used this way should ask for the issue date.
   */
  private async certificationStanding(
    memberId: number,
    certificationTypeId: number,
    today: Date,
    since: Date | null,
  ): Promise<Standing> {
    const accepted = await this.certGraph.satisfying(certificationTypeId);
    const certs = await this.prisma.memberCertification.findMany({
      where: {
        memberId,
        typeId: { in: accepted },
        status: 'VERIFIED',
        OR: [{ expiresAt: null }, { expiresAt: { gte: today } }],
        ...(since ? { issuedAt: { gte: since } } : {}),
      },
      select: { expiresAt: true },
    });
    if (!certs.length) return UNMET;
    if (certs.some((cert) => !cert.expiresAt)) {
      return { met: true, until: null, lapsesBy: null };
    }
    const until = certs
      .map((cert) => cert.expiresAt!)
      .reduce((a, b) => (a > b ? a : b));
    return { met: true, until, lapsesBy: 'certification' };
  }

  /**
   * Any completed session in the series, each good for the series' validity
   * from the day of the session — or the day it was marked completed, for a
   * session never given a date.
   */
  private async seriesStanding(
    memberId: number,
    seriesId: number,
    today: Date,
    since: Date | null,
  ): Promise<Standing> {
    const series = await this.prisma.classSeries.findUnique({
      where: { id: seriesId },
      select: { validityMonths: true },
    });
    if (!series) return UNMET;
    const attended = await this.prisma.classAttendance.findMany({
      where: { memberId, status: 'COMPLETED', class: { seriesId } },
      select: { completedAt: true, class: { select: { sessionAt: true } } },
    });
    let best: Standing = UNMET;
    for (const row of attended) {
      const at = row.class.sessionAt ?? row.completedAt;
      // Undated both ways cannot be shown to be recent enough or to have
      // lapsed, so it only counts where neither question is asked.
      if (!at) {
        if (since || series.validityMonths) continue;
        return { met: true, until: null, lapsesBy: null };
      }
      // The New York calendar day it happened on.
      const day = nyToday(at);
      if (since && day < since) continue;
      if (!series.validityMonths) {
        return { met: true, until: null, lapsesBy: null };
      }
      const until = addMonthsToDate(day, series.validityMonths);
      if (until < today) continue;
      if (!best.met || (best.until && until > best.until)) {
        best = { met: true, until, lapsesBy: 'series' };
      }
    }
    return best;
  }

  /**
   * Signed evaluations on a form, counted across every version of it.
   *
   * Editing a form that has been filled in mints a new row — new id, same
   * name, next version — and the evaluations already written stay pinned to
   * the row they were answered on, which is right: an evaluation is a record
   * of the questions somebody was actually asked.
   *
   * A requirement is not about a revision, though. "Two signed Driver Call
   * Evaluations" means the form. Counting the row id meant that revising a
   * form silently emptied the requirement that named it: evaluations on
   * either side of the edit stopped counting together, and a member with
   * three signed evaluations was told she had one. The name is the form's
   * identity — it is what reviseTemplate itself counts versions by, and
   * nothing can change it.
   *
   * With `since`, only evaluations of a day on or after it count — the day
   * evaluated where one was given, otherwise the day the evaluator signed.
   */
  signedEvaluations(
    memberId: number,
    templateName: string,
    since: Date | null = null,
  ): Promise<number> {
    return this.prisma.evaluation.count({
      where: {
        subjectId: memberId,
        status: 'SIGNED',
        template: { name: templateName },
        ...(since
          ? {
              OR: [
                { evalDate: { gte: since } },
                {
                  evalDate: null,
                  signedByEvaluator: { gte: nyDayStart(fromDbDate(since)) },
                },
              ],
            }
          : {}),
      },
    });
  }

  async completedClass(memberId: number, classId: number): Promise<boolean> {
    const attendance = await this.prisma.classAttendance.findUnique({
      where: { classId_memberId: { classId, memberId } },
      select: { status: true },
    });
    return attendance?.status === 'COMPLETED';
  }
}
