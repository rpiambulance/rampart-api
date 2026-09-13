import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
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
  @IsOptional() @IsInt() venueId?: number;
}

class UpdateStandbyDto {
  @IsOptional() @IsInt() venueId?: number | null;
  @IsOptional() @IsString() @MaxLength(200) venueText?: string | null;
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
  @IsInt() memberId!: number;
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
  @IsOptional() @IsString() @MaxLength(40) countyRunNumber?: string | null;
  @IsOptional() @IsString() @MaxLength(60) prid?: string | null;
  @IsOptional() @IsInt() locationId?: number | null;
  @IsOptional() @IsString() @MaxLength(200) locationText?: string | null;
}

class IssueRunNumberDto {
  @IsInt() locationId!: number;
}

/**
 * Event medical standbys.
 *
 * Running one needs standbys:manage. Writing up an encounter needs only
 * being on the standby — a crew chief should not need a permission to say
 * what they did — and reading somebody else's needs being a supervisor on
 * it, or the read-all permission.
 */
@Controller({ path: 'standbys', version: '1' })
export class Ems2Controller {
  constructor(
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
        venueId: body.venueId,
      });
    }
    if (!body.event) {
      throw new BadRequestException(
        'Name an event from the calendar, or give the details of one that is not on it.',
      );
    }
    // Making an event is a separate thing from running a standby, so it asks
    // for the permission that makes events.
    if (!auth.permissions?.has(PERMISSIONS.EVENTS_CREATE)) {
      throw new ForbiddenException(
        'Creating an event that is not on the calendar needs events:create.',
      );
    }
    return this.ems2.open(auth, { event: body.event, venueId: body.venueId });
  }

  @Get(':id')
  get(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.ems2.get(auth, id);
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
    return this.ems2.issueRunNumber(auth, id, encounterId, body.locationId);
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
  @Get('config/all')
  async config() {
    const [venues, designators, hospitals] = await Promise.all([
      this.prisma.venue.findMany({
        where: { active: true },
        include: {
          locations: { where: { active: true }, orderBy: { order: 'asc' } },
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
    ]);
    return { venues, designators, hospitals };
  }
}
