import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthContext } from '../auth/auth-context';
import { displayName } from '../common/name';
import { PrismaService } from '../prisma/prisma.service';
import { Ems2Service } from './ems2.service';
import {
  formCounts,
  inPatientList,
  loggerMarks,
  onDohForms,
  personnelName,
} from './standby-logic';
import {
  doh2332,
  doh2342,
  encounterReport,
  eventReport,
  render,
  type IncidentRow,
  type StandbyForForm,
} from './standby-pdf';

@Injectable()
export class Ems2ExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ems2: Ems2Service,
  ) {}

  /**
   * Everything the exports draw from.
   *
   * Read once and shared, because the four documents are four views of the
   * same standby and any difference between them would be a bug.
   */
  private async gather(auth: AuthContext, standbyId: number) {
    const standby = await this.prisma.standbyLog.findUnique({
      where: { id: standbyId },
      include: {
        event: { include: { kind: true } },
        place: true,
        personnel: {
          include: {
            member: {
              select: {
                firstName: true,
                preferredFirstName: true,
                lastName: true,
              },
            },
            assignments: { include: { unit: { select: { name: true } } } },
          },
          orderBy: { id: 'asc' },
        },
        units: {
          include: {
            currentLocation: true,
            assignments: {
              include: {
                personnel: {
                  include: {
                    member: {
                      select: {
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
      },
    });
    if (!standby) throw new NotFoundException('No such standby');

    // Exports are the whole record, so they need the whole record: a crew
    // member who can only see their own encounters cannot produce one.
    const encounters = await this.prisma.encounter.findMany({
      where: { standbyId },
      orderBy: { sequence: 'asc' },
      include: {
        hospital: true,
        runNumber: true,
        location: true,
        createdBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });

    const inCharge = standby.personnel.find((p) => p.role === 'EES_IC');
    const forForm: StandbyForForm = {
      eventTitle: standby.event.title,
      eventType: standby.event.kind?.name ?? '',
      sponsorOperator: standby.sponsorOperator,
      startedAt: standby.startedAt ?? standby.event.startsAt,
      endedAt: standby.endedAt ?? standby.event.endsAt,
      totalAttendance: standby.totalAttendance,
      totalEstimated: standby.totalEstimated,
      peakAttendance: standby.peakAttendance,
      peakEstimated: standby.peakEstimated,
      unusualOccurrences: standby.unusualOccurrences,
      completedByName:
        standby.completedByName ?? (inCharge ? personnelName(inCharge) : null),
      completedByTitle: standby.completedByTitle,
      completedByPhone: standby.completedByPhone,
      inCharge: inCharge ? personnelName(inCharge) : null,
      venue: standby.place?.name ?? standby.placeText,
    };

    const asRow = (e: (typeof encounters)[number]): IncidentRow => ({
      sequence: e.sequence,
      at: e.openedAt,
      initials: e.patientInitials,
      prid: e.prid,
      // Ours when we issued one, and whatever was written down when the
      // number came from somewhere else.
      runNumber: e.runNumber?.number ?? e.runNumberText ?? null,
      countyRunNumber: e.countyRunNumber,
      chiefComplaint: e.chiefComplaint,
      category: e.category,
      treatment: e.treatment,
      disposition: e.disposition,
      transported: e.disposition === 'TRANSPORTED',
      comments: e.narrative,
      voidedAs: e.voidedAs,
      voidNote: e.voidNote,
    });

    return {
      standby,
      encounters,
      forForm,
      // The state's forms are a count of people who were treated. Nothing
      // voided was a person who was treated.
      rows: encounters.filter(onDohForms).map(asRow),
      // The agency's own list keeps the unfounded call — a unit went, and
      // the report is what somebody answers questions from a year later.
      // A row created by mistake is not something that happened, and lives
      // only in the timeline underneath.
      listed: encounters.filter(inPatientList).map(asRow),
      counts: formCounts(encounters),
    };
  }

  /** Producing the record is a supervisor's job, or the read-all permission's. */
  private async requireWholeRecord(auth: AuthContext, standbyId: number) {
    const detail = await this.ems2.get(auth, standbyId).catch(() => null);
    if (!detail?.viewer.mayReadAll) {
      throw new ForbiddenException(
        'Exporting a standby needs to see all of it, which needs to be a ' +
          'supervisor on it or hold standbys:read-all.',
      );
    }
  }

  async eventPdf(auth: AuthContext, standbyId: number, detailed: boolean) {
    await this.requireWholeRecord(auth, standbyId);
    const { standby, forForm, listed, counts } = await this.gather(
      auth,
      standbyId,
    );

    // Who logged each line, as initials against the time, and spelled out
    // once at the foot of the report. The name used to be repeated in full
    // on every entry, which on a busy standby is the same few names down
    // the page with the entry itself squeezed against the margin.
    const entries = detailed ? await this.ems2.timeline(auth, standbyId) : [];
    const marks = loggerMarks(
      entries
        .filter((entry) => entry.actor)
        .map((entry) => ({
          id: entry.actor!.id,
          name: displayName(entry.actor!),
        })),
    );
    const markOf = new Map(marks.map((mark) => [mark.id, mark.initials]));
    const timeline = entries.map((entry) => ({
      at: entry.at,
      kind: entry.kind,
      detail: entry.text,
      initials: entry.actor ? (markOf.get(entry.actor.id) ?? null) : null,
    }));

    return render(
      eventReport({
        standby: forForm,
        counts,
        detailed,
        loggers: marks.map((mark) => ({
          initials: mark.initials,
          name: mark.name,
        })),
        personnel: standby.personnel.map((p) => ({
          name: personnelName(p),
          role: p.role,
          left: !!p.removedAt,
          units: p.assignments
            .filter((a) => !a.removedAt)
            .map((a) => a.unit.name),
        })),
        units: standby.units.map((u) => ({
          name: u.name,
          location: u.currentLocation?.name ?? u.currentLocationText,
          crew: u.assignments
            .filter((a) => !a.removedAt)
            .map((a) =>
              [
                personnelName(a.personnel),
                a.position ? `(${a.position})` : null,
              ]
                .filter(Boolean)
                .join(' '),
            ),
        })),
        incidents: listed,
        timeline,
      }),
    );
  }

  async encounterPdf(
    auth: AuthContext,
    standbyId: number,
    encounterId: number,
  ) {
    const detail = await this.ems2.get(auth, standbyId);
    const encounter = await this.prisma.encounter.findUnique({
      where: { id: encounterId },
      include: {
        hospital: true,
        runNumber: true,
        location: true,
        unit: true,
        createdBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });
    if (!encounter || encounter.standbyId !== standbyId) {
      throw new NotFoundException('No such encounter');
    }
    // A crew member may export what they wrote, and nothing else.
    if (
      !detail.viewer.mayReadAll &&
      encounter.createdById !== detail.viewer.memberId
    ) {
      throw new ForbiddenException('That encounter is not yours to read.');
    }
    const { forForm } = await this.gather(auth, standbyId);

    return render(
      encounterReport({
        standby: forForm,
        row: {
          sequence: encounter.sequence,
          at: encounter.openedAt,
          initials: encounter.patientInitials,
          prid: encounter.prid,
          runNumber:
            encounter.runNumber?.number ?? encounter.runNumberText ?? null,
          countyRunNumber: encounter.countyRunNumber,
          chiefComplaint: encounter.chiefComplaint,
          category: encounter.category,
          treatment: encounter.treatment,
          disposition: encounter.disposition,
          transported: encounter.disposition === 'TRANSPORTED',
          comments: encounter.narrative,
          voidedAs: encounter.voidedAs,
          voidNote: encounter.voidNote,
        },
        unit: encounter.unit?.name ?? null,
        location: encounter.location?.name ?? encounter.locationText,
        hospital: encounter.hospital?.name ?? null,
        turnoverAgency: encounter.turnoverAgency,
        narrative: encounter.narrative,
        ageLabel:
          encounter.patientAge === null
            ? null
            : `${encounter.patientAge} ${encounter.patientAgeUnit ?? 'years'}`,
        died: encounter.died,
        intoxicationSigns: encounter.intoxicationSigns,
        firstAidOnly: encounter.firstAidOnly,
        openedAt: encounter.openedAt,
        closedAt: encounter.closedAt,
        writtenBy: encounter.createdBy
          ? displayName(encounter.createdBy)
          : null,
      }),
    );
  }

  async doh2332Pdf(auth: AuthContext, standbyId: number) {
    await this.requireWholeRecord(auth, standbyId);
    const { forForm, counts } = await this.gather(auth, standbyId);
    return render(doh2332(forForm, counts));
  }

  async doh2342Pdf(auth: AuthContext, standbyId: number) {
    await this.requireWholeRecord(auth, standbyId);
    const { forForm, rows } = await this.gather(auth, standbyId);
    return render(doh2342(forForm, rows));
  }
}
