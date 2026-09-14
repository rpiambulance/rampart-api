import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

class PlaceDto {
  @IsString() @MaxLength(200) name!: string;
  @IsOptional() @IsString() @MaxLength(300) address?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsOptional() @IsBoolean() active?: boolean;
  /**
   * The letter this place's run numbers carry. Typed by an officer and
   * never generated: it is inside the number the county reads.
   */
  @IsOptional() @IsString() @MaxLength(8) abbr?: string | null;
  /** The place this one files its numbering under, when it has no letter. */
  @IsOptional() @IsInt() parentId?: number | null;
}

class SpotDto {
  @IsString() @MaxLength(200) name!: string;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

class DesignatorDto {
  @IsString() @MaxLength(60) name!: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

class HospitalDto {
  @IsString() @MaxLength(200) name!: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

/**
 * The standing kit a standby is assembled from: the places the agency goes,
 * what the insides of those places are called, what units are designated,
 * and where patients can be taken.
 *
 * A place is one row whichever of its jobs you came for — an event's
 * location, a standby's venue, or the counter the run numbers take their
 * letter from.
 *
 * Configuration, so it sits behind the same permission as the rest of the
 * app's settings rather than inventing another one.
 */
@Controller({ path: 'standbys/config', version: '1' })
@RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
export class Ems2ConfigController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Post('places')
  async createPlace(@CurrentAuth() auth: AuthContext, @Body() body: PlaceDto) {
    const place = await this.prisma.place.create({
      data: {
        name: body.name.trim(),
        address: body.address?.trim() || null,
        notes: body.notes?.trim() || null,
        abbr: body.abbr?.trim().toUpperCase() || null,
        parentId: body.parentId ?? null,
      },
    });
    await this.audit.log(auth, 'standby.place.create', 'Place', place.id, {
      name: place.name,
      abbr: place.abbr,
    });
    return place;
  }

  @Patch('places/:id')
  async updatePlace(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<PlaceDto>,
  ) {
    const place = await this.prisma.place.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.address !== undefined
          ? { address: body.address?.trim() || null }
          : {}),
        ...(body.notes !== undefined
          ? { notes: body.notes?.trim() || null }
          : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
        ...(body.abbr !== undefined
          ? { abbr: body.abbr?.trim().toUpperCase() || null }
          : {}),
        ...(body.parentId !== undefined ? { parentId: body.parentId } : {}),
      },
    });
    // Worth a line of its own: the letter is in every number issued after
    // it, and the counter is the agency's own sequence.
    if (body.abbr !== undefined) {
      await this.audit.log(auth, 'standby.place.abbr', 'Place', id, {
        abbr: place.abbr,
      });
    }
    return place;
  }

  @Post('places/:id/spots')
  addSpot(@Param('id', ParseIntPipe) id: number, @Body() body: SpotDto) {
    return this.prisma.placeSpot.create({
      data: { placeId: id, name: body.name.trim(), order: body.order ?? 0 },
    });
  }

  @Patch('spots/:id')
  updateSpot(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<SpotDto>,
  ) {
    return this.prisma.placeSpot.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
  }

  /** Retired rather than deleted: past standbys still point at it. */
  @Delete('spots/:id')
  retireSpot(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.placeSpot.update({
      where: { id },
      data: { active: false },
    });
  }

  @Post('designators')
  createDesignator(@Body() body: DesignatorDto) {
    return this.prisma.unitDesignator.create({
      data: { name: body.name.trim() },
    });
  }

  @Patch('designators/:id')
  updateDesignator(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<DesignatorDto>,
  ) {
    return this.prisma.unitDesignator.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
  }

  @Post('hospitals')
  createHospital(@Body() body: HospitalDto) {
    return this.prisma.hospital.create({ data: { name: body.name.trim() } });
  }

  @Patch('hospitals/:id')
  updateHospital(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<HospitalDto>,
  ) {
    return this.prisma.hospital.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
  }
}
