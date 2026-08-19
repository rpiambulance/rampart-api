import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  SLACK_CHANNELS,
  SLACK_SETTING_KEY,
  type SlackConfig,
} from './slack-settings';

/**
 * Everything that talks to Slack.
 *
 * Configuration comes from AppSetting first and the environment second, so a
 * deployment configured the old way keeps working and moving to the console
 * is a matter of saving the form once.
 */
@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private cached?: { at: number; config: SlackConfig };

  private static readonly CACHE_MS = 30_000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  invalidate(): void {
    this.cached = undefined;
  }

  async settings(): Promise<SlackConfig> {
    if (this.cached && Date.now() - this.cached.at < SlackService.CACHE_MS) {
      return this.cached.config;
    }
    const row = await this.prisma.appSetting.findUnique({
      where: { key: SLACK_SETTING_KEY },
    });
    const saved = (row?.value as unknown as SlackConfig | undefined) ?? null;

    const channels: Record<string, string | null> = {};
    for (const channel of SLACK_CHANNELS) {
      channels[channel.key] =
        saved?.channels?.[channel.key]?.trim() ||
        this.config.get<string>(channel.envVar) ||
        null;
    }
    const config: SlackConfig = {
      botToken:
        saved?.botToken || this.config.get<string>('SLACK_BOT_TOKEN') || null,
      signingSecret:
        saved?.signingSecret ||
        this.config.get<string>('SLACK_SIGNING_SECRET') ||
        null,
      channels,
    };
    this.cached = { at: Date.now(), config };
    return config;
  }

  /** The channel id configured for a purpose, or null if there isn't one. */
  async channelFor(key: string): Promise<string | null> {
    return (await this.settings()).channels[key] ?? null;
  }

  async isConfigured(): Promise<boolean> {
    return !!(await this.settings()).botToken;
  }

  /**
   * Posts to a configured purpose. Returns false when Slack is not set up or
   * the post failed — callers treat Slack as a courtesy, never as the record.
   */
  async post(
    channelKey: string,
    text: string,
    blocks?: unknown[],
  ): Promise<boolean> {
    const config = await this.settings();
    const channel = config.channels[channelKey];
    if (!config.botToken || !channel) return false;
    return this.postTo(channel, text, blocks);
  }

  async postTo(
    channel: string,
    text: string,
    blocks?: unknown[],
    opts: { retried?: boolean } = {},
  ): Promise<boolean> {
    const { botToken } = await this.settings();
    if (!botToken) return false;
    try {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${botToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ channel, text, ...(blocks ? { blocks } : {}) }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      // The bot is configured for a channel it was never added to. For a
      // public one it can add itself and the message goes out unaided; a
      // private one can only be joined by invitation, so say so plainly
      // rather than logging an error code nobody can act on.
      if (!data.ok && data.error === 'not_in_channel' && !opts.retried) {
        if (await this.joinChannel(channel)) {
          return this.postTo(channel, text, blocks, { retried: true });
        }
        this.logger.error(
          `slack: not in ${channel} and could not join it. If it is private, ` +
            `invite the bot with /invite in that channel.`,
        );
        return false;
      }
      if (!data.ok) {
        this.logger.error(`slack post to ${channel} failed: ${data.error}`);
      }
      return data.ok;
    } catch (error) {
      this.logger.error(`slack post to ${channel} failed: ${String(error)}`);
      return false;
    }
  }

  /**
   * Adds the bot to a public channel.
   *
   * Slack has no equivalent for private channels — a bot cannot let itself
   * in, by design — so this returns false for those and the caller explains
   * what a human has to do.
   */
  private async joinChannel(channel: string): Promise<boolean> {
    const { botToken } = await this.settings();
    if (!botToken) return false;
    try {
      const res = await fetch('https://slack.com/api/conversations.join', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${botToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ channel }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        this.logger.warn(`slack: could not join ${channel}: ${data.error}`);
      }
      return data.ok;
    } catch (error) {
      this.logger.warn(`slack: could not join ${channel}: ${String(error)}`);
      return false;
    }
  }

  /**
   * Whether the bot can actually post to each configured channel.
   *
   * Answered from the workspace rather than guessed, because the usual
   * failure is silent: a channel is set, everything looks configured, and
   * messages vanish into a log line nobody reads.
   */
  async checkChannels(): Promise<
    Array<{ key: string; channel: string; ok: boolean; detail: string }>
  > {
    const config = await this.settings();
    const out: Array<{ key: string; channel: string; ok: boolean; detail: string }> = [];
    if (!config.botToken) return out;

    for (const [key, channel] of Object.entries(config.channels)) {
      if (!channel) continue;
      try {
        const res = await fetch(
          `https://slack.com/api/conversations.info?channel=${encodeURIComponent(channel)}`,
          { headers: { Authorization: `Bearer ${config.botToken}` } },
        );
        const data = (await res.json()) as {
          ok: boolean;
          error?: string;
          channel?: { name?: string; is_private?: boolean; is_member?: boolean };
        };
        if (!data.ok) {
          out.push({
            key,
            channel,
            ok: false,
            detail:
              data.error === 'channel_not_found'
                ? 'No such channel, or the bot cannot see it. A private channel is invisible until the bot is invited.'
                : (data.error ?? 'unknown error'),
          });
          continue;
        }
        const name = data.channel?.name ? `#${data.channel.name}` : channel;
        if (data.channel?.is_member) {
          out.push({ key, channel, ok: true, detail: `In ${name}.` });
        } else if (data.channel?.is_private) {
          out.push({
            key,
            channel,
            ok: false,
            detail: `Not in ${name}. It is private, so a bot cannot add itself — run /invite @yourbot in that channel.`,
          });
        } else {
          out.push({
            key,
            channel,
            ok: false,
            detail: `Not in ${name} yet. It will join on the first message, provided the app has the channels:join scope.`,
          });
        }
      } catch (error) {
        out.push({ key, channel, ok: false, detail: String(error) });
      }
    }
    return out;
  }

  /**
   * Posts and reports back where it landed, so the message can be edited
   * later. Editing in place is what keeps a channel from filling with one
   * line per button press.
   */
  async postReturning(
    channelKey: string,
    text: string,
    blocks?: unknown[],
    opts: { retried?: boolean } = {},
  ): Promise<{ channel: string; ts: string } | null> {
    const config = await this.settings();
    const channel = config.channels[channelKey];
    if (!config.botToken || !channel) return null;
    try {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.botToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ channel, text, ...(blocks ? { blocks } : {}) }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        channel?: string;
        ts?: string;
      };
      if (data.error === 'not_in_channel' && !opts.retried) {
        // Same as postTo: join a public channel and try once more, and say
        // what to do about a private one.
        if (await this.joinChannel(channel)) {
          return this.postReturning(channelKey, text, blocks, { retried: true });
        }
        this.logger.error(
          `slack: not in ${channel} and could not join it. If it is private, ` +
            `invite the bot with /invite in that channel.`,
        );
        return null;
      }
      if (!data.ok || !data.ts || !data.channel) {
        this.logger.error(`slack post to ${channel} failed: ${data.error}`);
        return null;
      }
      return { channel: data.channel, ts: data.ts };
    } catch (error) {
      this.logger.error(`slack post to ${channel} failed: ${String(error)}`);
      return null;
    }
  }

  /** Edits a message already posted. */
  async update(
    channel: string,
    ts: string,
    text: string,
    blocks?: unknown[],
  ): Promise<boolean> {
    const { botToken } = await this.settings();
    if (!botToken) return false;
    try {
      const res = await fetch('https://slack.com/api/chat.update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${botToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          channel,
          ts,
          text,
          ...(blocks ? { blocks } : {}),
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) this.logger.error(`slack update failed: ${data.error}`);
      return data.ok;
    } catch (error) {
      this.logger.error(`slack update failed: ${String(error)}`);
      return false;
    }
  }

  /** Replies to an interaction using the response_url Slack supplied. */
  async respond(responseUrl: string, body: unknown): Promise<void> {
    try {
      await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      this.logger.error(`slack response failed: ${String(error)}`);
    }
  }

  /**
   * Whether a request genuinely came from Slack.
   *
   * Slack signs the raw body with the signing secret; anything unsigned, or
   * older than five minutes, is rejected — the timestamp is what stops a
   * captured request being replayed later.
   */
  async verify(
    rawBody: string,
    timestamp: string | undefined,
    signature: string | undefined,
    now = Date.now(),
  ): Promise<boolean> {
    const { signingSecret } = await this.settings();
    if (!signingSecret || !timestamp || !signature) return false;
    const age = Math.abs(now / 1000 - Number(timestamp));
    if (!Number.isFinite(age) || age > 300) return false;

    const expected =
      'v0=' +
      createHmac('sha256', signingSecret)
        .update(`v0:${timestamp}:${rawBody}`)
        .digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
