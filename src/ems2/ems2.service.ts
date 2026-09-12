import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { RunNumbersService } from '../run-numbers/run-numbers.service';
import {
  advisoryProblems,
  blockingProblems,
  formCounts,
  inChargeConflict,
  mayReadAllEncounters,
  type EncounterShape,
} from './standby-logic';
import type {
  EncounterCategory,
  EncounterDisposition,
  StandbyRole,
  UnitStatus,
} from '../generated/prisma/enums';

/** Everything a screen needs about one standby, in a single read. */
const STANDBY_INCLUDE = {
  event: {
    select: { id: true, title: true, startsAt: true, endsAt: true, kind: true },
  },
  venue: {
    include: {
      locations: { where: { active: true }, orderBy: { order: 'asc' } },
    },
  },
  personnel: {
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          preferredFirstName: true,
          lastName: true,
        },
      },
      assignments: true,
    },
    orderBy: { id: 'asc' },
  },
  units: {
    include: {
      currentLocation: true,
      stagingLocation: true,
      assignments: {
        include: {
          personnel: {
            include: {
              member: {
                select: {
                  id: true,
                  firstName: true,
                  preferredFirstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { id: 'asc' },
  },
} as const;

@Injectable()
export class Ems2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly runNumbers: RunNumbersService,
  ) {}

  // ------------------------------------------------------------- the record

  /**
   * Opens the standby for an event, seeding it from who signed up.
   *
   * The signups are a starting point and nothing more: from here the standby
   * keeps its own list, because people arrive who never signed up and work
   * roles they never put their name to.
   */
  async open(auth: AuthContext, eventId: number, venueId?: number) {
    const existing = await this.prisma.standbyLog.findUnique({
      where: { eventId },
    });
    if (existing) return this.get(auth, existing.id);

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { signups: true },
    });
    if (!event) throw new NotFoundException('No such event');

    const memberId = auth.kind === 'member' ? auth.memberId : null;
    const standby = await this.prisma.standbyLog.create({
      data: {
        eventId,
        venueId: venueId ?? null,
        createdById: memberId,
        sponsorOperator: 'RPI Ambulance',
        personnel: {
          create: event.signups.map((signup) => ({
            memberId: signup.memberId,
            // The signup's position is a plan, not a role on the day. Only
            // an explicit event-supervisor signup carries over as one.
            role: signup.position?.toLowerCase() === 'ees' ? 'EES' : 'CREW',
            fromSignup: true,
            addedById: memberId,
          })),
        },
      },
    });
    await this.log(standby.id, 'standby.opened', auth, {
      detail: { eventId, seeded: event.signups.length },
    });
    await this.audit.log(auth, 'standby.open', 'StandbyLog', standby.id, {
      eventId,
      seeded: event.signups.length,
    });
    return this.get(auth, standby.id);
  }

  /** One standby, with what the caller is allowed to see of it. */
  async get(auth: AuthContext, id: number) {
    const standby = await this.prisma.standbyLog.findUnique({
      where: { id },
      include: STANDBY_INCLUDE,
    });
    if (!standby) throw new NotFoundException('No such standby');

    const viewer = await this.viewerOf(auth, standby.id);
    const encounters = await this.encountersFor(auth, standby.id);
    return {
      ...standby,
      viewer,
      encounters,
      counts: formCounts(
        await this.prisma.encounter.findMany({
          where: { standbyId: id },
          select: {
            category: true,
            disposition: true,
            died: true,
            intoxicationSigns: true,
          },
        }),
      ),
    };
  }

  list(limit = 50) {
    return this.prisma.standbyLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
      include: {
        event: { select: { id: true, title: true, startsAt: true } },
        venue: { select: { id: true, name: true } },
        _count: { select: { encounters: true, personnel: true, units: true } },
      },
    });
  }

  async update(
    auth: AuthContext,
    id: number,
    data: {
      venueId?: number | null;
      venueText?: string | null;
      startedAt?: string | null;
      endedAt?: string | null;
      totalAttendance?: number | null;
      totalEstimated?: boolean;
      peakAttendance?: number | null;
      peakEstimated?: boolean;
      sponsorOperator?: string | null;
      unusualOccurrences?: string | null;
      completedByName?: string | null;
      completedByTitle?: string | null;
      completedByPhone?: string | null;
    },
  ) {
    const standby = await this.prisma.standbyLog.update({
      where: { id },
      data: {
        ...data,
        startedAt: data.startedAt
          ? new Date(data.startedAt)
          : data.startedAt === null
            ? null
            : undefined,
        endedAt: data.endedAt
          ? new Date(data.endedAt)
          : data.endedAt === null
            ? null
            : undefined,
      },
    });
    await this.audit.log(auth, 'standby.update', 'StandbyLog', id, data);
    return standby;
  }

  /**
   * Marks the record finished.
   *
   * Not sealed: an encounter can still be corrected afterward, because a
   * county run number often arrives days later. What closing says is that
   * nothing new is expected and the exports can be taken from it.
   */
  async close(auth: AuthContext, id: number) {
    const open = await this.prisma.encounter.count({
      where: { standbyId: id, closedAt: null },
    });
    if (open) {
      throw new BadRequestException(
        `${open} encounter${open === 1 ? ' is' : 's are'} still open. Close ` +
          'them before closing the standby.',
      );
    }
    const standby = await this.prisma.standbyLog.update({
      where: { id },
      data: {
        closedAt: new Date(),
        closedById: auth.kind === 'member' ? auth.memberId : null,
        endedAt: undefined,
      },
    });
    await this.log(id, 'standby.closed', auth);
    await this.audit.log(auth, 'standby.close', 'StandbyLog', id);
    return standby;
  }

  async reopen(auth: AuthContext, id: number) {
    const standby = await this.prisma.standbyLog.update({
      where: { id },
      data: { closedAt: null, closedById: null },
    });
    await this.log(id, 'standby.reopened', auth);
    await this.audit.log(auth, 'standby.reopen', 'StandbyLog', id);
    return standby;
  }

  // ---------------------------------------------------------------- people

  async addPersonnel(
    auth: AuthContext,
    standbyId: number,
    input: { memberId: number; role?: StandbyRole; note?: string },
  ) {
    const existing = await this.prisma.standbyPersonnel.findUnique({
      where: { standbyId_memberId: { standbyId, memberId: input.memberId } },
    });
    // Somebody who left and came back is the same person, not a second row.
    const person = existing
      ? await this.prisma.standbyPersonnel.update({
          where: { id: existing.id },
          data: {
            removedAt: null,
            removedById: null,
            role: input.role ?? existing.role,
            note: input.note ?? existing.note,
          },
        })
      : await this.prisma.standbyPersonnel.create({
          data: {
            standbyId,
            memberId: input.memberId,
            role: input.role ?? 'CREW',
            note: input.note?.trim() || null,
            addedById: auth.kind === 'member' ? auth.memberId : null,
          },
        });
    if (person.role === 'EES_IC')
      await this.standDownOthers(auth, standbyId, person.id);
    await this.log(
      standbyId,
      existing ? 'personnel.returned' : 'personnel.added',
      auth,
      {
        memberId: input.memberId,
        detail: { role: person.role },
      },
    );
    return person;
  }

  async setRole(
    auth: AuthContext,
    standbyId: number,
    personnelId: number,
    role: StandbyRole,
  ) {
    const person = await this.prisma.standbyPersonnel.update({
      where: { id: personnelId },
      data: { role },
    });
    if (role === 'EES_IC')
      await this.standDownOthers(auth, standbyId, personnelId);
    await this.log(standbyId, 'personnel.role', auth, {
      memberId: person.memberId,
      detail: { role },
    });
    await this.audit.log(
      auth,
      'standby.personnel.role',
      'StandbyPersonnel',
      personnelId,
      { role },
    );
    return person;
  }

  /** Only one supervisor is in charge; promoting a second stands the first down. */
  private async standDownOthers(
    auth: AuthContext,
    standbyId: number,
    promoting: number,
  ) {
    const all = await this.prisma.standbyPersonnel.findMany({
      where: { standbyId },
      select: { id: true, role: true, removedAt: true },
    });
    const displaced = inChargeConflict(all, promoting);
    if (!displaced.length) return;
    await this.prisma.standbyPersonnel.updateMany({
      where: { id: { in: displaced } },
      data: { role: 'EES' },
    });
    await this.log(standbyId, 'personnel.stood-down', auth, {
      detail: { personnelIds: displaced },
    });
  }

  async removePersonnel(
    auth: AuthContext,
    standbyId: number,
    personnelId: number,
  ) {
    const person = await this.prisma.standbyPersonnel.update({
      where: { id: personnelId },
      data: {
        removedAt: new Date(),
        removedById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    // Somebody who has gone home is not on a unit.
    await this.prisma.unitAssignment.updateMany({
      where: { personnelId, removedAt: null },
      data: { removedAt: new Date() },
    });
    await this.log(standbyId, 'personnel.removed', auth, {
      memberId: person.memberId,
    });
    return person;
  }

  // ----------------------------------------------------------------- units

  async addUnit(
    auth: AuthContext,
    standbyId: number,
    input: { designatorId?: number; name?: string; kind?: string },
  ) {
    let name = input.name?.trim();
    let kind = input.kind?.trim() || null;
    if (input.designatorId) {
      const designator = await this.prisma.unitDesignator.findUnique({
        where: { id: input.designatorId },
      });
      if (!designator) throw new NotFoundException('No such unit designator');
      name = designator.name;
      kind = kind ?? designator.kind;
    }
    if (!name)
      throw new BadRequestException('A unit needs a designator or a name.');

    const unit = await this.prisma.standbyUnit.create({
      data: {
        standbyId,
        designatorId: input.designatorId ?? null,
        name,
        kind,
        createdById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.log(standbyId, 'unit.created', auth, {
      unitId: unit.id,
      detail: { name },
    });
    return unit;
  }

  async updateUnit(
    auth: AuthContext,
    standbyId: number,
    unitId: number,
    data: {
      status?: UnitStatus;
      currentLocationId?: number | null;
      currentLocationText?: string | null;
      stagingLocationId?: number | null;
      stagingLocationText?: string | null;
    },
  ) {
    const before = await this.prisma.standbyUnit.findUnique({
      where: { id: unitId },
    });
    if (!before) throw new NotFoundException('No such unit');
    const unit = await this.prisma.standbyUnit.update({
      where: { id: unitId },
      data,
    });

    // Logged as separate things because they are: where a unit is and what it
    // is doing are read off the board differently.
    if (data.status && data.status !== before.status) {
      await this.log(standbyId, 'unit.status', auth, {
        unitId,
        detail: { from: before.status, to: data.status },
      });
    }
    const movedTo =
      data.currentLocationId !== undefined ||
      data.currentLocationText !== undefined;
    if (movedTo) {
      await this.log(standbyId, 'unit.moved', auth, {
        unitId,
        detail: {
          locationId: unit.currentLocationId,
          locationText: unit.currentLocationText,
        },
      });
    }
    return unit;
  }

  async retireUnit(auth: AuthContext, standbyId: number, unitId: number) {
    const unit = await this.prisma.standbyUnit.update({
      where: { id: unitId },
      data: { retiredAt: new Date(), status: 'OUT_OF_SERVICE' },
    });
    await this.prisma.unitAssignment.updateMany({
      where: { unitId, removedAt: null },
      data: { removedAt: new Date() },
    });
    await this.log(standbyId, 'unit.retired', auth, { unitId });
    return unit;
  }

  /**
   * Puts somebody on a unit.
   *
   * Nothing stops them being on another at the same time — a transport
   * driver is on the ambulance and still on their own unit, and the board
   * has to show them in both places.
   */
  async assign(
    auth: AuthContext,
    standbyId: number,
    unitId: number,
    input: { personnelId: number; position?: string },
  ) {
    const person = await this.prisma.standbyPersonnel.findUnique({
      where: { id: input.personnelId },
    });
    if (!person || person.standbyId !== standbyId) {
      throw new NotFoundException('That person is not on this standby');
    }
    if (person.removedAt) {
      throw new BadRequestException(
        'They have been marked as having left. Add them back first.',
      );
    }
    const already = await this.prisma.unitAssignment.findFirst({
      where: { unitId, personnelId: input.personnelId, removedAt: null },
    });
    if (already) return already;

    const assignment = await this.prisma.unitAssignment.create({
      data: {
        unitId,
        personnelId: input.personnelId,
        position: input.position?.trim() || null,
      },
    });
    await this.log(standbyId, 'crew.assigned', auth, {
      unitId,
      memberId: person.memberId,
      detail: { position: assignment.position },
    });
    return assignment;
  }

  async unassign(auth: AuthContext, standbyId: number, assignmentId: number) {
    const assignment = await this.prisma.unitAssignment.update({
      where: { id: assignmentId },
      data: { removedAt: new Date() },
      include: { personnel: true },
    });
    await this.log(standbyId, 'crew.unassigned', auth, {
      unitId: assignment.unitId,
      memberId: assignment.personnel.memberId,
    });
    return assignment;
  }

  // ------------------------------------------------------------ encounters

  /** What this caller may see, which is not always everything. */
  private async viewerOf(auth: AuthContext, standbyId: number) {
    const memberId = auth.kind === 'member' ? auth.memberId : null;
    const person = memberId
      ? await this.prisma.standbyPersonnel.findUnique({
          where: { standbyId_memberId: { standbyId, memberId } },
        })
      : null;
    const hasReadAllPermission =
      auth.permissions?.has(PERMISSIONS.STANDBYS_READ_ALL) ?? false;
    return {
      memberId,
      personnelId: person?.id ?? null,
      role: person?.role ?? null,
      mayReadAll: mayReadAllEncounters({
        role: person?.role ?? null,
        hasReadAllPermission,
      }),
      mayManage: auth.permissions?.has(PERMISSIONS.STANDBYS_MANAGE) ?? false,
    };
  }

  async encountersFor(auth: AuthContext, standbyId: number) {
    const viewer = await this.viewerOf(auth, standbyId);
    return this.prisma.encounter.findMany({
      where: {
        standbyId,
        // A crew member sees what they wrote. Supervisors see the standby.
        ...(viewer.mayReadAll ? {} : { createdById: viewer.memberId ?? -1 }),
      },
      orderBy: { sequence: 'asc' },
      include: {
        hospital: true,
        runNumber: { select: { id: true, number: true } },
        unit: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async openEncounter(
    auth: AuthContext,
    standbyId: number,
    input: { unitId?: number; locationId?: number; locationText?: string },
  ) {
    await this.requireOnStandby(auth, standbyId);
    const last = await this.prisma.encounter.findFirst({
      where: { standbyId },
      orderBy: { sequence: 'desc' },
      select: { sequence: true },
    });
    const encounter = await this.prisma.encounter.create({
      data: {
        standbyId,
        sequence: (last?.sequence ?? 0) + 1,
        unitId: input.unitId ?? null,
        locationId: input.locationId ?? null,
        locationText: input.locationText?.trim() || null,
        // Deliberately the least alarming defaults: a new encounter is a
        // minor injury treated and released until somebody says otherwise.
        category: 'MINOR_INJURY',
        disposition: 'TREATED_RELEASED',
        createdById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.log(standbyId, 'encounter.opened', auth, {
      encounterId: encounter.id,
      unitId: input.unitId,
    });
    return encounter;
  }

  async updateEncounter(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
    data: Partial<{
      unitId: number | null;
      patientInitials: string | null;
      patientAge: number | null;
      patientAgeUnit: string | null;
      category: EncounterCategory;
      died: boolean;
      intoxicationSigns: boolean;
      chiefComplaint: string | null;
      treatment: string | null;
      narrative: string | null;
      disposition: EncounterDisposition;
      hospitalId: number | null;
      turnoverAgency: string | null;
      firstAidOnly: boolean;
      runNumberId: number | null;
      countyRunNumber: string | null;
      prid: string | null;
      locationId: number | null;
      locationText: string | null;
    }>,
  ) {
    const current = await this.mineOrVisible(auth, standbyId, encounterId);
    const merged = { ...current, ...data } as EncounterShape;
    const blocking = blockingProblems(merged);
    // Only checked on the way to closed: a half-filled encounter is the
    // normal state of one while the patient is still in front of you.
    if (current.closedAt && blocking.length) {
      throw new BadRequestException({
        message: blocking.map((p) => p.message).join(' '),
        problems: blocking,
      });
    }
    const encounter = await this.prisma.encounter.update({
      where: { id: encounterId },
      data,
    });
    return { ...encounter, advisories: advisoryProblems(merged) };
  }

  /** Finishing one, which is where the rules are actually enforced. */
  async closeEncounter(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
  ) {
    const current = await this.mineOrVisible(auth, standbyId, encounterId);
    const blocking = blockingProblems(current);
    if (blocking.length) {
      throw new BadRequestException({
        message: blocking.map((p) => p.message).join(' '),
        problems: blocking,
      });
    }
    const encounter = await this.prisma.encounter.update({
      where: { id: encounterId },
      data: { closedAt: new Date() },
    });
    await this.log(standbyId, 'encounter.closed', auth, { encounterId });
    await this.audit.log(
      auth,
      'standby.encounter.close',
      'Encounter',
      encounterId,
      {
        category: encounter.category,
        disposition: encounter.disposition,
      },
    );
    return {
      ...encounter,
      advisories: advisoryProblems(current),
    };
  }

  /**
   * Issues a run number for an encounter, from the same pool as everything
   * else, tagged to the event so it reconciles with the run-number log.
   */
  async issueRunNumber(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
    locationId: number,
  ) {
    const encounter = await this.mineOrVisible(auth, standbyId, encounterId);
    if (encounter.runNumberId) {
      throw new BadRequestException('This encounter already has a run number.');
    }
    const standby = await this.prisma.standbyLog.findUniqueOrThrow({
      where: { id: standbyId },
      select: { eventId: true },
    });
    const issued = await this.runNumbers.issue(auth, locationId, {
      eventId: standby.eventId,
      note: `Standby encounter #${encounter.sequence}`,
    });
    await this.prisma.encounter.update({
      where: { id: encounterId },
      data: { runNumberId: issued.id },
    });
    await this.log(standbyId, 'encounter.run-number', auth, {
      encounterId,
      detail: { number: issued.number },
    });
    return issued;
  }

  // ------------------------------------------------------------- the record

  private async requireOnStandby(auth: AuthContext, standbyId: number) {
    if (auth.kind !== 'member') return;
    if (auth.permissions?.has(PERMISSIONS.STANDBYS_MANAGE)) return;
    const person = await this.prisma.standbyPersonnel.findUnique({
      where: { standbyId_memberId: { standbyId, memberId: auth.memberId } },
    });
    if (!person || person.removedAt) {
      throw new ForbiddenException('You are not on this standby.');
    }
  }

  private async mineOrVisible(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
  ) {
    const encounter = await this.prisma.encounter.findUnique({
      where: { id: encounterId },
    });
    if (!encounter || encounter.standbyId !== standbyId) {
      throw new NotFoundException('No such encounter');
    }
    const viewer = await this.viewerOf(auth, standbyId);
    const mine = encounter.createdById === viewer.memberId;
    if (!viewer.mayReadAll && !mine) {
      throw new ForbiddenException('That encounter is not yours to read.');
    }
    return encounter;
  }

  async timeline(standbyId: number) {
    const entries = await this.prisma.standbyTimelineEntry.findMany({
      where: { standbyId },
      orderBy: { at: 'asc' },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
    });
    // The id is a BigInt, which JSON cannot carry. Stringified here rather
    // than narrowed to a number: the timeline is the one table that grows
    // per action rather than per thing.
    return entries.map((entry) => ({ ...entry, id: String(entry.id) }));
  }

  /** One line in the record of what happened. */
  private async log(
    standbyId: number,
    kind: string,
    auth: AuthContext,
    extra: {
      unitId?: number | null;
      encounterId?: number | null;
      memberId?: number | null;
      detail?: unknown;
    } = {},
  ) {
    await this.prisma.standbyTimelineEntry.create({
      data: {
        standbyId,
        kind,
        unitId: extra.unitId ?? null,
        encounterId: extra.encounterId ?? null,
        memberId: extra.memberId ?? null,
        actorId: auth.kind === 'member' ? auth.memberId : null,
        detail: extra.detail ?? undefined,
      },
    });
  }
}
