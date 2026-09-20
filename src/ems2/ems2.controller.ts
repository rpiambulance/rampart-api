import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  Sse,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable, merge } from 'rxjs';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { Ems2Events } from './ems2.events';
import { Ems2Service } from './ems2.service';
import { Ems2ExportService } from './ems2-export.service';

/** Streams a generated PDF, named so a download lands as something readable. */
function send(res: Response, pdf: Buffer, filename: string) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.setHeader('Content-Length', String(pdf.length));
  res.end(pdf);
}

const ROLES = ['EES_IC', 'EES', 'CREW', 'SUPPORT'] as const;
const STATUSES = [
  'AVAILABLE',
  'ASSIGNED',
  'AT_PATIENT',
  'TRANSPORTING',
  'OUT_OF_SERVICE',
] as const;
const CATEGORIES = [
  'MINOR_INJURY',
  'MAJOR_INJURY',
  'MINOR_ILLNESS',
  'MAJOR_ILLNESS',
] as const;
const DISPOSITIONS = [
  'RMA',
  'TRANSPORTED',
  'TURNOVER',
  'TREATED_RELEASED',
  'NO_PATIENT_FOUND',
  'DECEASED',
] as const;

/** An event that is not on the calendar, made as the standby is opened. */
class AdHocEventDto {
  @IsString() @MaxLength(200) title!: string;
  @IsDateString() startsAt!: string;
  @IsDateString() endsAt!: string;
  @IsInt() kindId!: number;
}

class OpenStandbyDto {
  /** One or the other: an event from the calendar, or one made here. */
  @IsOptional() @IsInt() eventId?: number;
  @IsOptional()
  @ValidateNested()
  @Type(() => AdHocEventDto)
  event?: AdHocEventDto;
  @IsOptional() @IsInt() placeId?: number;
}

class UpdateStandbyDto {
  @IsOptional() @IsInt() placeId?: number | null;
  @IsOptional() @IsString() @MaxLength(200) placeText?: string | null;
  @IsOptional() @IsDateString() startedAt?: string | null;
  @IsOptional() @IsDateString() endedAt?: string | null;
  @IsOptional() @IsInt() @Min(0) totalAttendance?: number | null;
  @IsOptional() @IsBoolean() totalEstimated?: boolean;
  @IsOptional() @IsInt() @Min(0) peakAttendance?: number | null;
  @IsOptional() @IsBoolean() peakEstimated?: boolean;
  @IsOptional() @IsString() @MaxLength(200) sponsorOperator?: string | null;
  @IsOptional() @IsString() @MaxLength(4000) unusualOccurrences?: string | null;
  @IsOptional() @IsString() @MaxLength(200) completedByName?: string | null;
  @IsOptional() @IsString() @MaxLength(200) completedByTitle?: string | null;
  @IsOptional() @IsString() @MaxLength(40) completedByPhone?: string | null;
}

class PersonnelDto {
  /** Somebody on the roster. Left out for a name written in by hand. */
  @IsOptional() @IsInt() memberId?: number;
  /** Mutual aid, a visiting crew — somebody this agency has no record of. */
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsIn(ROLES) role?: (typeof ROLES)[number];
  @IsOptional() @IsString() @MaxLength(500) note?: string;
}

class RoleDto {
  @IsIn(ROLES) role!: (typeof ROLES)[number];
}

class UnitDto {
  @IsOptional() @IsInt() designatorId?: number;
  @IsOptional() @IsString() @MaxLength(60) name?: string;
}

class UnitPatchDto {
  @IsOptional() @IsIn(STATUSES) status?: (typeof STATUSES)[number];
  @IsOptional() @IsInt() currentLocationId?: number | null;
  @IsOptional() @IsString() @MaxLength(200) currentLocationText?: string | null;
  @IsOptional() @IsInt() stagingLocationId?: number | null;
  @IsOptional() @IsString() @MaxLength(200) stagingLocationText?: string | null;
}

class AssignDto {
  @IsInt() personnelId!: number;
  @IsOptional() @IsString() @MaxLength(40) position?: string;
}

class OpenEncounterDto {
  @IsOptional() @IsInt() unitId?: number;
  @IsOptional() @IsInt() locationId?: number;
  @IsOptional() @IsString() @MaxLength(200) locationText?: string;
}

class EncounterPatchDto {
  @IsOptional() @IsInt() unitId?: number | null;
  /** Four characters. There is no room here for a name, on purpose. */
  @IsOptional() @IsString() @MaxLength(4) patientInitials?: string | null;
  @IsOptional() @IsInt() @Min(0) patientAge?: number | null;
  @IsOptional() @IsIn(['years', 'months']) patientAgeUnit?: string | null;
  @IsOptional() @IsIn(CATEGORIES) category?: (typeof CATEGORIES)[number];
  @IsOptional() @IsBoolean() died?: boolean;
  @IsOptional() @IsBoolean() intoxicationSigns?: boolean;
  @IsOptional() @IsString() @MaxLength(300) chiefComplaint?: string | null;
  @IsOptional() @IsString() @MaxLength(4000) treatment?: string | null;
  @IsOptional() @IsString() @MaxLength(8000) narrative?: string | null;
  @IsOptional() @IsIn(DISPOSITIONS) disposition?: (typeof DISPOSITIONS)[number];
  @IsOptional() @IsInt() hospitalId?: number | null;
  @IsOptional() @IsString() @MaxLength(200) turnoverAgency?: string | null;
  @IsOptional() @IsBoolean() firstAidOnly?: boolean;
  @IsOptional() @IsInt() runNumberId?: number | null;
  @IsOptional() @IsString() @MaxLength(40) runNumberText?: string | null;
  @IsOptional() @IsString() @MaxLength(40) countyRunNumber?: string | null;
  @IsOptional() @IsString() @MaxLength(60) prid?: string | null;
  @IsOptional() @IsInt() locationId?: number | null;
  @IsOptional() @IsString() @MaxLength(200) locationText?: string | null;
}

class IssueRunNumberDto {
  /**
   * Where the number counts. Left out in the ordinary case: the standby's
   * place already answers it.
   */
  @IsOptional() @IsInt() placeId?: number;
}

class NoteDto {
  @IsString() @MaxLength(1000) text!: string;
}

class MarkDto {
  @IsInt() actionId!: number;
}

class VoidEncounterDto {
  /** Null takes the mark off again. */
  @IsOptional()
  @IsIn(['UNFOUNDED', 'CREATED_IN_ERROR', null])
  as?: 'UNFOUNDED' | 'CREATED_IN_ERROR' | null;

  @IsOptional() @IsString() @MaxLength(300) note?: string | null;
}

/**
 * Event medical standbys.
 *
 * Running one needs standbys:manage, including opening one for something
 * that was never on the calendar. Writing up an encounter needs only being
 * on the standby — a crew chief should not need a permission to say what
 * they did — and reading somebody else's needs being a supervisor on it, or
 * the read-all permission. Throwing either a standby or an encounter away
 * is the one thing held apart, on standbys:delete.
 */
@Controller({ path: 'standbys', version: '1' })
export class Ems2Controller {
  constructor(
    private readonly events: Ems2Events,
    private readonly ems2: Ems2Service,
    private readonly exports: Ems2ExportService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  list(@Query('limit') limit?: string) {
    return this.ems2.list(Number(limit) || 50);
  }

  /**
   * The standby for an event, if it has one.
   *
   * Answers the event page's question — offer to open one, or link to the
   * one that exists — without it having to fetch the whole list and search.
   */
  @Get('for-event/:eventId')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  forEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.prisma.standbyLog.findUnique({
      where: { eventId },
      select: { id: true, closedAt: true },
    });
  }

  /** Events a standby could still be opened for: future, and without one. */
  @Get('openable')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  openable() {
    return this.ems2.openableEvents();
  }

  @Post()
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  open(@CurrentAuth() auth: AuthContext, @Body() body: OpenStandbyDto) {
    if (body.eventId) {
      return this.ems2.open(auth, {
        eventId: body.eventId,
        placeId: body.placeId,
      });
    }
    if (!body.event) {
      throw new BadRequestException(
        'Name an event from the calendar, or give the details of one that is not on it.',
      );
    }
    // Nothing further is asked for. What this makes is not a calendar
    // event — it is hidden, and exists so the standby has something to tag
    // run numbers to — so events:create would be a barrier in front of the
    // one case that cannot wait: something is happening now, and whoever is
    // running it needs the board open.
    return this.ems2.open(auth, { event: body.event, placeId: body.placeId });
  }

  @Get(':id')
  get(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.ems2.get(auth, id);
  }

  /**
   * The board, kept live.
   *
   * A standby is written by several people at once and each of them used to
   * see only their own writes until they reloaded. The event says which
   * standby moved and nothing else; the screen asks for it again, so a
   * screen that missed one is briefly stale rather than quietly wrong.
   */
  @Sse(':id/stream')
  stream(@Param('id', ParseIntPipe) id: number): Observable<{ data: unknown }> {
    // A comment every twenty-five seconds, so a proxy between here and the
    // gate does not decide the connection is idle and close it.
    const keepAlive = new Observable<{ data: unknown }>((subscriber) => {
      const timer = setInterval(
        () => subscriber.next({ data: { at: Date.now() } }),
        25_000,
      );
      return () => clearInterval(timer);
    });
    return merge(this.events.stream(id), keepAlive);
  }

  @Get(':id/timeline')
  timeline(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ems2.timeline(auth, id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStandbyDto,
  ) {
    return this.ems2.update(auth, id, body);
  }

  @Post(':id/close')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  close(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ems2.close(auth, id);
  }

  /**
   * Throw away a standby opened by mistake. Refused once it has encounters.
   *
   * Its own permission rather than the one that runs a standby: whoever is
   * supervising the event holds standbys:manage for the day, and nothing
   * about running a standby involves destroying one.
   */
  @Delete(':id')
  @RequirePermissions(PERMISSIONS.STANDBYS_DELETE)
  discard(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ems2.discard(auth, id);
  }

  @Post(':id/reopen')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  reopen(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ems2.reopen(auth, id);
  }

  // ---------------------------------------------------------------- people

  @Post(':id/personnel')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  addPersonnel(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PersonnelDto,
  ) {
    return this.ems2.addPersonnel(auth, id, body);
  }

  @Patch(':id/personnel/:personnelId')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  setRole(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('personnelId', ParseIntPipe) personnelId: number,
    @Body() body: RoleDto,
  ) {
    return this.ems2.setRole(auth, id, personnelId, body.role);
  }

  @Delete(':id/personnel/:personnelId')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  removePersonnel(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('personnelId', ParseIntPipe) personnelId: number,
  ) {
    return this.ems2.removePersonnel(auth, id, personnelId);
  }

  // ----------------------------------------------------------------- units

  @Post(':id/units')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  addUnit(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UnitDto,
  ) {
    return this.ems2.addUnit(auth, id, body);
  }

  @Patch(':id/units/:unitId')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  updateUnit(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('unitId', ParseIntPipe) unitId: number,
    @Body() body: UnitPatchDto,
  ) {
    return this.ems2.updateUnit(auth, id, unitId, body);
  }

  @Delete(':id/units/:unitId')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  retireUnit(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('unitId', ParseIntPipe) unitId: number,
  ) {
    return this.ems2.retireUnit(auth, id, unitId);
  }

  @Post(':id/units/:unitId/crew')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  assign(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('unitId', ParseIntPipe) unitId: number,
    @Body() body: AssignDto,
  ) {
    return this.ems2.assign(auth, id, unitId, body);
  }

  @Delete(':id/crew/:assignmentId')
  @RequirePermissions(PERMISSIONS.STANDBYS_MANAGE)
  unassign(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ) {
    return this.ems2.unassign(auth, id, assignmentId);
  }

  // ------------------------------------------------------------ encounters

  @Get(':id/encounters')
  encounters(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ems2.encountersFor(auth, id);
  }

  /** No permission: anybody on the standby writes up what they did. */
  @Post(':id/encounters')
  openEncounter(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: OpenEncounterDto,
  ) {
    return this.ems2.openEncounter(auth, id, body);
  }

  @Patch(':id/encounters/:encounterId')
  updateEncounter(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
    @Body() body: EncounterPatchDto,
  ) {
    return this.ems2.updateEncounter(auth, id, encounterId, body);
  }

  @Post(':id/encounters/:encounterId/close')
  closeEncounter(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
  ) {
    return this.ems2.closeEncounter(auth, id, encounterId);
  }

  /**
   * A note about the standby itself: what happened that was not a patient.
   */
  @Post(':id/notes')
  addNote(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: NoteDto,
  ) {
    return this.ems2.addNote(auth, id, body.text);
  }

  /** A note about one encounter, which lands on it and on the timeline. */
  @Post(':id/encounters/:encounterId/notes')
  addEncounterNote(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
    @Body() body: NoteDto,
  ) {
    return this.ems2.addEncounterNote(auth, id, encounterId, body.text);
  }

  /** One of the buttons: on scene, moving to FAR. */
  @Post(':id/encounters/:encounterId/mark')
  markEncounter(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
    @Body() body: MarkDto,
  ) {
    return this.ems2.markEncounter(auth, id, encounterId, body.actionId);
  }

  /**
   * Mark an encounter as one that turned out not to be one, or take the
   * mark off again. Needs only to be on the standby: this is the
   * correction, and deleting is the thing that needs a permission.
   */
  @Post(':id/encounters/:encounterId/void')
  voidEncounter(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
    @Body() body: VoidEncounterDto,
  ) {
    return this.ems2.voidEncounter(auth, id, encounterId, {
      as: body.as ?? null,
      note: body.note,
    });
  }

  /**
   * Throw an encounter away. The duplicate, or the one opened on the wrong
   * standby — never a correction, which is what reopening is for.
   */
  @Delete(':id/encounters/:encounterId')
  @RequirePermissions(PERMISSIONS.STANDBYS_DELETE)
  deleteEncounter(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
  ) {
    return this.ems2.deleteEncounter(auth, id, encounterId);
  }

  @Post(':id/encounters/:encounterId/reopen')
  reopenEncounter(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
  ) {
    return this.ems2.reopenEncounter(auth, id, encounterId);
  }

  @Post(':id/encounters/:encounterId/run-number')
  issueRunNumber(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
    @Body() body: IssueRunNumberDto,
  ) {
    return this.ems2.issueRunNumber(auth, id, encounterId, body.placeId);
  }

  // --------------------------------------------------------------- exports

  /**
   * The event as a PDF, with or without the nitty gritty.
   *
   * `?detail=1` adds the encounters and the timeline, which makes it a
   * patient record rather than a summary — the document says so on its face.
   */
  @Get(':id/export/event.pdf')
  async eventPdf(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Query('detail') detail?: string,
  ) {
    const detailed = detail === '1' || detail === 'true';
    const pdf = await this.exports.eventPdf(auth, id, detailed);
    send(res, pdf, `standby-${id}${detailed ? '-detailed' : ''}.pdf`);
  }

  @Get(':id/encounters/:encounterId/export.pdf')
  async encounterPdf(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('encounterId', ParseIntPipe) encounterId: number,
    @Res() res: Response,
  ) {
    const pdf = await this.exports.encounterPdf(auth, id, encounterId);
    send(res, pdf, `encounter-${encounterId}.pdf`);
  }

  @Get(':id/export/doh-2332.pdf')
  async doh2332(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdf = await this.exports.doh2332Pdf(auth, id);
    send(res, pdf, `doh-2332-standby-${id}.pdf`);
  }

  @Get(':id/export/doh-2342.pdf')
  async doh2342(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdf = await this.exports.doh2342Pdf(auth, id);
    send(res, pdf, `doh-2342-standby-${id}.pdf`);
  }

  // -------------------------------------------------------------- the kit

  /** Venues, their insides, unit designators and hospitals. */
  /**
   * Everything the board needs to fill a picker with.
   *
   * The roster is here rather than behind members:read because naming who
   * is working a standby is part of running one: a crew chief adding the
   * person who just turned up should not need the permission that opens the
   * member directory. Names only — enough to pick somebody, and nothing
   * else about them.
   */
  @Get('config/all')
  async config() {
    const [places, designators, hospitals, actions, members] =
      await Promise.all([
        this.prisma.place.findMany({
          where: { active: true },
          include: {
            spots: { where: { active: true }, orderBy: { order: 'asc' } },
          },
          orderBy: { name: 'asc' },
        }),
        this.prisma.unitDesignator.findMany({
          where: { active: true },
          orderBy: { name: 'asc' },
        }),
        this.prisma.hospital.findMany({
          where: { active: true },
          orderBy: { name: 'asc' },
        }),
        this.prisma.encounterAction.findMany({
          where: { active: true },
          orderBy: [{ order: 'asc' }, { label: 'asc' }],
        }),
        this.prisma.member.findMany({
          where: { active: true },
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
          orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        }),
      ]);
    return { places, designators, hospitals, actions, members };
  }
}
