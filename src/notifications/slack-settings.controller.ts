import { Body, Controller, Get, Put } from '@nestjs/common';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  SLACK_CHANNELS,
  SLACK_SETTING_KEY,
  type SlackConfig,
} from './slack-settings';
import { SlackService } from './slack.service';

class SlackSettingsDto {
  /** Omitted means "leave it as it is"; the form never shows the stored one. */
  @IsOptional()
  @IsString()
  botToken?: string;

  @IsOptional()
  @IsString()
  signingSecret?: string;

  @IsObject()
  channels!: Record<string, string>;
}

@Controller({ path: 'settings/slack', version: '1' })
@RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
export class SlackSettingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slack: SlackService,
    private readonly audit: AuditService,
  ) {}

  /**
   * The channel catalog and what is configured — never the secrets
   * themselves, only whether they are set. A token that can be read back out
   * of the console is a token that leaves in a screenshot.
   */
  @Get()
  async read() {
    const config = await this.slack.settings();
    return {
      channels: SLACK_CHANNELS.map((channel) => ({
        ...channel,
        value: config.channels[channel.key] ?? '',
      })),
      hasBotToken: !!config.botToken,
      hasSigningSecret: !!config.signingSecret,
    };
  }

  /**
   * Whether the bot can actually reach each configured channel.
   *
   * The usual failure is silent — a channel is set, everything looks right,
   * and messages land in a log line nobody reads — so this asks Slack.
   */
  @Get('check')
  check() {
    return this.slack.checkChannels();
  }

  @Put()
  async save(@CurrentAuth() auth: AuthContext, @Body() body: SlackSettingsDto) {
    const existing = (
      await this.prisma.appSetting.findUnique({
        where: { key: SLACK_SETTING_KEY },
      })
    )?.value as unknown as SlackConfig | undefined;

    const channels: Record<string, string | null> = {};
    for (const channel of SLACK_CHANNELS) {
      channels[channel.key] = body.channels[channel.key]?.trim() || null;
    }
    const value: SlackConfig = {
      // Undefined means unchanged, so editing a channel does not require
      // retyping a token the form never showed.
      botToken:
        body.botToken === undefined
          ? (existing?.botToken ?? null)
          : body.botToken || null,
      signingSecret:
        body.signingSecret === undefined
          ? (existing?.signingSecret ?? null)
          : body.signingSecret || null,
      channels,
    };

    // Through `unknown`: a plain `as object` is stripped by the lint rule for
    // unnecessary assertions, which leaves it failing to compile.
    const stored = value as unknown as Prisma.InputJsonObject;
    await this.prisma.appSetting.upsert({
      where: { key: SLACK_SETTING_KEY },
      create: { key: SLACK_SETTING_KEY, value: stored },
      update: { value: stored },
    });
    this.slack.invalidate();
    await this.audit.log(auth, 'settings.slack.save', 'AppSetting', undefined, {
      channels,
      botTokenChanged: body.botToken !== undefined,
      signingSecretChanged: body.signingSecret !== undefined,
    });
    return { ok: true };
  }
}
