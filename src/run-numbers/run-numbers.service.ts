import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { nyNow } from '../common/dates';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  DEFAULT_DIVISIONS,
  DIVISION_SETTING_KEY,
  TERM_LATCH_KEY,
  divisionFor,
  formatRunNumber,
  windowFor,
  windowKey,
  type DivisionConfig,
  type TermLatch,
} from './divisions';

@Injectable()
export class RunNumbersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async divisionConfig(): Promise<DivisionConfig> {
    const row = await this.prisma.appSetting.findUnique({
      where: { key: DIVISION_SETTING_KEY },
    });
    return (row?.value as unknown as DivisionConfig) ?? DEFAULT_DIVISIONS;
  }

  private async termLatch(): Promise<TermLatch | null> {
    const row = await this.prisma.appSetting.findUnique({
      where: { key: TERM_LATCH_KEY },
    });
    return (row?.value as unknown as TermLatch) ?? null;
  }

  /**
   * The year and term to issue under, or the choice to be made.
   *
   * In a changeover month the answer is open until somebody says the new term
   * has begun. Once they have, this stops asking and reports the new term
   * until the next changeover comes round.
   */
  async currentTerm(now = new Date()) {
    const config = await this.divisionConfig();
    // The month in the agency's timezone: an issue just before midnight on
    // the last of the month must not be filed under the next one.
    const { dateStr } = nyNow(now);
    const month = Number(dateStr.slice(5, 7)) - 1;
    const year = dateStr.slice(2, 4);

    const window = windowFor(config, month);
    if (!window) {
      return {
        year,
        division: divisionFor(config, month),
        options: null,
        settledBy: null as string | null,
      };
    }

    const latch = await this.termLatch();
    const key = windowKey(year, window);
    // Only the incoming term latches. A latch naming the outgoing one would
    // mean somebody had answered "not yet", which settles nothing.
    const incoming = window.options[window.options.length - 1];
    if (latch?.window === key && latch.division === incoming) {
      return { year, division: latch.division, options: null, settledBy: key };
    }
    return { year, division: null, options: window.options, settledBy: null };
  }

  listLocations(includeInactive = false) {
    return this.prisma.runNumberLocation.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: { abbr: 'asc' },
    });
  }

  recent(limit = 50) {
    return this.prisma.runNumber.findMany({
      include: {
        location: { select: { abbr: true, name: true } },
        issuedBy: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
        event: { select: { id: true, title: true } },
      },
      orderBy: { issuedAt: 'desc' },
      take: Math.min(limit, 500),
    });
  }

  /**
   * Records that the new term has begun, for this changeover only.
   *
   * Stored against the changeover it was decided in, so the same month next
   * year starts open again rather than inheriting an answer from last time.
   */
  private async settleTerm(division: string) {
    const config = await this.divisionConfig();
    const { dateStr } = nyNow();
    const window = windowFor(config, Number(dateStr.slice(5, 7)) - 1);
    if (!window) return;
    const value: TermLatch = {
      division,
      window: windowKey(dateStr.slice(2, 4), window),
    };
    const stored = value as unknown as Prisma.InputJsonObject;
    await this.prisma.appSetting.upsert({
      where: { key: TERM_LATCH_KEY },
      create: { key: TERM_LATCH_KEY, value: stored },
      update: { value: stored },
    });
  }

  /**
   * Reopens a changeover that was settled too early.
   *
   * The latch is deliberately one-way for everyone else — once the term has
   * turned over it stays turned — so undoing a mistaken first pick has to be
   * somebody's explicit decision rather than the next person quietly
   * choosing again.
   */
  async reopenChangeover(auth: AuthContext) {
    const term = await this.currentTerm();
    if (!term.settledBy) {
      throw new BadRequestException(
        'This month is not settled, so there is nothing to reopen.',
      );
    }
    await this.prisma.appSetting.deleteMany({ where: { key: TERM_LATCH_KEY } });
    await this.audit.log(
      auth,
      'run-number.changeover.reopen',
      'AppSetting',
      undefined,
      {
        was: term.division,
        changeover: term.settledBy,
      },
    );
    return { reopened: true };
  }

  /**
   * Takes the next run number for a location.
   *
   * The counter and the record are written together: a number handed out but
   * not recorded, or recorded twice, both end up on a report that cannot be
   * reconciled. The unique constraint on the number is the backstop if two
   * people press the button at the same moment.
   */
  async issue(
    auth: AuthContext,
    locationId: number,
    opts: { division?: string; note?: string; eventId?: number } = {},
  ) {
    const term = await this.currentTerm();
    const division = term.division ?? opts.division;
    if (!division) {
      throw new BadRequestException(
        `This month could be either term; say which: ${(term.options ?? []).join(' or ')}`,
      );
    }
    if (term.options && !term.options.includes(division)) {
      throw new BadRequestException(
        `${division} is not one of this month's options`,
      );
    }
    // Picking the incoming term settles the changeover for everyone after.
    if (term.options) {
      const incoming = term.options[term.options.length - 1];
      if (division === incoming) {
        await this.settleTerm(division);
      }
    }

    const issued = await this.prisma.$transaction(async (tx) => {
      const location = await tx.runNumberLocation.findUnique({
        where: { id: locationId },
      });
      if (!location || !location.active) {
        throw new NotFoundException('Location not found');
      }
      const sequence = location.nextRun;
      const number = formatRunNumber(
        location.abbr,
        division,
        term.year,
        sequence,
      );
      const created = await tx.runNumber.create({
        data: {
          number,
          locationId,
          division,
          year: term.year,
          sequence,
          note: opts.note?.trim() || null,
          eventId: opts.eventId ?? null,
          issuedById: auth.kind === 'member' ? auth.memberId : null,
        },
        include: { location: { select: { abbr: true, name: true } } },
      });
      await tx.runNumberLocation.update({
        where: { id: locationId },
        data: { nextRun: sequence + 1 },
      });
      return created;
    });

    await this.audit.log(auth, 'run-number.issue', 'RunNumber', issued.id, {
      number: issued.number,
    });
    return issued;
  }

  async upsertLocation(
    auth: AuthContext,
    data: {
      id?: number;
      name: string;
      abbr: string;
      active?: boolean;
      nextRun?: number;
    },
  ) {
    const abbr = data.abbr.trim().toUpperCase();
    if (!/^[A-Z0-9']{1,8}$/.test(abbr)) {
      throw new BadRequestException(
        'An abbreviation is up to eight letters or digits',
      );
    }
    const clash = await this.prisma.runNumberLocation.findUnique({
      where: { abbr },
    });
    if (clash && clash.id !== data.id) {
      throw new ConflictException(`${abbr} is already in use`);
    }

    const location = data.id
      ? await this.prisma.runNumberLocation.update({
          where: { id: data.id },
          data: {
            name: data.name.trim(),
            abbr,
            ...(data.active === undefined ? {} : { active: data.active }),
            ...(data.nextRun === undefined
              ? {}
              : { nextRun: Math.max(1, data.nextRun) }),
          },
        })
      : await this.prisma.runNumberLocation.create({
          data: {
            name: data.name.trim(),
            abbr,
            active: data.active ?? true,
            nextRun: Math.max(1, data.nextRun ?? 1),
          },
        });

    await this.audit.log(
      auth,
      data.id ? 'run-number.location.update' : 'run-number.location.create',
      'RunNumberLocation',
      location.id,
      { name: location.name, abbr: location.abbr, nextRun: location.nextRun },
    );
    return location;
  }

  async saveDivisions(auth: AuthContext, config: DivisionConfig) {
    // Through `unknown`: a plain `as object` is stripped by the lint rule for
    // unnecessary assertions, which then leaves it failing to compile.
    const value = config as unknown as Prisma.InputJsonObject;
    await this.prisma.appSetting.upsert({
      where: { key: DIVISION_SETTING_KEY },
      create: { key: DIVISION_SETTING_KEY, value },
      update: { value },
    });
    await this.audit.log(
      auth,
      'run-number.divisions.save',
      'AppSetting',
      undefined,
      config,
    );
    return { ok: true };
  }
}
