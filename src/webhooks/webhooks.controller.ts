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
} from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { WEBHOOK_EVENTS, WEBHOOK_EVENT_KEYS } from './events';
import { WebhooksService } from './webhooks.service';

class WebhookDto {
  @IsString()
  name!: string;

  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  url!: string;

  @IsOptional()
  @IsArray()
  @IsIn(WEBHOOK_EVENT_KEYS, { each: true })
  events?: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

/**
 * Outbound webhooks: telling other systems what happened here.
 *
 * The secret is shown once, on creation, and never again — it is the only
 * thing a receiver can use to tell a genuine delivery from anything else, so
 * it is stored to be sent with deliveries rather than displayed on a page.
 */
@Controller({ path: 'webhooks', version: '1' })
@RequirePermissions(PERMISSIONS.INTEGRATIONS_MANAGE)
export class WebhooksController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** The catalog, for building the subscription form. */
  @Get('events')
  events() {
    return WEBHOOK_EVENTS;
  }

  @Get()
  list() {
    return this.prisma.webhook.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        events: true,
        active: true,
        createdAt: true,
        lastStatus: true,
        lastAt: true,
        lastError: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id/deliveries')
  deliveries(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.webhookDelivery.findMany({
      where: { webhookId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Post()
  async create(@CurrentAuth() auth: AuthContext, @Body() body: WebhookDto) {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('Webhooks must be created by a member');
    }
    const secret = WebhooksService.newSecret();
    const hook = await this.prisma.webhook.create({
      data: {
        name: body.name.trim(),
        url: body.url.trim(),
        events: body.events ?? [],
        secret,
        active: body.active ?? true,
        createdById: auth.memberId,
      },
    });
    await this.audit.log(auth, 'webhook.create', 'Webhook', hook.id, {
      name: hook.name,
      url: hook.url,
      events: hook.events,
    });
    // Shown once.
    return { id: hook.id, name: hook.name, secret };
  }

  @Put(':id')
  async update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WebhookDto,
  ) {
    const hook = await this.prisma.webhook.update({
      where: { id },
      data: {
        name: body.name.trim(),
        url: body.url.trim(),
        events: body.events ?? [],
        ...(body.active === undefined ? {} : { active: body.active }),
      },
    });
    await this.audit.log(auth, 'webhook.update', 'Webhook', id, {
      name: hook.name,
      url: hook.url,
      events: hook.events,
      active: hook.active,
    });
    return { ok: true };
  }

  @Delete(':id')
  async remove(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.prisma.webhook.delete({ where: { id } });
    await this.audit.log(auth, 'webhook.delete', 'Webhook', id);
    return { ok: true };
  }
}
