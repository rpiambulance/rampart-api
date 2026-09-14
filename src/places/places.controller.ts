import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PlacesService } from './places.service';

class PlaceDto {
  @IsOptional() @IsString() @MaxLength(200) name?: string;
  @IsOptional() @IsString() @MaxLength(300) address?: string | null;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string | null;
  @IsOptional() @IsBoolean() active?: boolean;
  /** The letter its run numbers carry. Needs run-numbers:manage. */
  @IsOptional() @IsString() @MaxLength(8) abbr?: string | null;
  /** The place it files its numbering under, when it has no letter. */
  @IsOptional() @IsInt() parentId?: number | null;
  /** The number the next run here takes. Needs run-numbers:manage. */
  @IsOptional() @IsInt() @Min(1) nextRun?: number;
}

class SpotDto {
  @IsOptional() @IsString() @MaxLength(200) name?: string;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

/**
 * Places: one list, one page, one set of routes.
 *
 * Reading needs nothing beyond being signed in — a place is a name and an
 * address, and every picker in the portal draws on it. Editing is
 * settings:write, except the run-number letter and its counter, which are
 * what a number filed with the county is made of and stay with
 * run-numbers:manage.
 */
@Controller({ path: 'places', version: '1' })
export class PlacesController {
  constructor(private readonly places: PlacesService) {}

  @Get()
  list(@Query('all') all?: string) {
    return this.places.list(all === '1');
  }

  @Post()
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  create(@CurrentAuth() auth: AuthContext, @Body() body: PlaceDto) {
    return this.places.create(auth, body);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PlaceDto,
  ) {
    return this.places.update(auth, id, body);
  }

  @Post(':id/spots')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  addSpot(@Param('id', ParseIntPipe) id: number, @Body() body: SpotDto) {
    return this.places.addSpot(id, body.name ?? '', body.order);
  }

  @Patch('spots/:spotId')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  updateSpot(
    @Param('spotId', ParseIntPipe) spotId: number,
    @Body() body: SpotDto,
  ) {
    return this.places.updateSpot(spotId, body);
  }

  @Delete('spots/:spotId')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  retireSpot(@Param('spotId', ParseIntPipe) spotId: number) {
    return this.places.retireSpot(spotId);
  }
}
