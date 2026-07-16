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
  Put,
  Query,
} from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { EventsService } from './events.service';

class PositionDto {
  @IsString()
  position!: string;

  @IsInt()
  @Min(1)
  count!: number;

  @IsOptional()
  @IsString()
  requiredCredentialKey?: string | null;
}

class CreateEventDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsInt()
  kindId!: number;

  @IsOptional()
  @IsInt()
  tierId?: number | null;

  @IsOptional()
  @IsInt()
  attendeeCap?: number | null;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  positions?: PositionDto[];
}

class UpdateEventDto extends CreateEventDto {}

class SignupDto {
  @IsOptional()
  @IsString()
  position?: string | null;
}

class WorkflowDto {
  @IsIn(['REQUEST_AVAILABILITY', 'SUBMIT_FOR_APPROVAL', 'APPROVE', 'DENY', 'CANCEL'])
  action!: 'REQUEST_AVAILABILITY' | 'SUBMIT_FOR_APPROVAL' | 'APPROVE' | 'DENY' | 'CANCEL';

  @IsOptional()
  @IsString()
  notes?: string;
}

class AvailabilityDto {
  @IsArray()
  @IsString({ each: true })
  positions!: string[];

  @IsOptional()
  @IsString()
  note?: string;
}

class TierDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  defaults?: Record<string, unknown>;
}

class PatchTierDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  defaults?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

class KindDto {
  @IsString()
  name!: string;

  @IsOptional()
  defaults?: Record<string, unknown>;
}

class PatchKindDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  defaults?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.events.list({ from, to });
  }

  @Get('kinds')
  kinds() {
    return this.events.listKinds();
  }

  @Get('tiers')
  tiers() {
    return this.events.listTiers();
  }

  @Post('tiers')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  createTier(@Body() body: TierDto) {
    return this.events.createTier(body);
  }

  @Patch('tiers/:id')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  updateTier(@Param('id', ParseIntPipe) id: number, @Body() body: PatchTierDto) {
    return this.events.updateTier(id, body);
  }

  @Post('kinds')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  createKind(@Body() body: KindDto) {
    return this.events.createKind(body.name, body.defaults);
  }

  @Patch('kinds/:id')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  updateKind(@Param('id', ParseIntPipe) id: number, @Body() body: PatchKindDto) {
    return this.events.updateKind(id, body);
  }

  @Get(':id')
  get(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.events.get(
      id,
      auth.kind === 'member' ? auth.memberId : undefined,
    );
  }

  @Post()
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  create(@CurrentAuth() auth: AuthContext, @Body() body: CreateEventDto) {
    return this.events.create(auth, body);
  }

  @Put(':id')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventDto,
  ) {
    return this.events.update(auth, id, body);
  }

  @Patch(':id/lock')
  @RequirePermissions(PERMISSIONS.EVENTS_LOCK)
  lock(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { locked: boolean },
  ) {
    return this.events.setLocked(auth, id, !!body.locked);
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  remove(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.events.remove(auth, id);
  }

  /** Advance the coverage workflow. APPROVE/DENY need events:approve. */
  @Post(':id/workflow')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  workflow(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WorkflowDto,
  ) {
    if (
      (body.action === 'APPROVE' || body.action === 'DENY') &&
      !auth.permissions.has(PERMISSIONS.EVENTS_APPROVE)
    ) {
      throw new ForbiddenException('Missing permission: events:approve');
    }
    return this.events.advanceWorkflow(auth, id, body.action, body.notes);
  }

  /** "I can work this" — member availability during the workflow. */
  @Post(':id/availability')
  respondAvailability(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AvailabilityDto,
  ) {
    return this.events.respondAvailability(
      requireMember(auth),
      id,
      body.positions,
      body.note,
    );
  }

  @Get(':id/availability')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  listAvailability(@Param('id', ParseIntPipe) id: number) {
    return this.events.listAvailability(id);
  }

  @Post(':id/signup')
  signup(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SignupDto,
  ) {
    return this.events.signup(requireMember(auth), id, body.position ?? null);
  }

  @Delete(':id/signup')
  drop(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.events.drop(requireMember(auth), id);
  }

  @Post(':id/signup/:memberId')
  @RequirePermissions(PERMISSIONS.EVENTS_ASSIGN_OTHERS)
  signupOther(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() body: SignupDto,
  ) {
    return this.events.signup(memberId, id, body.position ?? null, {
      override: true,
    });
  }

  @Delete(':id/signup/:memberId')
  @RequirePermissions(PERMISSIONS.EVENTS_ASSIGN_OTHERS)
  dropOther(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.events.dropOther(auth, id, memberId);
  }
}
