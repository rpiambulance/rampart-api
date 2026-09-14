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
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

class DesignatorDto {
  @IsString() @MaxLength(60) name!: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

class HospitalDto {
  @IsString() @MaxLength(200) name!: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

class ActionDto {
  @IsOptional() @IsString() @MaxLength(60) label?: string;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

/**
 * The standing kit a standby is assembled from: what units are designated,
 * where patients can be taken, and the buttons an encounter offers.
 *
 * The places themselves are not here. They serve events and run numbers as
 * well as standbys, so they have one list and one page of their own —
 * /v1/places — rather than a copy behind every feature that reads them.
 *
 * Configuration, so it sits behind the same permission as the rest of the
 * app's settings rather than inventing another one.
 */
@Controller({ path: 'standbys/config', version: '1' })
@RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
export class Ems2ConfigController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The buttons on an encounter.
   *
   * Short and in the order they usually happen — dispatched, on scene,
   * investigating, moving to FAR — because the point of them is that a crew
   * chief marks the time with a thumb rather than typing a sentence.
   */
  @Post('actions')
  createAction(@Body() body: ActionDto) {
    return this.prisma.encounterAction.create({
      data: { label: (body.label ?? '').trim(), order: body.order ?? 0 },
    });
  }

  @Patch('actions/:id')
  updateAction(@Param('id', ParseIntPipe) id: number, @Body() body: ActionDto) {
    return this.prisma.encounterAction.update({
      where: { id },
      data: {
        ...(body.label !== undefined ? { label: body.label.trim() } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
  }

  /**
   * Retired rather than deleted: what was pressed keeps the words that were
   * on the button at the time, and the timeline holds them, not this row.
   */
  @Delete('actions/:id')
  retireAction(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.encounterAction.update({
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
