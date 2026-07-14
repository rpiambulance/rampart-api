import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
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

class FuelEntryDto {
  @IsDateString()
  loggedAt!: string;

  @IsString()
  vehicle!: string;

  @IsNumber()
  amount!: number;

  @IsInt()
  mileage!: number;
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
        member: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { loggedAt: 'desc' },
      take: limit ? Number(limit) : 100,
    });
  }

  @Post('fuel')
  addFuel(@CurrentAuth() auth: AuthContext, @Body() body: FuelEntryDto) {
    return this.prisma.fuelLogEntry.create({
      data: {
        loggedAt: new Date(body.loggedAt),
        memberId: requireMember(auth),
        vehicle: body.vehicle,
        amount: body.amount,
        mileage: body.mileage,
      },
    });
  }

  // ---- radios ----

  @Get('radios')
  radios() {
    return this.prisma.radio.findMany({
      include: {
        assignments: {
          where: { returnedAt: null },
          include: {
            member: { select: { id: true, firstName: true, lastName: true } },
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
    await this.audit.log(auth, 'radios.issue', 'RadioAssignment', assignment.id);
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

  @Get('audit')
  @RequirePermissions(PERMISSIONS.AUDIT_READ)
  auditLog(@Query('limit') limit?: string) {
    return this.prisma.auditLog.findMany({
      orderBy: { at: 'desc' },
      take: limit ? Math.min(Number(limit), 500) : 100,
    });
  }
}
