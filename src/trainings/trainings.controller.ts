import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  Min,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '../generated/prisma/enums';

class AnnualTrainingDto {
  @IsString()
  name!: string;

  @IsInt()
  year!: number;

  @IsOptional()
  @IsBoolean()
  alertOnLapse?: boolean;

  @IsOptional()
  @IsBoolean()
  blocksScheduling?: boolean;
}

class PatchAnnualTrainingDto {
  @IsOptional()
  @IsBoolean()
  alertOnLapse?: boolean;

  @IsOptional()
  @IsBoolean()
  blocksScheduling?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

class ClassDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  sessionAt?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  seriesId?: number;
}

class ClassSeriesDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  /** How long a completed session counts for; null for never lapsing. */
  @IsOptional()
  @IsInt()
  @Min(1)
  validityMonths?: number | null;
}

class PatchClassSeriesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  validityMonths?: number | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

class PatchClassDto {
  /** The series this session belongs to; null to take it out of one. */
  @IsOptional()
  @IsInt()
  seriesId?: number | null;
}

class AttendanceDto {
  @IsIn(['REGISTERED', 'ATTENDED', 'COMPLETED', 'NO_SHOW'])
  status!: AttendanceStatus;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

/** Annual training requirements + in-house classes (spec §4.4). */
@Controller({ path: 'trainings', version: '1' })
export class TrainingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ---------------------------------------------------- annual requirements

  @Get('annual')
  async listAnnual(
    @CurrentAuth() auth: AuthContext,
    @Query('year') year?: string,
  ) {
    const requirements = await this.prisma.annualTrainingRequirement.findMany({
      where: {
        active: true,
        ...(year ? { year: Number(year) } : {}),
      },
      orderBy: [{ year: 'desc' }, { name: 'asc' }],
    });
    if (auth.kind !== 'member') return requirements;
    const mine = await this.prisma.memberAnnualTraining.findMany({
      where: { memberId: auth.memberId },
    });
    return requirements.map((r) => ({
      ...r,
      myCompletion:
        mine.find((m) => m.requirementId === r.id)?.completedAt ?? null,
    }));
  }

  @Post('annual')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async createAnnual(
    @CurrentAuth() auth: AuthContext,
    @Body() body: AnnualTrainingDto,
  ) {
    const requirement = await this.prisma.annualTrainingRequirement.create({
      data: body,
    });
    await this.audit.log(
      auth,
      'trainings.annual.create',
      'AnnualTrainingRequirement',
      requirement.id,
    );
    return requirement;
  }

  @Patch('annual/:id')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async patchAnnual(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchAnnualTrainingDto,
  ) {
    const requirement = await this.prisma.annualTrainingRequirement.update({
      where: { id },
      data: body,
    });
    await this.audit.log(
      auth,
      'trainings.annual.update',
      'AnnualTrainingRequirement',
      id,
      body,
    );
    return requirement;
  }

  /** Completion roster for officers: who has/hasn't completed. */
  @Get('annual/:id/completions')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async completions(@Param('id', ParseIntPipe) id: number) {
    const [completions, members] = await Promise.all([
      this.prisma.memberAnnualTraining.findMany({
        where: { requirementId: id },
      }),
      this.prisma.member.findMany({
        where: { active: true },
        select: {
          id: true,
          firstName: true,
          preferredFirstName: true,
          lastName: true,
        },
        orderBy: [{ lastName: 'asc' }],
      }),
    ]);
    const byMember = new Map(completions.map((c) => [c.memberId, c]));
    return members.map((m) => ({
      member: m,
      completedAt: byMember.get(m.id)?.completedAt ?? null,
    }));
  }

  @Put('annual/:id/completions/:memberId')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async markComplete(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() body: { completedAt?: string },
  ) {
    const completedAt = body.completedAt
      ? new Date(body.completedAt)
      : new Date();
    const completion = await this.prisma.memberAnnualTraining.upsert({
      where: { requirementId_memberId: { requirementId: id, memberId } },
      create: { requirementId: id, memberId, completedAt },
      update: { completedAt },
    });
    await this.audit.log(
      auth,
      'trainings.annual.complete',
      'MemberAnnualTraining',
      `${id}:${memberId}`,
    );
    return completion;
  }

  @Delete('annual/:id/completions/:memberId')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async unmarkComplete(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    await this.prisma.memberAnnualTraining.deleteMany({
      where: { requirementId: id, memberId },
    });
    await this.audit.log(
      auth,
      'trainings.annual.uncomplete',
      'MemberAnnualTraining',
      `${id}:${memberId}`,
    );
    return { ok: true };
  }

  // ------------------------------------------------------------------ classes

  // ------------------------------------------------------------ class series

  /**
   * Sessions of the same class over time. A requirement can name a series,
   * so next year's refresher counts as well as this year's.
   */
  @Get('series')
  listSeries() {
    return this.prisma.classSeries.findMany({
      include: { _count: { select: { classes: true } } },
      orderBy: { name: 'asc' },
    });
  }

  @Post('series')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async createSeries(
    @CurrentAuth() auth: AuthContext,
    @Body() body: ClassSeriesDto,
  ) {
    const name = body.name.trim();
    if (!name) throw new BadRequestException('A series needs a name');
    const existing = await this.prisma.classSeries.findUnique({
      where: { name },
    });
    if (existing) {
      throw new ConflictException(`There is already a series called ${name}`);
    }
    const series = await this.prisma.classSeries.create({
      data: {
        name,
        description: body.description?.trim() || null,
        validityMonths: body.validityMonths ?? null,
      },
    });
    await this.audit.log(
      auth,
      'trainings.series.create',
      'ClassSeries',
      series.id,
      body,
    );
    return series;
  }

  @Patch('series/:id')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async updateSeries(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchClassSeriesDto,
  ) {
    const series = await this.prisma.classSeries.update({
      where: { id },
      data: {
        ...(body.name?.trim() ? { name: body.name.trim() } : {}),
        ...(body.description === undefined
          ? {}
          : { description: body.description.trim() || null }),
        ...(body.validityMonths === undefined
          ? {}
          : { validityMonths: body.validityMonths }),
        ...(body.active === undefined ? {} : { active: body.active }),
      },
    });
    await this.audit.log(
      auth,
      'trainings.series.update',
      'ClassSeries',
      id,
      body,
    );
    return series;
  }

  /** Put a session in a series, or take it out of one. */
  @Patch('classes/:id')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async updateClass(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchClassDto,
  ) {
    const trainingClass = await this.prisma.trainingClass.update({
      where: { id },
      data: {
        ...(body.seriesId === undefined ? {} : { seriesId: body.seriesId }),
      },
    });
    await this.audit.log(
      auth,
      'trainings.class.update',
      'TrainingClass',
      id,
      body,
    );
    return trainingClass;
  }

  @Get('classes')
  listClasses(@CurrentAuth() auth: AuthContext) {
    return this.prisma.trainingClass.findMany({
      include: {
        series: { select: { id: true, name: true } },
        attendance:
          auth.kind === 'member'
            ? { where: { memberId: auth.memberId } }
            : false,
        _count: { select: { attendance: true } },
      },
      orderBy: [{ sessionAt: 'desc' }],
    });
  }

  @Get('classes/:id')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  classRoster(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.trainingClass.findUniqueOrThrow({
      where: { id },
      include: {
        attendance: {
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
    });
  }

  @Post('classes')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async createClass(@CurrentAuth() auth: AuthContext, @Body() body: ClassDto) {
    const trainingClass = await this.prisma.trainingClass.create({
      data: {
        ...body,
        sessionAt: body.sessionAt ? new Date(body.sessionAt) : null,
      },
    });
    await this.audit.log(
      auth,
      'trainings.class.create',
      'TrainingClass',
      trainingClass.id,
    );
    return trainingClass;
  }

  @Post('classes/:id/register')
  register(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const memberId = requireMember(auth);
    return this.prisma.classAttendance.upsert({
      where: { classId_memberId: { classId: id, memberId } },
      create: { classId: id, memberId },
      update: {},
    });
  }

  @Put('classes/:id/attendance/:memberId')
  @RequirePermissions(PERMISSIONS.TRAININGS_MANAGE)
  async setAttendance(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() body: AttendanceDto,
  ) {
    // Dated the first time it is marked completed, and undated if that is
    // taken back: a session with no date of its own lapses from this.
    const existing = await this.prisma.classAttendance.findUnique({
      where: { classId_memberId: { classId: id, memberId } },
      select: { status: true, completedAt: true },
    });
    const completedAt =
      body.status !== 'COMPLETED'
        ? null
        : existing?.status === 'COMPLETED'
          ? existing.completedAt
          : new Date();
    const attendance = await this.prisma.classAttendance.upsert({
      where: { classId_memberId: { classId: id, memberId } },
      create: { classId: id, memberId, status: body.status, completedAt },
      update: { status: body.status, completedAt },
    });
    await this.audit.log(
      auth,
      'trainings.class.attendance',
      'ClassAttendance',
      `${id}:${memberId}`,
      body,
    );
    return attendance;
  }
}
