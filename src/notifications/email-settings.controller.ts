import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import {
  EMAIL_SETTING_KEY,
  NotificationsService,
} from './notifications.service';

class EmailSettingsDto {
  @IsString()
  host!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  port!: number;

  /** Implicit TLS (465). Leave off for STARTTLS on 587. */
  @IsBoolean()
  secure!: boolean;

  @IsOptional()
  @IsString()
  user?: string;

  /**
   * Omit to keep the stored password. Sending an empty string clears it,
   * for a relay that takes no authentication.
   */
  @IsOptional()
  @IsString()
  pass?: string;

  @IsString()
  from!: string;
}

class TestEmailDto {
  @IsEmail()
  to!: string;
}

/**
 * Mail server configuration, held in the database so an administrator can fix
 * delivery from the console instead of waiting on a redeploy.
 */
@Controller({ path: 'settings/email', version: '1' })
export class EmailSettingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  async read() {
    const settings = await this.notifications.readEmailSettings();
    if (!settings) return { configured: false };
    // The password is never sent back — only whether one is held.
    const { pass, ...rest } = settings;
    return { configured: true, ...rest, hasPassword: !!pass };
  }

  @Put()
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  async save(@CurrentAuth() auth: AuthContext, @Body() body: EmailSettingsDto) {
    const existing = await this.notifications.readEmailSettings();
    const value = {
      host: body.host.trim(),
      port: body.port,
      secure: body.secure,
      user: body.user?.trim() || null,
      // Undefined means "unchanged", so an administrator editing the host does
      // not have to retype a password the form never showed them.
      pass: body.pass === undefined ? (existing?.pass ?? null) : body.pass || null,
      from: body.from.trim(),
    };
    await this.prisma.appSetting.upsert({
      where: { key: EMAIL_SETTING_KEY },
      create: { key: EMAIL_SETTING_KEY, value },
      update: { value },
    });
    this.notifications.invalidateEmailSettings();
    await this.audit.log(auth, 'settings.email.save', 'AppSetting', undefined, {
      host: value.host,
      port: value.port,
      secure: value.secure,
      from: value.from,
      // Deliberately not the password.
      authenticated: !!value.user,
    });
    return { ok: true };
  }

  @Post('test')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  async test(@CurrentAuth() auth: AuthContext, @Body() body: TestEmailDto) {
    const result = await this.notifications.sendTestEmail(body.to);
    await this.audit.log(auth, 'settings.email.test', 'AppSetting', undefined, {
      to: body.to,
      ok: result.ok,
    });
    return result;
  }
}
