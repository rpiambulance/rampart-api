import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { nyDayStart, nyNow } from '../common/dates';
import { displayName } from '../common/name';
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
import { describeTimelineEntry, type TimelineNames } from './timeline-text';
import type {
  EncounterCategory,
  EncounterDisposition,
  EncounterVoid,
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

/** What is never kept about a patient who was never there. */
const PATIENT_FIELDS = [
  'patientInitials',
  'patientAge',
  'patientAgeUnit',
  'died',
  'intoxicationSigns',
  'chiefComplaint',
  'treatment',
  'prid',
  'hospitalId',
  'turnoverAgency',
] as const;

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
  async open(
    auth: AuthContext,
    input:
      | { eventId: number; venueId?: number }
      | {
          event: {
            title: string;
            startsAt: string;
            endsAt: string;
            kindId: number;
          };
          venueId?: number;
        },
  ) {
    // Something happened that nobody put on the calendar. The event is made
    // here rather than the standby being allowed to float free of one:
    // run numbers tag to an event, and both exports read its title and kind.
    //
    // Hidden, because it is not a calendar event and never was. Nobody was
    // asked to sign up for it, it is over by the time it is recorded, and a
    // calendar that fills up with things that already happened is one
    // nobody reads. Hidden keeps it off the events list, out of the ICS
    // feed and out of Google, while the record it exists for stays whole.
    const eventId =
      'eventId' in input
        ? input.eventId
        : (
            await this.prisma.event.create({
              data: {
                title: input.event.title.trim(),
                startsAt: new Date(input.event.startsAt),
                endsAt: new Date(input.event.endsAt),
                kindId: input.event.kindId,
                hidden: true,
              },
            })
          ).id;
    const venueId = input.venueId;

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
            // Counted as nobody. Selected rather than assumed, because a
            // column left out here reads as "not voided" and quietly puts
            // an unfounded call back on the board's totals.
            voidedAs: true,
          },
        }),
      ),
    };
  }

  /**
   * Events a standby could still be opened for.
   *
   * Future ones only, and only those without a standby already. Asked of the
   * database rather than worked out by comparing two lists in the browser:
   * the standby list is capped, so an event with an older standby would
   * otherwise be offered again.
   */
  openableEvents(limit = 50) {
    return this.prisma.event.findMany({
      where: {
        hidden: false,
        // From the start of today, so an event already under way is still
        // offered — which is when somebody usually remembers to open one.
        startsAt: { gte: nyDayStart(nyNow().dateStr) },
        standby: { is: null },
      },
      orderBy: { startsAt: 'asc' },
      take: Math.min(limit, 200),
      select: {
        id: true,
        title: true,
        startsAt: true,
        endsAt: true,
        kind: { select: { name: true } },
      },
    });
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
    const [encounters, personnel] = await Promise.all([
      this.prisma.encounter.count({ where: { standbyId: id } }),
      this.prisma.standbyPersonnel.count({ where: { standbyId: id } }),
    ]);
    await this.log(id, 'standby.closed', auth, {
      detail: { encounters, personnel },
    });
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

  /**
   * Discards a standby that turned out not to be one.
   *
   * Opened against the wrong event, or an ad-hoc event created by mistake.
   * Refused once there are encounters on it, for the same reason deleting
   * the event is: they are the record of who was treated, and a tidy-up is
   * not a reason to lose it.
   *
   * The event is left alone. It may well be a real event somebody still
   * wants on the calendar — only the standby opened against it goes.
   */
  async discard(auth: AuthContext, id: number) {
    const encounters = await this.prisma.encounter.count({
      where: { standbyId: id },
    });
    if (encounters) {
      throw new BadRequestException(
        `There ${encounters === 1 ? 'is' : 'are'} ${encounters} patient ` +
          `encounter${encounters === 1 ? '' : 's'} on this standby. Those are ` +
          'the record of who was treated, so it cannot be discarded.',
      );
    }
    const standby = await this.prisma.standbyLog.findUnique({
      where: { id },
      select: { eventId: true },
    });
    if (!standby) throw new NotFoundException('No such standby');
    await this.prisma.standbyLog.delete({ where: { id } });
    await this.audit.log(auth, 'standby.discard', 'StandbyLog', id, {
      eventId: standby.eventId,
    });
    return { ok: true, eventId: standby.eventId };
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
      select: { id: true, memberId: true, role: true, removedAt: true },
    });
    const displaced = inChargeConflict(all, promoting);
    if (!displaced.length) return;
    await this.prisma.standbyPersonnel.updateMany({
      where: { id: { in: displaced } },
      data: { role: 'EES' },
    });
    await this.log(standbyId, 'personnel.stood-down', auth, {
      detail: {
        personnelIds: displaced,
        memberIds: all
          .filter((person) => displaced.includes(person.id))
          .map((person) => person.memberId),
      },
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
      detail: { role: person.role },
    });
    return person;
  }

  // ----------------------------------------------------------------- units

  async addUnit(
    auth: AuthContext,
    standbyId: number,
    input: { designatorId?: number; name?: string },
  ) {
    let name = input.name?.trim();
    if (input.designatorId) {
      const designator = await this.prisma.unitDesignator.findUnique({
        where: { id: input.designatorId },
      });
      if (!designator) throw new NotFoundException('No such unit designator');
      name = designator.name;
    }
    if (!name)
      throw new BadRequestException('A unit needs a designator or a name.');

    const unit = await this.prisma.standbyUnit.create({
      data: {
        standbyId,
        designatorId: input.designatorId ?? null,
        name,
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
        detail: { name: unit.name, from: before.status, to: data.status },
      });
    }
    const movedTo =
      data.currentLocationId !== undefined ||
      data.currentLocationText !== undefined;
    if (movedTo) {
      // The place is named in the entry, not only pointed at: a location
      // renamed or retired next season should not rewrite last season's log.
      const location = unit.currentLocationId
        ? await this.prisma.venueLocation.findUnique({
            where: { id: unit.currentLocationId },
            select: { name: true },
          })
        : null;
      await this.log(standbyId, 'unit.moved', auth, {
        unitId,
        detail: {
          name: unit.name,
          locationId: unit.currentLocationId,
          locationName: location?.name ?? null,
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
    await this.log(standbyId, 'unit.retired', auth, {
      unitId,
      detail: { name: unit.name },
    });
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
    const unit = await this.prisma.standbyUnit.findUnique({
      where: { id: unitId },
      select: { name: true },
    });
    await this.log(standbyId, 'crew.assigned', auth, {
      unitId,
      memberId: person.memberId,
      detail: { name: unit?.name, position: assignment.position },
    });
    return assignment;
  }

  async unassign(auth: AuthContext, standbyId: number, assignmentId: number) {
    const assignment = await this.prisma.unitAssignment.update({
      where: { id: assignmentId },
      data: { removedAt: new Date() },
      include: { personnel: true },
    });
    const unit = await this.prisma.standbyUnit.findUnique({
      where: { id: assignment.unitId },
      select: { name: true },
    });
    await this.log(standbyId, 'crew.unassigned', auth, {
      unitId: assignment.unitId,
      memberId: assignment.personnel.memberId,
      detail: { name: unit?.name, position: assignment.position },
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
      mayDelete: auth.permissions?.has(PERMISSIONS.STANDBYS_DELETE) ?? false,
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
      detail: {
        sequence: encounter.sequence,
        locationId: encounter.locationId,
        locationText: encounter.locationText,
      },
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
    // There is no patient on a voided encounter, whatever a form still has
    // in it. The narrative survives: "searched the north lawn, nobody
    // there" is the reason it was voided, not patient care.
    if (current.voidedAs) {
      for (const field of PATIENT_FIELDS) delete data[field];
    }
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
    await this.log(standbyId, 'encounter.closed', auth, {
      encounterId,
      detail: {
        sequence: encounter.sequence,
        category: encounter.category,
        disposition: encounter.disposition,
      },
    });
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
   * Opens a closed encounter again.
   *
   * Something was wrong or something was missed, and the alternative is a
   * second encounter for one patient, which is worse for the record than an
   * edit is. Refused on a closed standby: the standby was closed on the
   * promise that nothing on it was still open, so that has to be undone
   * first and deliberately.
   */
  async reopenEncounter(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
  ) {
    const current = await this.mineOrVisible(auth, standbyId, encounterId);
    if (!current.closedAt) return current;

    const standby = await this.prisma.standbyLog.findUniqueOrThrow({
      where: { id: standbyId },
      select: { closedAt: true },
    });
    if (standby.closedAt) {
      throw new BadRequestException(
        'This standby is closed. Reopen the standby first.',
      );
    }

    const encounter = await this.prisma.encounter.update({
      where: { id: encounterId },
      data: { closedAt: null },
    });
    await this.log(standbyId, 'encounter.reopened', auth, {
      encounterId,
      detail: { sequence: encounter.sequence },
    });
    await this.audit.log(
      auth,
      'standby.encounter.reopen',
      'Encounter',
      encounterId,
    );
    return { ...encounter, advisories: advisoryProblems(encounter) };
  }

  /**
   * Marks an encounter as one that turned out not to be a patient encounter.
   *
   * Two things go wrong in different ways. An unfounded call happened — a
   * unit went, somebody looked, there was nobody to treat — and the record
   * should say so. A row created in error never happened at all.
   *
   * Available to whoever may write the encounter up rather than to an
   * officer: this is the correction, and deleting is the thing that needs
   * the permission. Marking it unfounded takes the patient fields with it,
   * because an unfounded call has no patient and a form that still carries
   * initials is a form somebody has to explain.
   *
   * Closes it as a side effect: there is nothing left to fill in, and an
   * encounter left open holds the whole standby open.
   */
  async voidEncounter(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
    input: { as: EncounterVoid | null; note?: string | null },
  ) {
    await this.requireOnStandby(auth, standbyId);
    const current = await this.mineOrVisible(auth, standbyId, encounterId);

    if (!input.as) {
      // Undoing it. What was cleared stays cleared — it was cleared on
      // purpose — and whoever is putting it back types it in again.
      const restored = await this.prisma.encounter.update({
        where: { id: encounterId },
        data: {
          voidedAs: null,
          voidedAt: null,
          voidedById: null,
          voidNote: null,
          closedAt: null,
        },
      });
      await this.log(standbyId, 'encounter.unvoided', auth, {
        encounterId,
        detail: { sequence: restored.sequence, from: current.voidedAs },
      });
      return { ...restored, advisories: advisoryProblems(restored) };
    }

    const encounter = await this.prisma.encounter.update({
      where: { id: encounterId },
      data: {
        voidedAs: input.as,
        voidedAt: new Date(),
        voidedById: auth.kind === 'member' ? auth.memberId : null,
        voidNote: input.note?.trim() || null,
        closedAt: current.closedAt ?? new Date(),
        // There was no patient. Nothing about one is kept, on either kind
        // of void: a row created by mistake may have been typed into before
        // anybody noticed.
        patientInitials: null,
        patientAge: null,
        died: false,
        intoxicationSigns: false,
        chiefComplaint: null,
        treatment: null,
        prid: null,
        hospitalId: null,
        turnoverAgency: null,
      },
    });
    await this.log(standbyId, 'encounter.voided', auth, {
      encounterId,
      detail: {
        sequence: encounter.sequence,
        as: input.as,
        note: encounter.voidNote,
      },
    });
    await this.audit.log(
      auth,
      'standby.encounter.void',
      'Encounter',
      encounterId,
      { as: input.as, note: encounter.voidNote },
    );
    return { ...encounter, advisories: advisoryProblems(encounter) };
  }

  /**
   * Destroys an encounter.
   *
   * For the duplicate, the one opened on the wrong standby, the one that
   * turned out to be nobody. Not for a correction — an encounter can be
   * reopened and edited, and that is what a mistake in the writing-up
   * deserves. Held on standbys:delete rather than on being a supervisor:
   * this is the only thing in ems2 that loses a patient record.
   *
   * The whole row goes to the audit log first, because after this there is
   * nowhere else it survives. A run number that was issued for it stays
   * issued: the county's sequence is not ours to renumber.
   */
  async deleteEncounter(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
  ) {
    const encounter = await this.prisma.encounter.findUnique({
      where: { id: encounterId },
      include: { runNumber: { select: { number: true } } },
    });
    if (!encounter || encounter.standbyId !== standbyId) {
      throw new NotFoundException('No such encounter');
    }

    await this.audit.log(
      auth,
      'standby.encounter.delete',
      'Encounter',
      encounterId,
      encounter,
    );
    await this.log(standbyId, 'encounter.deleted', auth, {
      // No encounterId: it points at a row that is about to stop existing,
      // and the sequence is what the line needs to read correctly.
      detail: {
        sequence: encounter.sequence,
        category: encounter.category,
        disposition: encounter.disposition,
        runNumber: encounter.runNumber?.number ?? null,
      },
    });
    await this.prisma.encounter.delete({ where: { id: encounterId } });
    return { ok: true, sequence: encounter.sequence };
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
      detail: { sequence: encounter.sequence, number: issued.number },
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

  /**
   * What happened on a standby, in order, already written out as sentences.
   *
   * The text is built here rather than in the board or the report so that
   * the two cannot describe the same row differently. Rows written before a
   * kind learned to record its own detail still read correctly: the names
   * are resolved from the standby as it stands now, and `detail` wins where
   * it has something to say.
   *
   * A row about an encounter the caller may not read says that it happened
   * and nothing more. What is on the timeline follows the same rule as the
   * board: an encounter is the crew chief's and the supervisors', and the
   * complaint is not something to learn from a log line instead.
   */
  async timeline(auth: AuthContext, standbyId: number) {
    const [entries, units, personnel, encounters, locations] =
      await Promise.all([
        this.prisma.standbyTimelineEntry.findMany({
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
        }),
        this.prisma.standbyUnit.findMany({
          where: { standbyId },
          select: { id: true, name: true },
        }),
        this.prisma.standbyPersonnel.findMany({
          where: { standbyId },
          select: {
            memberId: true,
            member: {
              select: {
                firstName: true,
                preferredFirstName: true,
                lastName: true,
              },
            },
          },
        }),
        this.prisma.encounter.findMany({
          where: { standbyId },
          select: { id: true, sequence: true },
        }),
        this.prisma.venueLocation.findMany({
          select: { id: true, name: true },
        }),
      ]);

    const unitNames = new Map(units.map((unit) => [unit.id, unit.name]));
    const memberNames = new Map(
      personnel.map((person) => [person.memberId, displayName(person.member)]),
    );
    const sequences = new Map(
      encounters.map((encounter) => [encounter.id, encounter.sequence]),
    );
    const locationNames = new Map(
      locations.map((location) => [location.id, location.name]),
    );
    const viewer = await this.viewerOf(auth, standbyId);
    const readable = viewer.mayReadAll
      ? null
      : new Set(
          (
            await this.prisma.encounter.findMany({
              where: { standbyId, createdById: viewer.memberId ?? -1 },
              select: { id: true },
            })
          ).map((encounter) => encounter.id),
        );

    const names: TimelineNames = {
      unit: (id) => unitNames.get(id),
      member: (id) => memberNames.get(id),
      encounter: (id) => sequences.get(id),
      location: (id) => locationNames.get(id),
    };

    // The id is a BigInt, which JSON cannot carry. Stringified here rather
    // than narrowed to a number: the timeline is the one table that grows
    // per action rather than per thing.
    return entries.map((entry) => {
      // Anything about an encounter, unless it is one this reader may read.
      // A deleted encounter carries no id to check against, so it falls on
      // the redacted side, which is the right way for it to fail.
      const hidden =
        readable != null &&
        entry.kind.startsWith('encounter.') &&
        !(entry.encounterId != null && readable.has(entry.encounterId));
      const sequence =
        (entry.detail as { sequence?: number } | null)?.sequence ??
        (entry.encounterId != null ? sequences.get(entry.encounterId) : null);
      const shown = hidden ? { ...entry, detail: { sequence } } : entry;
      return {
        ...entry,
        id: String(entry.id),
        detail: shown.detail,
        text: describeTimelineEntry(shown, names),
      };
    });
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
