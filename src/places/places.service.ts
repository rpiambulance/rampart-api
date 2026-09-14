import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

export interface PlaceInput {
  name?: string;
  address?: string | null;
  notes?: string | null;
  active?: boolean;
  abbr?: string | null;
  parentId?: number | null;
  nextRun?: number;
}

/**
 * The places the agency goes.
 *
 * One list doing three jobs — where an event is, where a standby is worked,
 * and where the run numbers count — so one service edits it. Before this
 * they were three tables and two pages, and the same row could be renamed
 * from either with different permissions behind them.
 */
@Injectable()
export class PlacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list(includeInactive = false) {
    return this.prisma.place.findMany({
      where: includeInactive ? {} : { active: true },
      include: {
        parent: { select: { id: true, name: true, abbr: true } },
        spots: {
          where: includeInactive ? {} : { active: true },
          orderBy: [{ order: 'asc' }, { name: 'asc' }],
        },
        _count: { select: { runNumbers: true, standbys: true } },
      },
      orderBy: [{ name: 'asc' }],
    });
  }

  /**
   * The letter and the counter are not ordinary fields.
   *
   * The letter is inside every number the place issues and the counter is
   * the agency's own sequence, both of which the county reads back. Editing
   * the rest of a place is setup; editing these two is run numbers.
   */
  private requireCounterRights(auth: AuthContext, input: PlaceInput) {
    const touching = input.abbr !== undefined || input.nextRun !== undefined;
    if (!touching) return;
    if (!auth.permissions?.has(PERMISSIONS.RUN_NUMBERS_MANAGE)) {
      throw new ForbiddenException(
        'Changing a run-number letter or its counter needs run-numbers:manage.',
      );
    }
  }

  /** Eight characters at most, and unique: it has to fit in a run number. */
  private async cleanAbbr(abbr: string | null, id?: number) {
    if (abbr === null) return null;
    const clean = abbr.trim().toUpperCase();
    if (!clean) return null;
    if (!/^[A-Z0-9']{1,8}$/.test(clean)) {
      throw new BadRequestException(
        'An abbreviation is up to eight letters or digits',
      );
    }
    const clash = await this.prisma.place.findUnique({
      where: { abbr: clean },
    });
    if (clash && clash.id !== id) {
      throw new ConflictException(`${clean} is already in use`);
    }
    return clean;
  }

  /**
   * A place cannot file under itself, nor under something that files under
   * it: the walk looking for a counter has to end.
   */
  private async checkParent(id: number | undefined, parentId: number | null) {
    if (parentId === null) return;
    if (id && parentId === id) {
      throw new BadRequestException('A place cannot file under itself.');
    }
    const parent = await this.prisma.place.findUnique({
      where: { id: parentId },
      select: { id: true, parentId: true, abbr: true, name: true },
    });
    if (!parent) throw new NotFoundException('No such place to file under');
    if (id && parent.parentId === id) {
      throw new BadRequestException(
        `${parent.name} already files under this one.`,
      );
    }
    if (!parent.abbr && !parent.parentId) {
      throw new BadRequestException(
        `${parent.name} has no run-number letter of its own, so nothing would ` +
          'count there.',
      );
    }
  }

  async create(auth: AuthContext, input: PlaceInput) {
    if (!input.name?.trim()) {
      throw new BadRequestException('A place needs a name.');
    }
    this.requireCounterRights(auth, input);
    const abbr = await this.cleanAbbr(input.abbr ?? null);
    await this.checkParent(undefined, input.parentId ?? null);

    const place = await this.prisma.place.create({
      data: {
        name: input.name.trim(),
        address: input.address?.trim() || null,
        notes: input.notes?.trim() || null,
        abbr,
        parentId: input.parentId ?? null,
        nextRun: Math.max(1, input.nextRun ?? 1),
      },
    });
    await this.audit.log(auth, 'place.create', 'Place', place.id, {
      name: place.name,
      abbr: place.abbr,
    });
    return place;
  }

  async update(auth: AuthContext, id: number, input: PlaceInput) {
    this.requireCounterRights(auth, input);
    const before = await this.prisma.place.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('No such place');
    if (input.parentId !== undefined) {
      await this.checkParent(id, input.parentId ?? null);
    }
    const abbr =
      input.abbr === undefined
        ? undefined
        : await this.cleanAbbr(input.abbr, id);

    // Taking the letter off a place that has issued numbers would leave them
    // counting against a sequence nothing owns.
    if (abbr === null && before.abbr) {
      const issued = await this.prisma.runNumber.count({
        where: { placeId: id },
      });
      if (issued) {
        throw new BadRequestException(
          `${before.name} has issued ${issued} run number${
            issued === 1 ? '' : 's'
          } under ${before.abbr}. The letter stays with them.`,
        );
      }
    }

    const place = await this.prisma.place.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.address !== undefined
          ? { address: input.address?.trim() || null }
          : {}),
        ...(input.notes !== undefined
          ? { notes: input.notes?.trim() || null }
          : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
        ...(abbr !== undefined ? { abbr } : {}),
        ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
        ...(input.nextRun !== undefined
          ? { nextRun: Math.max(1, input.nextRun) }
          : {}),
      },
    });

    // The sequence and the letter are worth their own line in the log: they
    // are what a number filed with the county is made of.
    if (abbr !== undefined || input.nextRun !== undefined) {
      await this.audit.log(auth, 'place.counter', 'Place', id, {
        abbr: place.abbr,
        nextRun: place.nextRun,
        was: { abbr: before.abbr, nextRun: before.nextRun },
      });
    } else {
      await this.audit.log(auth, 'place.update', 'Place', id, {
        name: place.name,
      });
    }
    return place;
  }

  addSpot(placeId: number, name: string, order?: number) {
    return this.prisma.placeSpot.create({
      data: { placeId, name: name.trim(), order: order ?? 0 },
    });
  }

  updateSpot(
    id: number,
    input: { name?: string; order?: number; active?: boolean },
  ) {
    return this.prisma.placeSpot.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.order !== undefined ? { order: input.order } : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
      },
    });
  }

  /** Retired rather than deleted: past standbys still point at it. */
  retireSpot(id: number) {
    return this.prisma.placeSpot.update({
      where: { id },
      data: { active: false },
    });
  }
}
