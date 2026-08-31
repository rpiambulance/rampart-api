import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

class ResourceDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(2000)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsInt()
  position?: number;
}

class PatchResourceDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsInt()
  position?: number;
}

/**
 * An address safe to put behind a link on a page members will click.
 *
 * http and https only. A `javascript:` URL saved by one member and clicked by
 * another runs in that member's session, which is a stored cross-site
 * scripting hole wearing the shape of a feature request; `data:` can carry a
 * whole document, which is the same problem one step removed.
 */
export function cleanUrl(raw: string): string {
  const value = raw.trim();
  let parsed: URL;
  try {
    // A bare "rpiambulance.com" is what people type; assume https rather than
    // rejecting it, which is both what they meant and the safe scheme.
    parsed = new URL(
      /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`,
    );
  } catch {
    throw new BadRequestException(`${raw} is not a web address`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new BadRequestException('Links must start with http:// or https://');
  }
  return parsed.toString();
}

/**
 * The shared list of links: protocols, the radio plan, whatever the agency
 * keeps having to send round. Readable by any member, editable by
 * resources:manage.
 */
@Controller({ path: 'resources', version: '1' })
export class ResourcesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  list() {
    return this.prisma.resource.findMany({
      orderBy: [{ position: 'asc' }, { title: 'asc' }],
      include: {
        createdBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });
  }

  @Post()
  @RequirePermissions(PERMISSIONS.RESOURCES_MANAGE)
  async create(@CurrentAuth() auth: AuthContext, @Body() body: ResourceDto) {
    const resource = await this.prisma.resource.create({
      data: {
        title: body.title.trim(),
        url: cleanUrl(body.url),
        description: body.description?.trim() || null,
        position: body.position ?? 0,
        createdById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.audit.log(auth, 'resources.create', 'Resource', resource.id, {
      title: resource.title,
    });
    return resource;
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.RESOURCES_MANAGE)
  async update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchResourceDto,
  ) {
    const resource = await this.prisma.resource.update({
      where: { id },
      data: {
        ...(body.title === undefined ? {} : { title: body.title.trim() }),
        ...(body.url === undefined ? {} : { url: cleanUrl(body.url) }),
        ...(body.description === undefined
          ? {}
          : { description: body.description.trim() || null }),
        ...(body.position === undefined ? {} : { position: body.position }),
      },
    });
    await this.audit.log(auth, 'resources.update', 'Resource', id, body);
    return resource;
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.RESOURCES_MANAGE)
  async remove(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.prisma.resource.delete({ where: { id } });
    await this.audit.log(auth, 'resources.delete', 'Resource', id);
    return { ok: true };
  }
}
