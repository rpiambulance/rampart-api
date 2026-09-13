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

class VenueDto {
  @IsString() @MaxLength(200) name!: string;
  @IsOptional() @IsString() @MaxLength(300) address?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

class VenueLocationDto {
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
 * The standing kit a standby is assembled from: where events happen, what
 * the insides of those places are called, what units are designated, and
 * where patients can be taken.
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

  @Post('venues')
  async createVenue(@CurrentAuth() auth: AuthContext, @Body() body: VenueDto) {
    const venue = await this.prisma.venue.create({
      data: {
        name: body.name.trim(),
        address: body.address?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });
    await this.audit.log(auth, 'standby.venue.create', 'Venue', venue.id, {
      name: venue.name,
    });
    return venue;
  }

  @Patch('venues/:id')
  updateVenue(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<VenueDto>,
  ) {
    return this.prisma.venue.update({
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
      },
    });
  }

  @Post('venues/:id/locations')
  addLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: VenueLocationDto,
  ) {
    return this.prisma.venueLocation.create({
      data: { venueId: id, name: body.name.trim(), order: body.order ?? 0 },
    });
  }

  @Patch('locations/:id')
  updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<VenueLocationDto>,
  ) {
    return this.prisma.venueLocation.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
  }

  /** Retired rather than deleted: past standbys still point at it. */
  @Delete('locations/:id')
  retireLocation(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.venueLocation.update({
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
