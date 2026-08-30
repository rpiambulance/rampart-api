import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { ChecksheetsService } from './checksheets.service';

const KINDS = ['PRESENCE', 'PAR'] as const;
const TRACKING = ['NONE', 'SINGLE', 'PER_UNIT'] as const;
const CADENCES = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'] as const;

class EntryDto {
  @IsInt()
  itemId!: number;

  @IsOptional()
  @IsBoolean()
  present?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  countPresent?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expiries?: string[];
}

class SectionEntryDto {
  @IsInt()
  sectionId!: number;

  @IsOptional()
  @IsBoolean()
  sealPresent?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sealNumber?: string;

  @IsOptional()
  @IsBoolean()
  sealBroken?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

class CompleteDto {
  @IsInt()
  templateId!: number;

  @IsOptional()
  @IsInt()
  assetId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  comment?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entries!: EntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionEntryDto)
  sections?: SectionEntryDto[];
}

class TemplateDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsInt()
  assetKindId?: number | null;

  @IsOptional()
  @IsIn(CADENCES)
  cadence?: (typeof CADENCES)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  expiryWarningDays?: number | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  notifyRoleIds?: number[];
}

export class SectionDto {
  @IsString()
  @MaxLength(150)
  heading!: string;

  @IsOptional()
  @IsBoolean()
  hasSeal?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

/**
 * A partial edit to a section.
 *
 * Separate from SectionDto because creating one needs a heading and changing
 * one does not: reusing the create shape made "just turn the seal on" fail
 * validation for a heading nobody was editing.
 */
export class PatchSectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  heading?: string;

  @IsOptional()
  @IsBoolean()
  hasSeal?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

class ItemDto {
  @IsString()
  @MaxLength(200)
  label!: string;

  @IsOptional()
  @IsInt()
  sectionId?: number | null;

  @IsOptional()
  @IsIn(KINDS)
  kind?: (typeof KINDS)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  parLevel?: number | null;

  @IsOptional()
  @IsIn(TRACKING)
  expiryTracking?: (typeof TRACKING)[number];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

class OrderItemDto {
  @IsInt()
  id!: number;

  /** Null moves it to the top level, out of any section. */
  @IsOptional()
  @IsInt()
  sectionId?: number | null;

  @IsInt()
  @Min(0)
  order!: number;
}

class ReorderDto {
  /** Section ids, in the order they should appear. */
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  sectionIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}

/** As PatchSectionDto, and for the same reason. */
export class PatchItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  label?: string;

  @IsOptional()
  @IsInt()
  sectionId?: number | null;

  @IsOptional()
  @IsIn(KINDS)
  kind?: (typeof KINDS)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  parLevel?: number | null;

  @IsOptional()
  @IsIn(TRACKING)
  expiryTracking?: (typeof TRACKING)[number];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

class ResolveDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

class AssetDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsInt()
  kindId!: number;

  @IsOptional()
  @IsInt()
  vehicleId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  identifier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

class AssetKindDto {
  @IsString()
  @MaxLength(100)
  name!: string;
}

/**
 * Checksheets: the routine checks of trucks, bags and gear.
 *
 * Reading a blank sheet and filling one in are open to every member — a check
 * is worth more done by whoever is standing at the truck than gated behind a
 * permission and therefore not done. Reading back other people's, and
 * building the sheets themselves, are the parts that need one.
 */
@Controller({ path: 'checksheets', version: '1' })
export class ChecksheetsController {
  constructor(
    private readonly checksheets: ChecksheetsService,
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  list(@Query('includeInactive') includeInactive?: string) {
    return this.checksheets.listTemplates(includeInactive === 'true');
  }

  /** Everything due or overdue, for the landing page and the nav count. */
  @Get('due')
  due() {
    return this.checksheets.dueList();
  }

  @Get('assets')
  assets(@Query('kindId') kindId?: string) {
    return this.prisma.asset.findMany({
      where: {
        active: true,
        ...(kindId ? { kindId: Number(kindId) } : {}),
      },
      include: { kind: true, vehicle: { select: { id: true, name: true } } },
      orderBy: [{ kindId: 'asc' }, { name: 'asc' }],
    });
  }

  @Get('asset-kinds')
  assetKinds() {
    return this.prisma.assetKind.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }

  @Get('deficiencies')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_READ_ALL)
  deficiencies(@Query('assetId') assetId?: string) {
    return this.checksheets.openDeficiencies(
      assetId ? Number(assetId) : undefined,
    );
  }

  @Get('expiring')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_READ_ALL)
  expiring(@Query('withinDays') withinDays?: string) {
    return this.checksheets.expiring(
      withinDays ? Number(withinDays) : undefined,
    );
  }

  @Get('runs')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_READ_ALL)
  runs(
    @Query('templateId') templateId?: string,
    @Query('assetId') assetId?: string,
    @Query('take') take?: string,
  ) {
    return this.checksheets.runs({
      templateId: templateId ? Number(templateId) : undefined,
      assetId: assetId ? Number(assetId) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  /** Reading one back. Your own is always allowed; see runFor. */
  @Get('runs/:id')
  run(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.checksheets.runFor(auth, id);
  }

  @Get(':id')
  template(@Param('id', ParseIntPipe) id: number) {
    return this.checksheets.template(id);
  }

  /** The sheet to fill in, with last time's dates carried forward. */
  @Get(':id/blank')
  blank(
    @Param('id', ParseIntPipe) id: number,
    @Query('assetId') assetId?: string,
  ) {
    return this.checksheets.blank(id, assetId ? Number(assetId) : undefined);
  }

  @Post('complete')
  complete(@CurrentAuth() auth: AuthContext, @Body() body: CompleteDto) {
    return this.checksheets.complete(auth, body);
  }

  @Post('deficiencies/:id/resolve')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_READ_ALL)
  resolve(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ResolveDto,
  ) {
    return this.checksheets.resolveDeficiency(auth, id, body.note);
  }

  // ------------------------------------------------------- administration

  @Post()
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async createTemplate(
    @CurrentAuth() auth: AuthContext,
    @Body() body: TemplateDto,
  ) {
    const template = await this.prisma.checksheetTemplate.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        assetKindId: body.assetKindId ?? null,
        cadence: body.cadence ?? 'NONE',
        expiryWarningDays: body.expiryWarningDays ?? null,
        ...(body.notifyRoleIds
          ? {
              notifyRoles: {
                connect: body.notifyRoleIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });
    await this.audit.log(
      auth,
      'checksheets.template.create',
      'ChecksheetTemplate',
      template.id,
      {
        name: template.name,
      },
    );
    return template;
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async updateTemplate(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TemplateDto,
  ) {
    const template = await this.prisma.checksheetTemplate.update({
      where: { id },
      data: {
        ...(body.name === undefined ? {} : { name: body.name.trim() }),
        ...(body.description === undefined
          ? {}
          : { description: body.description.trim() || null }),
        ...(body.assetKindId === undefined
          ? {}
          : { assetKindId: body.assetKindId }),
        ...(body.cadence === undefined ? {} : { cadence: body.cadence }),
        ...(body.expiryWarningDays === undefined
          ? {}
          : { expiryWarningDays: body.expiryWarningDays }),
        ...(body.active === undefined ? {} : { active: body.active }),
        // Replaced wholesale: the form sends the full set it wants told.
        ...(body.notifyRoleIds
          ? { notifyRoles: { set: body.notifyRoleIds.map((r) => ({ id: r })) } }
          : {}),
      },
    });
    await this.audit.log(
      auth,
      'checksheets.template.update',
      'ChecksheetTemplate',
      id,
      body,
    );
    return template;
  }

  /**
   * The whole layout at once: which section each item is in, and the order of
   * both. Sent as one piece because a drag moves several rows at a time, and
   * applying those one by one leaves the sheet briefly in an order nobody
   * chose — visible to anyone else looking at it.
   */
  @Put(':id/order')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  reorder(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReorderDto,
  ) {
    return this.checksheets.reorder(auth, id, body);
  }

  @Post(':id/sections')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async addSection(
    @Param('id', ParseIntPipe) templateId: number,
    @Body() body: SectionDto,
  ) {
    const last = await this.prisma.checksheetSection.findFirst({
      where: { templateId },
      orderBy: { order: 'desc' },
    });
    return this.prisma.checksheetSection.create({
      data: {
        templateId,
        heading: body.heading.trim(),
        description: body.description?.trim() || null,
        hasSeal: body.hasSeal ?? false,
        order: body.order ?? (last ? last.order + 1 : 0),
      },
    });
  }

  @Patch('sections/:id')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchSectionDto,
  ) {
    return this.prisma.checksheetSection.update({
      where: { id },
      data: {
        ...(body.heading === undefined ? {} : { heading: body.heading.trim() }),
        ...(body.hasSeal === undefined ? {} : { hasSeal: body.hasSeal }),
        ...(body.description === undefined
          ? {}
          : { description: body.description.trim() || null }),
        ...(body.order === undefined ? {} : { order: body.order }),
      },
    });
  }

  @Delete('sections/:id')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async removeSection(@Param('id', ParseIntPipe) id: number) {
    await this.prisma.checksheetSection.delete({ where: { id } });
    return { ok: true };
  }

  @Post(':id/items')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async addItem(
    @Param('id', ParseIntPipe) templateId: number,
    @Body() body: ItemDto,
  ) {
    const last = await this.prisma.checksheetItem.findFirst({
      where: { templateId, sectionId: body.sectionId ?? null },
      orderBy: { order: 'desc' },
    });
    return this.prisma.checksheetItem.create({
      data: {
        templateId,
        sectionId: body.sectionId ?? null,
        label: body.label.trim(),
        notes: body.notes?.trim() || null,
        kind: body.kind ?? 'PRESENCE',
        parLevel: body.kind === 'PAR' ? (body.parLevel ?? 1) : null,
        expiryTracking: body.expiryTracking ?? 'NONE',
        order: body.order ?? (last ? last.order + 1 : 0),
      },
    });
  }

  @Patch('items/:id')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchItemDto,
  ) {
    const existing = await this.prisma.checksheetItem.findUniqueOrThrow({
      where: { id },
    });
    const kind = body.kind ?? existing.kind;
    return this.prisma.checksheetItem.update({
      where: { id },
      data: {
        ...(body.label === undefined ? {} : { label: body.label.trim() }),
        ...(body.notes === undefined
          ? {}
          : { notes: body.notes.trim() || null }),
        ...(body.sectionId === undefined ? {} : { sectionId: body.sectionId }),
        ...(body.order === undefined ? {} : { order: body.order }),
        ...(body.expiryTracking === undefined
          ? {}
          : { expiryTracking: body.expiryTracking }),
        kind,
        // A par level belongs to a PAR item and nothing else, so switching
        // kind clears it rather than leaving a number nobody reads.
        parLevel:
          kind === 'PAR' ? (body.parLevel ?? existing.parLevel ?? 1) : null,
      },
    });
  }

  @Delete('items/:id')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async removeItem(@Param('id', ParseIntPipe) id: number) {
    await this.prisma.checksheetItem.delete({ where: { id } });
    return { ok: true };
  }

  @Post('asset-kinds')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  createAssetKind(@Body() body: AssetKindDto) {
    return this.prisma.assetKind.create({ data: { name: body.name.trim() } });
  }

  @Post('assets')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  async createAsset(@CurrentAuth() auth: AuthContext, @Body() body: AssetDto) {
    const asset = await this.prisma.asset.create({
      data: {
        name: body.name.trim(),
        kindId: body.kindId,
        vehicleId: body.vehicleId ?? null,
        identifier: body.identifier?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });
    await this.audit.log(auth, 'checksheets.asset.create', 'Asset', asset.id, {
      name: asset.name,
    });
    return asset;
  }

  @Put('assets/:id')
  @RequirePermissions(PERMISSIONS.CHECKSHEETS_MANAGE)
  updateAsset(@Param('id', ParseIntPipe) id: number, @Body() body: AssetDto) {
    return this.prisma.asset.update({
      where: { id },
      data: {
        ...(body.name === undefined ? {} : { name: body.name.trim() }),
        ...(body.kindId === undefined ? {} : { kindId: body.kindId }),
        ...(body.vehicleId === undefined ? {} : { vehicleId: body.vehicleId }),
        ...(body.identifier === undefined
          ? {}
          : { identifier: body.identifier.trim() || null }),
        ...(body.notes === undefined
          ? {}
          : { notes: body.notes.trim() || null }),
        ...(body.active === undefined ? {} : { active: body.active }),
      },
    });
  }
}
