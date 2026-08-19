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
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { isDateOnly, nyNow, toDbDate } from '../common/dates';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { ChoresService } from './chores.service';

const CADENCES = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'] as const;

class ChoreDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(CADENCES)
  cadence!: (typeof CADENCES)[number];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dayOfMonth?: number;

  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  /** ONCE only: the day it is due. */
  @IsOptional()
  @IsString()
  dueOn?: string;
}

class AssignDto {
  /** Omitted or null puts the night back to the chore's own assignee. */
  @IsOptional()
  @IsInt()
  memberId?: number | null;
}

class CompleteDto {
  @IsOptional()
  @IsString()
  note?: string;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

@Controller({ path: 'chores', version: '1' })
export class ChoresController {
  constructor(
    private readonly chores: ChoresService,
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** What is due, today first. Any member may see and complete these. */
  @Get()
  async list(@Query('days') days?: string) {
    await this.chores.ensureOccurrences(nyNow().dateStr);
    return this.chores.upcoming(Math.min(Number(days) || 14, 60));
  }

  @Get('definitions')
  @RequirePermissions(PERMISSIONS.CHORES_MANAGE)
  definitions() {
    return this.prisma.chore.findMany({
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
  }

  @Post('definitions')
  @RequirePermissions(PERMISSIONS.CHORES_MANAGE)
  async create(@CurrentAuth() auth: AuthContext, @Body() body: ChoreDto) {
    const chore = await this.prisma.chore.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        cadence: body.cadence,
        dayOfWeek: body.cadence === 'WEEKLY' ? (body.dayOfWeek ?? 0) : null,
        dayOfMonth: body.cadence === 'MONTHLY' ? (body.dayOfMonth ?? 1) : null,
        assigneeId: body.assigneeId ?? null,
        active: body.active ?? true,
      },
    });
    // A one-off has no rule to find it by, so its single occurrence is made
    // here rather than waiting for a recurrence that will never match.
    if (body.cadence === 'ONCE' && body.dueOn && isDateOnly(body.dueOn)) {
      await this.prisma.choreOccurrence.create({
        data: { choreId: chore.id, dueOn: toDbDate(body.dueOn) },
      });
    }
    await this.audit.log(auth, 'chore.create', 'Chore', chore.id, {
      name: chore.name,
      cadence: chore.cadence,
    });
    return chore;
  }

  @Put('definitions/:id')
  @RequirePermissions(PERMISSIONS.CHORES_MANAGE)
  async update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChoreDto,
  ) {
    const chore = await this.prisma.chore.update({
      where: { id },
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        cadence: body.cadence,
        dayOfWeek: body.cadence === 'WEEKLY' ? (body.dayOfWeek ?? 0) : null,
        dayOfMonth: body.cadence === 'MONTHLY' ? (body.dayOfMonth ?? 1) : null,
        assigneeId: body.assigneeId ?? null,
        ...(body.active === undefined ? {} : { active: body.active }),
      },
    });
    await this.audit.log(auth, 'chore.update', 'Chore', id, {
      name: chore.name,
    });
    return chore;
  }

  @Delete('definitions/:id')
  @RequirePermissions(PERMISSIONS.CHORES_MANAGE)
  async remove(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.prisma.chore.delete({ where: { id } });
    await this.audit.log(auth, 'chore.delete', 'Chore', id);
    return { ok: true };
  }

  /** Marking one done: open to any member, exactly as the Slack button is. */
  @Post(':id/complete')
  complete(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CompleteDto,
  ) {
    return this.chores.complete(id, requireMember(auth), {
      note: body.note,
      auth,
    });
  }

  /**
   * Hands one night to somebody, or clears the override.
   *
   * Separate from editing the chore because it means something different: a
   * swap for one night, not a change to whose job this is.
   */
  @Post(':id/assign')
  @RequirePermissions(PERMISSIONS.CHORES_MANAGE)
  assign(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignDto,
  ) {
    return this.chores.assignNight(auth, id, body.memberId ?? null);
  }

  @Post(':id/reopen')
  @RequirePermissions(PERMISSIONS.CHORES_MANAGE)
  reopen(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chores.reopen(auth, id);
  }

  /** Posts (or re-posts) today's list, for when the cron has not run yet. */
  @Post('post-to-slack')
  @RequirePermissions(PERMISSIONS.CHORES_MANAGE)
  async postNow() {
    return { posted: await this.chores.postToSlack() };
  }
}
