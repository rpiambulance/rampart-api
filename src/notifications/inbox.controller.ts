import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IsBoolean, IsIn, IsObject, IsOptional } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import {
  MESSAGE_TYPES,
  MESSAGE_TYPE_KEYS,
  NOTIFICATION_SETTING_KEY,
  channelsFor,
  type ChannelSettings,
} from './message-types';

class ChannelSettingsDto {
  @IsObject()
  channels!: ChannelSettings;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

/** A member's own inbox. Everything here belongs to the caller. */
@Controller({ path: 'inbox', version: '1' })
export class InboxController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(
    @CurrentAuth() auth: AuthContext,
    @Query('filter') filter?: string,
  ) {
    const memberId = requireMember(auth);
    const where =
      filter === 'tasks'
        ? { memberId, isTask: true, completedAt: null }
        : filter === 'unread'
          ? { memberId, readAt: null }
          : { memberId };
    return this.prisma.inboxMessage.findMany({
      where,
      orderBy: [{ completedAt: 'asc' }, { createdAt: 'desc' }],
      take: 200,
    });
  }

  /** Counts for the navigation badge. */
  @Get('summary')
  async summary(@CurrentAuth() auth: AuthContext) {
    const memberId = requireMember(auth);
    const [unread, tasks] = await Promise.all([
      this.prisma.inboxMessage.count({ where: { memberId, readAt: null } }),
      this.prisma.inboxMessage.count({
        where: { memberId, isTask: true, completedAt: null },
      }),
    ]);
    return { unread, tasks };
  }

  @Post(':id/read')
  async markRead(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // Scoped by memberId so one member cannot touch another's inbox.
    await this.prisma.inboxMessage.updateMany({
      where: { id, memberId: requireMember(auth), readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  @Post('read-all')
  async markAllRead(@CurrentAuth() auth: AuthContext) {
    const result = await this.prisma.inboxMessage.updateMany({
      where: { memberId: requireMember(auth), readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true, marked: result.count };
  }

  @Post(':id/complete')
  async complete(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const now = new Date();
    await this.prisma.inboxMessage.updateMany({
      where: { id, memberId: requireMember(auth), isTask: true },
      data: { completedAt: now, readAt: now },
    });
    return { ok: true };
  }
}

/** Which channels carry which message types. */
@Controller({ path: 'settings/notifications', version: '1' })
export class NotificationSettingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  async read() {
    const row = await this.prisma.appSetting.findUnique({
      where: { key: NOTIFICATION_SETTING_KEY },
    });
    const stored = (row?.value as unknown as ChannelSettings) ?? null;
    // Resolved values, so the UI shows what is actually in force rather than
    // a blank for anything never configured.
    return MESSAGE_TYPES.map((type) => ({
      ...type,
      channels: channelsFor(stored, type.key),
    }));
  }

  @Put()
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  async save(
    @CurrentAuth() auth: AuthContext,
    @Body() body: ChannelSettingsDto,
  ) {
    // Only known types, so a stale form cannot write settings nothing reads.
    const value: ChannelSettings = {};
    for (const key of MESSAGE_TYPE_KEYS) {
      const wanted = body.channels[key];
      if (!wanted) continue;
      value[key] = { email: !!wanted.email, slack: !!wanted.slack };
    }
    await this.prisma.appSetting.upsert({
      where: { key: NOTIFICATION_SETTING_KEY },
      create: { key: NOTIFICATION_SETTING_KEY, value },
      update: { value },
    });
    await this.audit.log(
      auth,
      'settings.notifications.save',
      'AppSetting',
      undefined,
      value,
    );
    return { ok: true };
  }
}
