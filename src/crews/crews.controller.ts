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
import { IsIn, IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
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

@Controller({ path: 'crews', version: '1' })
export class CrewsController {
  constructor(
    private readonly crews: CrewsService,
    private readonly settings: SettingsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getWeeks(
    @CurrentAuth() auth: AuthContext,
    @Query('viewDate') viewDate?: string,
  ) {
    if (viewDate && !/^\d{4}-\d{2}-\d{2}$/.test(viewDate)) {
      viewDate = undefined;
    }
    return this.crews.getWeeks(requireMember(auth), viewDate);
  }

  @Post(':crewId/slots/:position/signup')
  signup(
    @CurrentAuth() auth: AuthContext,
    @Param('crewId', ParseIntPipe) crewId: number,
    @Param('position') position: CrewPosition,
  ) {
    return this.crews.signup(requireMember(auth), crewId, position);
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
      update: { memberId: body.memberId ?? null, placeholder: body.placeholder ?? null },
    });
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
