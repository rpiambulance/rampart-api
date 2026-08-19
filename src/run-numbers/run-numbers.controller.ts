import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import type { DivisionConfig } from './divisions';
import { RunNumbersService } from './run-numbers.service';

class IssueDto {
  @IsInt()
  locationId!: number;

  /** Required only in the months where either term letter could apply. */
  @IsOptional()
  @IsString()
  division?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsInt()
  eventId?: number;
}

class LocationDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  name!: string;

  @IsString()
  abbr!: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  nextRun?: number;
}

class DivisionsDto {
  @IsArray()
  divisions!: DivisionConfig['divisions'];

  @IsArray()
  ambiguous!: DivisionConfig['ambiguous'];
}

/**
 * Run numbers for standby events.
 *
 * Issuing needs no permission — anyone standing by may need one, and the
 * record of who took it is the accountability, not a gate in front of it.
 * Changing locations or winding a counter does.
 */
@Controller({ path: 'run-numbers', version: '1' })
export class RunNumbersController {
  constructor(private readonly runNumbers: RunNumbersService) {}

  @Get()
  async list(@Query('limit') limit?: string) {
    const [term, locations, recent] = await Promise.all([
      this.runNumbers.currentTerm(),
      this.runNumbers.listLocations(),
      this.runNumbers.recent(Number(limit) || 50),
    ]);
    return { term, locations, recent };
  }

  @Get('locations')
  @RequirePermissions(PERMISSIONS.RUN_NUMBERS_MANAGE)
  locations() {
    return this.runNumbers.listLocations(true);
  }

  @Post()
  issue(@CurrentAuth() auth: AuthContext, @Body() body: IssueDto) {
    return this.runNumbers.issue(auth, body.locationId, {
      division: body.division,
      note: body.note,
      eventId: body.eventId,
    });
  }

  @Put('locations')
  @RequirePermissions(PERMISSIONS.RUN_NUMBERS_MANAGE)
  saveLocation(@CurrentAuth() auth: AuthContext, @Body() body: LocationDto) {
    return this.runNumbers.upsertLocation(auth, body);
  }

  @Get('divisions')
  divisions() {
    return this.runNumbers.divisionConfig();
  }

  @Put('divisions')
  @RequirePermissions(PERMISSIONS.RUN_NUMBERS_MANAGE)
  saveDivisions(@CurrentAuth() auth: AuthContext, @Body() body: DivisionsDto) {
    return this.runNumbers.saveDivisions(auth, body);
  }
}
