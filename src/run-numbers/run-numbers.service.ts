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
  ambiguousOptions,
  divisionFor,
  formatRunNumber,
  type DivisionConfig,
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

  /** The current year and division, or the choice to be made if ambiguous. */
  async currentTerm(now = new Date()) {
    const config = await this.divisionConfig();
    // The month in the agency's timezone: an issue just before midnight on
    // the last of the month must not be filed under the next one.
    const { dateStr } = nyNow(now);
    const month = Number(dateStr.slice(5, 7)) - 1;
    return {
      year: dateStr.slice(2, 4),
      division: divisionFor(config, month),
      options: ambiguousOptions(config, month),
    };
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
        issuedBy: { select: { id: true, firstName: true, lastName: true } },
        event: { select: { id: true, title: true } },
      },
      orderBy: { issuedAt: 'desc' },
      take: Math.min(limit, 500),
    });
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
