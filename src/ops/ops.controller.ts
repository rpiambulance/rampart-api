import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { displayName } from '../common/name';
import {
  describeAccess,
  mergeNewest,
  type FeedEntry,
} from '../audit/audit-feed';

class FuelEntryDto {
  @IsDateString()
  loggedAt!: string;

  @IsInt()
  vehicleId!: number;

  @IsNumber()
  amount!: number;

  @IsInt()
  mileage!: number;
}

class VehicleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class PatchVehicleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

class RadioDto {
  @IsString()
  number!: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  serial?: string;

  @IsOptional()
  accessories?: Record<string, boolean>;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

/** Fuel log + radio inventory/assignment (spec §7). */
@Controller({ version: '1' })
export class OpsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ---- fuel ----

  @Get('fuel')
  fuelEntries(@Query('limit') limit?: string) {
    return this.prisma.fuelLogEntry.findMany({
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
      orderBy: { loggedAt: 'desc' },
      take: limit ? Number(limit) : 100,
    });
  }

  @Post('fuel')
  async addFuel(@CurrentAuth() auth: AuthContext, @Body() body: FuelEntryDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: body.vehicleId },
    });
    if (!vehicle || !vehicle.active) {
      throw new ForbiddenException('Unknown or retired vehicle');
    }
    return this.prisma.fuelLogEntry.create({
      data: {
        loggedAt: new Date(body.loggedAt),
        memberId: requireMember(auth),
        vehicle: vehicle.name,
        vehicleId: vehicle.id,
        amount: body.amount,
        mileage: body.mileage,
      },
    });
  }

  // ---- vehicles ----

  @Get('vehicles')
  vehicles(@Query('includeRetired') includeRetired?: string) {
    return this.prisma.vehicle.findMany({
      where: includeRetired === 'true' ? {} : { active: true },
      orderBy: { name: 'asc' },
    });
  }

  @Post('vehicles')
  @RequirePermissions(PERMISSIONS.VEHICLES_MANAGE)
  async addVehicle(@CurrentAuth() auth: AuthContext, @Body() body: VehicleDto) {
    const vehicle = await this.prisma.vehicle.create({ data: body });
    await this.audit.log(auth, 'vehicles.create', 'Vehicle', vehicle.id);
    return vehicle;
  }

  @Patch('vehicles/:id')
  @RequirePermissions(PERMISSIONS.VEHICLES_MANAGE)
  async updateVehicle(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchVehicleDto,
  ) {
    const vehicle = await this.prisma.vehicle.update({
      where: { id },
      data: body,
    });
    await this.audit.log(auth, 'vehicles.update', 'Vehicle', id, body);
    return vehicle;
  }

  // ---- radios ----

  @Get('radios')
  radios() {
    return this.prisma.radio.findMany({
      include: {
        assignments: {
          where: { returnedAt: null },
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
      orderBy: { number: 'asc' },
    });
  }

  @Post('radios')
  @RequirePermissions(PERMISSIONS.RADIOS_MANAGE)
  addRadio(@Body() body: RadioDto) {
    return this.prisma.radio.create({ data: body });
  }

  @Post('radios/:id/issue/:memberId')
  @RequirePermissions(PERMISSIONS.RADIOS_MANAGE)
  async issue(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) radioId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    const open = await this.prisma.radioAssignment.findFirst({
      where: { radioId, returnedAt: null },
    });
    if (open) throw new ForbiddenException('Radio is already issued');
    const assignment = await this.prisma.radioAssignment.create({
      data: { radioId, memberId },
    });
    await this.audit.log(
      auth,
      'radios.issue',
      'RadioAssignment',
      assignment.id,
    );
    return assignment;
  }

  @Delete('radios/:id/issue')
  @RequirePermissions(PERMISSIONS.RADIOS_MANAGE)
  async returnRadio(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) radioId: number,
  ) {
    await this.prisma.radioAssignment.updateMany({
      where: { radioId, returnedAt: null },
      data: { returnedAt: new Date() },
    });
    await this.audit.log(auth, 'radios.return', 'Radio', radioId);
    return { ok: true };
  }

  // ---- audit ----

  /**
   * The audit log: decisions, page loads and API calls in one timeline.
   *
   * They live in two tables on purpose — decisions are kept forever, traffic
   * is pruned — but that is a storage decision, and reading them apart makes
   * the obvious question hard: "what did this person do on Tuesday" is one
   * question, not two. Merged here, filterable by kind, so the decision
   * record is still readable on its own.
   */
  @Get('audit')
  @RequirePermissions(PERMISSIONS.AUDIT_READ)
  async auditLog(
    @Query('limit') limit?: string,
    @Query('kind') kind?: string,
    @Query('memberId') memberId?: string,
    @Query('q') q?: string,
  ) {
    const take = Math.min(Number(limit) || 100, 500);
    const wanted = (kind ?? 'all').toLowerCase();
    const member = Number(memberId);
    const byMember = Number.isInteger(member) ? member : undefined;
    const search = (q ?? '').trim();

    const wantDecisions = wanted === 'all' || wanted === 'decision';
    const wantTraffic =
      wanted === 'all' || wanted === 'page' || wanted === 'api';

    const decisions = wantDecisions
      ? await this.prisma.auditLog.findMany({
          where: {
            ...(byMember
              ? { actorType: 'MEMBER' as const, actorId: byMember }
              : {}),
            ...(search
              ? {
                  OR: [
                    {
                      action: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                    {
                      entity: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  ],
                }
              : {}),
          },
          orderBy: { at: 'desc' },
          take,
        })
      : [];

    const traffic = wantTraffic
      ? await this.prisma.accessLog.findMany({
          where: {
            ...(wanted === 'page'
              ? { kind: 'PAGE' }
              : wanted === 'api'
                ? { kind: 'API' }
                : {}),
            ...(byMember ? { memberId: byMember } : {}),
            ...(search
              ? { path: { contains: search, mode: 'insensitive' as const } }
              : {}),
          },
          orderBy: { at: 'desc' },
          take,
        })
      : [];

    const decisionEntries: FeedEntry[] = decisions.map((e) => ({
      id: `audit:${e.id}`,
      kind: 'DECISION' as const,
      at: e.at,
      actorType: e.actorType,
      actorId: e.actorId,
      actorName: '',
      action: e.action,
      entity: e.entity,
      entityId: e.entityId,
      diff: e.diff,
      ip: e.ip,
    }));

    const trafficEntries: FeedEntry[] = traffic.map((row) => {
      const described = describeAccess(row);
      return {
        id: `access:${row.id}`,
        kind: row.kind === 'PAGE' ? 'PAGE' : 'API',
        at: row.at,
        actorType: row.memberId
          ? 'MEMBER'
          : row.apiTokenId
            ? 'API_TOKEN'
            : 'SYSTEM',
        actorId: row.memberId ?? row.apiTokenId,
        actorName: '',
        action: described.action,
        entity: described.entity,
        entityId: row.path,
        // What a traffic row has instead of a diff. Enough to tell a
        // refused request from a served one without opening anything.
        diff:
          row.kind === 'PAGE'
            ? null
            : {
                method: row.method,
                status: row.status,
                durationMs: row.durationMs,
              },
        ip: row.ip,
      };
    });

    const merged = mergeNewest([decisionEntries, trafficEntries], take);

    // Names resolved once for the page, not per row.
    const memberIds = [
      ...new Set(
        merged
          .filter((e) => e.actorType === 'MEMBER' && e.actorId != null)
          .map((e) => e.actorId!),
      ),
    ];
    const members = memberIds.length
      ? await this.prisma.member.findMany({
          where: { id: { in: memberIds } },
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        })
      : [];
    const names = new Map(members.map((m) => [m.id, displayName(m)]));

    return merged.map((e) => ({
      ...e,
      at: e.at.toISOString(),
      actorName:
        e.actorType === 'MEMBER' && e.actorId != null
          ? (names.get(e.actorId) ?? `member #${e.actorId}`)
          : e.actorType === 'API_TOKEN'
            ? `token #${e.actorId}`
            : 'system',
    }));
  }
}
