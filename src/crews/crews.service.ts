import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import {
  addDays,
  fromDbDate,
  isBeforeDeadline,
  nyNow,
  nyToday,
  startOfWeek,
  toDbDate,
  weekdayOf,
} from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { CrewPosition } from '../generated/prisma/enums';
import {
  CrewEligibilityService,
  DayContext,
} from './crew-eligibility.service';

export const CREW_POSITIONS: CrewPosition[] = [
  'CC',
  'DRIVER',
  'ATTENDANT',
  'OBSERVER',
  'DUTY_SUP',
];

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface SlotView {
  position: CrewPosition;
  member?: { id: number; name: string };
  placeholder?: string;
  vacant: boolean;
  eligible?: boolean;
  reason?: string;
  canDrop?: boolean;
}

/** Whole days between two YYYY-MM-DD strings (both parsed as UTC midnight). */
function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

type CrewWithSlots = Awaited<ReturnType<CrewsService['loadWindow']>>[number];

@Injectable()
export class CrewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
    private readonly graph: CredentialGraphService,
    private readonly eligibility: CrewEligibilityService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  // ---------------------------------------------------------------- queries

  async getWeeks(
    memberId: number,
    viewDate?: string,
    canViewAll = false,
    mayActAsDutySup = false,
  ) {
    const now = nyNow();
    const knobs = await this.settings.scheduling();
    const thisWeek = startOfWeek(now.dateStr);
    let weekStart = startOfWeek(viewDate ?? now.dateStr);
    if (!canViewAll && weekStart > thisWeek) {
      // Members see the rolling public window going forward. Past weeks are
      // simply what happened, so everyone may page back through them.
      weekStart = thisWeek;
    }

    // Only generate crews from this week onward. Running the default template
    // over past dates would invent shifts nobody actually worked.
    const windowEnd = addDays(weekStart, 14);
    if (windowEnd > thisWeek) {
      const generateFrom = weekStart > thisWeek ? weekStart : thisWeek;
      await this.ensureCrewsExist(
        generateFrom,
        daysBetween(generateFrom, windowEnd),
      );
    }

    const windowStart = addDays(weekStart, -7 * (knobs.rotationWeeks - 1));
    const crews = await this.loadWindow(windowStart, addDays(weekStart, 13));
    const byDate = new Map(crews.map((c) => [fromDbDate(c.date), c]));

    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: memberId },
      select: { dob: true },
    });
    const heldKeys = await this.graph.heldKeys(memberId);
    const outstandingTraining = await this.outstandingBlockingTraining(memberId);

    const weeks: Array<Array<Record<string, unknown>>> = [[], []];
    for (let i = 0; i < 14; i++) {
      const dateStr = addDays(weekStart, i);
      const crew = byDate.get(dateStr);
      if (!crew) continue;

      // A night that has already happened is a record, not an opportunity:
      // no signup, no drop, and no eligibility to compute.
      const historical = dateStr < now.dateStr;
      const day = this.dayContext(crew, memberId);
      const rotationDates = this.memberDatesInRotation(
        crews,
        memberId,
        dateStr,
        knobs.rotationWeeks,
      );

      const slots: Record<string, SlotView> = {};
      for (const position of CREW_POSITIONS) {
        const slot = crew.slots.find((s) => s.position === position);
        const view: SlotView = { position, vacant: true };
        if (slot?.member) {
          view.vacant = false;
          view.member = {
            id: slot.member.id,
            name: `${slot.member.firstName.charAt(0)}. ${slot.member.lastName}`,
          };
          if (slot.member.id === memberId && !historical) {
            view.canDrop = isBeforeDeadline(
              now,
              dateStr,
              knobs.dropDeadline.daysBefore,
              knobs.dropDeadline.time,
            );
          }
        } else if (slot?.placeholder) {
          view.vacant = false;
          view.placeholder = slot.placeholder;
        } else if (historical) {
          view.eligible = false;
        } else {
          const result = await this.eligibility.check({
            member: { dob: member.dob, heldKeys, mayActAsDutySup },
            position,
            dateStr,
            now,
            knobs,
            day,
            memberDatesInRotation: rotationDates,
            outstandingTraining,
          });
          view.eligible = result.eligible;
          view.reason = result.reason;
        }
        slots[position] = view;
      }

      weeks[i < 7 ? 0 : 1].push({
        crewId: crew.id,
        date: dateStr,
        weekday: WEEKDAY_NAMES[weekdayOf(dateStr)],
        historical,
        slots,
      });
    }

    // Hand the caller its navigation targets rather than making it re-derive
    // who may look forward: history is open to all, the future is not.
    const forward = addDays(weekStart, 14);
    const nextViewDate = canViewAll
      ? forward
      : weekStart < thisWeek
        ? forward > thisWeek
          ? thisWeek
          : forward
        : null;

    return {
      weekStart,
      thisWeek,
      prevViewDate: addDays(weekStart, -14),
      nextViewDate,
      currentWeek: weeks[0],
      nextWeek: weeks[1],
    };
  }

  /**
   * Members a scheduler may put in each crew position: active only, and only
   * where they hold the credentials the position calls for. Probationary
   * drivers and crew chiefs are included — the trainer-on-shift rule is a
   * property of the night, not of the person, and schedulers may arrange it.
   */
  async assignableMembers() {
    const dutySupByPermission = await this.membersWithPermission(
      PERMISSIONS.SCHEDULE_DUTY_SUP,
    );
    const members = await this.prisma.member.findMany({
      where: { active: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        credentials: {
          where: { status: 'ACTIVE' },
          select: { type: { select: { key: true } } },
        },
      },
    });

    const out: Array<{
      id: number;
      firstName: string;
      lastName: string;
      positions: CrewPosition[];
    }> = [];
    for (const member of members) {
      const held = new Set(member.credentials.map((c) => c.type.key));
      const positions: CrewPosition[] = [];
      if ((await this.graph.satisfies(held, 'CC')) || held.has('P_CC')) {
        positions.push('CC');
      }
      if ((await this.graph.satisfies(held, 'D')) || held.has('P_D')) {
        positions.push('DRIVER');
      }
      if (await this.graph.satisfies(held, 'A')) positions.push('ATTENDANT');
      // The rider seat is the way in: open to any active member.
      positions.push('OBSERVER');
      if (
        (await this.graph.satisfies(held, 'DS')) ||
        dutySupByPermission.has(member.id)
      ) {
        positions.push('DUTY_SUP');
      }
      out.push({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        positions,
      });
    }
    return out;
  }

  /**
   * Active members who hold `permission`, whether from a role assigned
   * directly or from a role conferred by a credential they hold — the same
   * two sources the auth guard unions.
   */
  private async membersWithPermission(permission: string): Promise<Set<number>> {
    const today = nyToday();
    const [byRole, byCredential] = await Promise.all([
      this.prisma.memberRole.findMany({
        where: {
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
          member: { active: true },
          role: { permissions: { some: { permission } } },
        },
        select: { memberId: true },
      }),
      this.prisma.memberCredential.findMany({
        where: {
          status: 'ACTIVE',
          member: { active: true },
          type: {
            linkedRoles: { some: { role: { permissions: { some: { permission } } } } },
          },
        },
        select: { memberId: true },
      }),
    ]);
    return new Set([
      ...byRole.map((r) => r.memberId),
      ...byCredential.map((r) => r.memberId),
    ]);
  }

  // -------------------------------------------------------------- mutations

  async signup(
    memberId: number,
    crewId: number,
    position: CrewPosition,
    mayActAsDutySup = false,
  ) {
    const crew = await this.prisma.crew.findUnique({
      where: { id: crewId },
      include: {
        slots: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                credentials: {
                  where: { status: 'ACTIVE' },
                  include: { type: { select: { key: true } } },
                },
              },
            },
          },
        },
      },
    });
    if (!crew) throw new NotFoundException('Crew not found');

    const dateStr = fromDbDate(crew.date);
    const now = nyNow();
    const knobs = await this.settings.scheduling();
    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: memberId },
      select: { dob: true },
    });
    const heldKeys = await this.graph.heldKeys(memberId);

    const windowStart = addDays(
      startOfWeek(dateStr),
      -7 * (knobs.rotationWeeks - 1),
    );
    const windowCrews = await this.loadWindow(
      windowStart,
      addDays(startOfWeek(dateStr), 6),
    );

    const result = await this.eligibility.check({
      member: { dob: member.dob, heldKeys, mayActAsDutySup },
      position,
      dateStr,
      now,
      knobs,
      day: this.dayContext(crew, memberId),
      memberDatesInRotation: this.memberDatesInRotation(
        windowCrews,
        memberId,
        dateStr,
        knobs.rotationWeeks,
      ),
      outstandingTraining: await this.outstandingBlockingTraining(memberId),
    });
    if (!result.eligible) {
      throw new ForbiddenException(result.reason || 'Not eligible');
    }

    const updated = await this.prisma.crewSlot.updateMany({
      where: { crewId, position, memberId: null, placeholder: null },
      data: { memberId },
    });
    if (updated.count === 0) {
      throw new ConflictException('That spot was just taken');
    }
    return { ok: true };
  }

  async drop(memberId: number, crewId: number, position: CrewPosition) {
    const slot = await this.prisma.crewSlot.findUnique({
      where: { crewId_position: { crewId, position } },
      include: { crew: true },
    });
    if (!slot || slot.memberId !== memberId) {
      throw new ForbiddenException('You are not in that spot');
    }
    const knobs = await this.settings.scheduling();
    const dateStr = fromDbDate(slot.crew.date);
    if (
      !isBeforeDeadline(
        nyNow(),
        dateStr,
        knobs.dropDeadline.daysBefore,
        knobs.dropDeadline.time,
      )
    ) {
      throw new ForbiddenException(
        `Drops close at ${knobs.dropDeadline.time}, ${knobs.dropDeadline.daysBefore} days before the shift. Contact the scheduling coordinator.`,
      );
    }
    await this.prisma.crewSlot.update({
      where: { id: slot.id },
      data: { memberId: null },
    });
    return { ok: true };
  }

  /** Admin override — no eligibility checks, audited. */
  async assign(
    auth: AuthContext,
    crewId: number,
    position: CrewPosition,
    target: { memberId?: number | null; placeholder?: string | null },
  ) {
    const slot = await this.prisma.crewSlot.findUnique({
      where: { crewId_position: { crewId, position } },
    });
    if (!slot) throw new NotFoundException('Slot not found');
    const before = { memberId: slot.memberId, placeholder: slot.placeholder };
    await this.prisma.crewSlot.update({
      where: { id: slot.id },
      data: {
        memberId: target.memberId ?? null,
        placeholder: target.placeholder ?? null,
      },
    });
    await this.audit.log(
      auth,
      PERMISSIONS.SCHEDULE_CREWS_ASSIGN,
      'CrewSlot',
      slot.id,
      { before, after: target, crewId, position },
    );
    return { ok: true };
  }

  // ------------------------------------------------------------- generation

  /** Creates missing crews (with slots from the weekly template) in a range. */
  async ensureCrewsExist(fromDate: string, days: number) {
    const existing = await this.prisma.crew.findMany({
      where: {
        date: { gte: toDbDate(fromDate), lt: toDbDate(addDays(fromDate, days)) },
      },
      select: { date: true },
    });
    const have = new Set(existing.map((c) => fromDbDate(c.date)));
    const template = await this.prisma.defaultCrewTemplate.findMany();
    const absences = await this.prisma.crewAbsence.findMany({
      where: {
        date: { gte: toDbDate(fromDate), lt: toDbDate(addDays(fromDate, days)) },
      },
    });
    const absentOn = new Set(
      absences.map((a) => `${fromDbDate(a.date)}:${a.memberId}`),
    );

    for (let i = 0; i < days; i++) {
      const dateStr = addDays(fromDate, i);
      if (have.has(dateStr)) continue;
      const weekday = weekdayOf(dateStr);
      await this.prisma.crew.create({
        data: {
          date: toDbDate(dateStr),
          slots: {
            create: CREW_POSITIONS.map((position) => {
              const dflt = template.find(
                (t) => t.weekday === weekday && t.position === position,
              );
              // Declared absences suppress default-template placement.
              const defaultMember =
                dflt?.memberId && !absentOn.has(`${dateStr}:${dflt.memberId}`)
                  ? dflt.memberId
                  : null;
              return {
                position,
                memberId: defaultMember,
                placeholder: dflt?.placeholder ?? null,
              };
            }),
          },
        },
      });
    }
  }

  /** Scheduler assignment to any future date — creates the week on demand. */
  async assignByDate(
    auth: AuthContext,
    dateStr: string,
    position: CrewPosition,
    target: { memberId?: number | null; placeholder?: string | null },
  ) {
    // Create the one night being assigned, empty. Materialising the whole
    // week from the default template would invent shifts on the other six
    // days — the same trap that made past weeks unsafe to page back through.
    const crew = await this.prisma.crew.upsert({
      where: { date: toDbDate(dateStr) },
      create: {
        date: toDbDate(dateStr),
        slots: { create: CREW_POSITIONS.map((p) => ({ position: p })) },
      },
      update: {},
    });
    return this.assign(auth, crew.id, position, target);
  }

  /**
   * Week-at-a-time operations for a scheduler: emptying a week, or filling
   * its vacancies from the weekly template. Both skip nights that already
   * happened — the schedule is a record back there, not a plan.
   */
  async bulkWeek(
    auth: AuthContext,
    weekStart: string,
    action: 'clear' | 'apply-defaults',
  ) {
    const now = nyNow();
    const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).filter(
      (d) => d >= now.dateStr,
    );
    if (!dates.length) {
      throw new ConflictException('That week has already passed');
    }

    const template = await this.prisma.defaultCrewTemplate.findMany();
    const absences = await this.prisma.crewAbsence.findMany({
      where: {
        date: { gte: toDbDate(dates[0]), lte: toDbDate(dates[dates.length - 1]) },
      },
    });
    const absentOn = new Set(
      absences.map((a) => `${fromDbDate(a.date)}:${a.memberId}`),
    );

    let changed = 0;
    for (const dateStr of dates) {
      const crew = await this.prisma.crew.findUnique({
        where: { date: toDbDate(dateStr) },
        include: { slots: true },
      });
      if (!crew) continue;
      for (const slot of crew.slots) {
        if (action === 'clear') {
          if (slot.memberId === null && slot.placeholder === null) continue;
          await this.prisma.crewSlot.update({
            where: { id: slot.id },
            data: { memberId: null, placeholder: null },
          });
          changed++;
          continue;
        }
        // apply-defaults only fills what is empty; it never displaces anyone.
        if (slot.memberId !== null || slot.placeholder !== null) continue;
        const dflt = template.find(
          (t) => t.weekday === weekdayOf(dateStr) && t.position === slot.position,
        );
        if (!dflt) continue;
        const memberId =
          dflt.memberId && !absentOn.has(`${dateStr}:${dflt.memberId}`)
            ? dflt.memberId
            : null;
        if (memberId === null && !dflt.placeholder) continue;
        await this.prisma.crewSlot.update({
          where: { id: slot.id },
          data: { memberId, placeholder: dflt.placeholder ?? null },
        });
        changed++;
      }
    }
    await this.audit.log(auth, 'crews.bulk', 'Crew', undefined, {
      weekStart,
      action,
      changed,
    });
    return { changed, days: dates.length };
  }

  /** The caller's own upcoming shifts, including not-yet-public weeks. */
  async myUpcoming(memberId: number) {
    const slots = await this.prisma.crewSlot.findMany({
      where: {
        memberId,
        crew: { date: { gte: toDbDate(nyNow().dateStr) } },
      },
      include: { crew: true },
      orderBy: { crew: { date: 'asc' } },
    });
    const knobs = await this.settings.scheduling();
    const publicEnd = addDays(startOfWeek(nyNow().dateStr), 7 * knobs.publicWeeks);
    return slots.map((slot) => ({
      crewId: slot.crewId,
      date: fromDbDate(slot.crew.date),
      position: slot.position,
      isPublic: fromDbDate(slot.crew.date) < publicEnd,
    }));
  }

  // ------------------------------------------------------------- absences

  listAbsences(memberId: number) {
    return this.prisma.crewAbsence.findMany({
      where: { memberId, date: { gte: toDbDate(nyNow().dateStr) } },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Declare unavailability for a future date. Clears any slot already held
   * that day; within the public window the normal drop deadline applies,
   * beyond it the drop is free. The scheduling team is notified.
   */
  async declareAbsence(memberId: number, dateStr: string, note?: string) {
    const now = nyNow();
    if (dateStr <= now.dateStr) {
      throw new ForbiddenException('Absences must be for a future date');
    }
    const knobs = await this.settings.scheduling();
    const publicEnd = addDays(startOfWeek(now.dateStr), 7 * knobs.publicWeeks);

    const crew = await this.prisma.crew.findUnique({
      where: { date: toDbDate(dateStr) },
      include: { slots: true },
    });
    const heldSlots =
      crew?.slots.filter((slot) => slot.memberId === memberId) ?? [];

    if (heldSlots.length && dateStr < publicEnd) {
      if (
        !isBeforeDeadline(
          now,
          dateStr,
          knobs.dropDeadline.daysBefore,
          knobs.dropDeadline.time,
        )
      ) {
        throw new ForbiddenException(
          `Drops close at ${knobs.dropDeadline.time}, ${knobs.dropDeadline.daysBefore} days before the shift. Contact the scheduling coordinator.`,
        );
      }
    }

    for (const slot of heldSlots) {
      await this.prisma.crewSlot.update({
        where: { id: slot.id },
        data: { memberId: null },
      });
    }

    const absence = await this.prisma.crewAbsence.upsert({
      where: { memberId_date: { memberId, date: toDbDate(dateStr) } },
      create: { memberId, date: toDbDate(dateStr), note: note ?? null },
      update: { note: note ?? null },
    });

    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: memberId },
      select: { firstName: true, lastName: true },
    });
    const weekday = WEEKDAY_NAMES[weekdayOf(dateStr)];
    const onDefault = await this.prisma.defaultCrewTemplate.findFirst({
      where: { memberId, weekday: weekdayOf(dateStr) },
    });
    if (heldSlots.length || onDefault) {
      await this.notifications.notifyOfficerInboxes({
        type: 'crew.unfilled',
        subject: `Crew absence: ${member.firstName} ${member.lastName} — ${weekday} ${dateStr}`,
        body: heldSlots.length
          ? `Vacated ${heldSlots.map((s) => s.position).join(', ')}${note ? ` — "${note}"` : ''}`
          : `Will be skipped by the default template${note ? ` — "${note}"` : ''}`,
        task: {
          actionLabel: 'Fill the slot',
          actionUrl: `/admin/schedule?viewDate=${dateStr}`,
        },
      });
    }
    return absence;
  }

  async removeAbsence(memberId: number, absenceId: number) {
    const absence = await this.prisma.crewAbsence.findUnique({
      where: { id: absenceId },
    });
    if (!absence || absence.memberId !== memberId) {
      throw new ForbiddenException('Not your absence');
    }
    await this.prisma.crewAbsence.delete({ where: { id: absenceId } });
    return { ok: true };
  }

  /** Name of an outstanding blocksScheduling annual training for the member. */
  private async outstandingBlockingTraining(
    memberId: number,
  ): Promise<string | null> {
    const year = Number(nyNow().dateStr.slice(0, 4));
    const blocking = await this.prisma.annualTrainingRequirement.findMany({
      where: { active: true, blocksScheduling: true, year },
      include: { completions: { where: { memberId } } },
    });
    const outstanding = blocking.find(
      (req) => !req.completions.some((c) => c.completedAt != null),
    );
    return outstanding?.name ?? null;
  }

  // ---------------------------------------------------------------- helpers

  private loadWindow(fromDate: string, toDate: string) {
    return this.prisma.crew.findMany({
      where: { date: { gte: toDbDate(fromDate), lte: toDbDate(toDate) } },
      include: {
        slots: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                credentials: {
                  where: { status: 'ACTIVE' },
                  include: { type: { select: { key: true } } },
                },
              },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  private dayContext(crew: CrewWithSlots, memberId: number): DayContext {
    let memberOnThisDate = false;
    let ccTrainerOn = false;
    let driverTrainerOn = false;
    let attendantFilled = false;
    let observerFilled = false;
    for (const slot of crew.slots) {
      if (slot.memberId === memberId) memberOnThisDate = true;
      if (slot.position === 'ATTENDANT' && (slot.memberId || slot.placeholder))
        attendantFilled = true;
      if (slot.position === 'OBSERVER' && (slot.memberId || slot.placeholder))
        observerFilled = true;
      // Duty sup is not actively riding, so their quals don't count as "trainer on".
      if (slot.position === 'DUTY_SUP') continue;
      const keys = new Set(
        slot.member?.credentials?.map((c) => c.type.key) ?? [],
      );
      if (keys.has('CC_T')) ccTrainerOn = true;
      if (keys.has('D_T')) driverTrainerOn = true;
    }
    return {
      memberOnThisDate,
      ccTrainerOn,
      driverTrainerOn,
      attendantFilled,
      observerFilled,
    };
  }

  private memberDatesInRotation(
    crews: CrewWithSlots[],
    memberId: number,
    targetDate: string,
    rotationWeeks: number,
  ): string[] {
    const windowStart = addDays(
      startOfWeek(targetDate),
      -7 * (rotationWeeks - 1),
    );
    const windowEnd = addDays(startOfWeek(targetDate), 6);
    return crews
      .filter((c) => {
        const d = fromDbDate(c.date);
        return (
          d >= windowStart &&
          d <= windowEnd &&
          c.slots.some(
            (s) => s.memberId === memberId && s.position !== 'DUTY_SUP',
          )
        );
      })
      .map((c) => fromDbDate(c.date));
  }
}
