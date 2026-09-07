import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SettingsService } from '../settings/settings.service';
import { CrewPosition } from '../generated/prisma/enums';
import { CREW_POSITIONS, CrewsService } from './crews.service';

class AssignDto {
  @IsOptional()
  @IsInt()
  memberId?: number | null;

  @IsOptional()
  @IsString()
  placeholder?: string | null;
}

class OutOfServiceDto {
  @IsDateString()
  date!: string;

  @IsBoolean()
  outOfService!: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

class AbsenceDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsOptional()
  @IsString()
  note?: string;
}

class DefaultOutOfServiceDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  /** False puts the weekday back in service and forgets the reason. */
  @IsBoolean()
  outOfService!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}

class DefaultSlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @IsIn(CREW_POSITIONS)
  position!: CrewPosition;

  @IsOptional()
  @IsInt()
  memberId?: number | null;

  @IsOptional()
  @IsString()
  placeholder?: string | null;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

class BulkWeekDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'weekStart must be YYYY-MM-DD' })
  weekStart!: string;

  @IsIn(['clear', 'apply-defaults'])
  action!: 'clear' | 'apply-defaults';
}

@Controller({ path: 'crews', version: '1' })
export class CrewsController {
  constructor(
    private readonly crews: CrewsService,
    private readonly settings: SettingsService,
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  getWeeks(
    @CurrentAuth() auth: AuthContext,
    @Query('viewDate') viewDate?: string,
  ) {
    if (viewDate && !/^\d{4}-\d{2}-\d{2}$/.test(viewDate)) {
      viewDate = undefined;
    }
    // Schedulers may page to any week; members are clamped to the public window.
    const canViewAll = auth.permissions.has(PERMISSIONS.SCHEDULE_CREWS_ASSIGN);
    return this.crews.getWeeks(
      requireMember(auth),
      viewDate,
      canViewAll,
      auth.permissions.has(PERMISSIONS.SCHEDULE_DUTY_SUP),
    );
  }

  /** Candidates for the scheduling grid, filtered by position credentials. */
  @Get('assignable-members')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_ASSIGN)
  assignableMembers() {
    return this.crews.assignableMembers();
  }

  @Get('mine')
  myUpcoming(@CurrentAuth() auth: AuthContext) {
    return this.crews.myUpcoming(requireMember(auth));
  }

  // ---- absences (distant-shift drops / default-template exceptions) ----

  @Get('absences/mine')
  myAbsences(@CurrentAuth() auth: AuthContext) {
    return this.crews.listAbsences(requireMember(auth));
  }

  @Post('absences')
  declareAbsence(@CurrentAuth() auth: AuthContext, @Body() body: AbsenceDto) {
    return this.crews.declareAbsence(requireMember(auth), body.date, body.note);
  }

  @Delete('absences/:id')
  removeAbsence(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.crews.removeAbsence(requireMember(auth), id);
  }

  /**
   * Take a night out of service, or put it back.
   *
   * Scheduling permission rather than a new one: it is the same authority as
   * placing and removing people on that night, exercised over all of it.
   */
  @Post('out-of-service')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_ASSIGN)
  setOutOfService(
    @CurrentAuth() auth: AuthContext,
    @Body() body: OutOfServiceDto,
  ) {
    return this.crews.setOutOfService(
      auth,
      body.date,
      body.outOfService,
      body.reason,
    );
  }

  /** Scheduler assignment for any future date, public or not. */
  /** Empty a week, or fill its vacancies from the weekly template. */
  @Post('bulk')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_ASSIGN)
  bulkWeek(@CurrentAuth() auth: AuthContext, @Body() body: BulkWeekDto) {
    return this.crews.bulkWeek(auth, body.weekStart, body.action);
  }

  @Put('by-date/:date/slots/:position')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_ASSIGN)
  assignByDate(
    @CurrentAuth() auth: AuthContext,
    @Param('date') date: string,
    @Param('position') position: CrewPosition,
    @Body() body: AssignDto,
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ForbiddenException('Invalid date');
    }
    return this.crews.assignByDate(auth, date, position, body);
  }

  @Post(':crewId/slots/:position/signup')
  signup(
    @CurrentAuth() auth: AuthContext,
    @Param('crewId', ParseIntPipe) crewId: number,
    @Param('position') position: CrewPosition,
  ) {
    return this.crews.signup(
      requireMember(auth),
      crewId,
      position,
      auth.permissions.has(PERMISSIONS.SCHEDULE_DUTY_SUP),
    );
  }

  @Delete(':crewId/slots/:position/signup')
  drop(
    @CurrentAuth() auth: AuthContext,
    @Param('crewId', ParseIntPipe) crewId: number,
    @Param('position') position: CrewPosition,
  ) {
    return this.crews.drop(requireMember(auth), crewId, position);
  }

  @Put(':crewId/slots/:position')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_ASSIGN)
  assign(
    @CurrentAuth() auth: AuthContext,
    @Param('crewId', ParseIntPipe) crewId: number,
    @Param('position') position: CrewPosition,
    @Body() body: AssignDto,
  ) {
    return this.crews.assign(auth, crewId, position, body);
  }

  // ---- weekly default template ----

  @Get('defaults')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  getDefaults() {
    return this.prisma.defaultCrewTemplate.findMany({
      orderBy: [{ weekday: 'asc' }, { position: 'asc' }],
    });
  }

  @Put('defaults')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  async putDefault(@Body() body: DefaultSlotDto) {
    return this.prisma.defaultCrewTemplate.upsert({
      where: {
        weekday_position: { weekday: body.weekday, position: body.position },
      },
      create: body,
      update: {
        memberId: body.memberId ?? null,
        placeholder: body.placeholder ?? null,
      },
    });
  }

  /** Which weekdays the agency does not run a crew on, as a standing rule. */
  @Get('defaults/out-of-service')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  getDefaultOutOfService() {
    return this.prisma.defaultCrewOutOfService.findMany({
      orderBy: { weekday: 'asc' },
      include: {
        updatedBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });
  }

  /**
   * Marking a weekday out of service, or putting it back.
   *
   * Only affects nights generated from here on. A week already on the
   * schedule is left alone — somebody may have signed up for it, and quietly
   * emptying a crew nobody was warned about is not what "change the default"
   * should mean.
   */
  @Put('defaults/out-of-service')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  async putDefaultOutOfService(
    @CurrentAuth() auth: AuthContext,
    @Body() body: DefaultOutOfServiceDto,
  ) {
    const updatedById = auth.kind === 'member' ? auth.memberId : null;
    if (!body.outOfService) {
      await this.prisma.defaultCrewOutOfService.deleteMany({
        where: { weekday: body.weekday },
      });
      await this.audit.log(
        auth,
        'schedule.defaults.in-service',
        'DefaultCrewOutOfService',
        body.weekday,
      );
      return { weekday: body.weekday, outOfService: false };
    }
    const row = await this.prisma.defaultCrewOutOfService.upsert({
      where: { weekday: body.weekday },
      create: {
        weekday: body.weekday,
        reason: body.reason?.trim() || null,
        updatedById,
      },
      update: { reason: body.reason?.trim() || null, updatedById },
    });
    await this.audit.log(
      auth,
      'schedule.defaults.out-of-service',
      'DefaultCrewOutOfService',
      body.weekday,
      { reason: row.reason },
    );
    return { ...row, outOfService: true };
  }

  // ---- scheduling knobs ----

  @Get('settings')
  getSettings() {
    return this.settings.scheduling();
  }

  @Put('settings/:key')
  @RequirePermissions(PERMISSIONS.SCHEDULE_SETTINGS)
  putSetting(@Param('key') key: string, @Body() body: { value: unknown }) {
    return this.settings.update(key as never, body.value);
  }
}
