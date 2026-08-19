import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../auth/public.decorator';
import { addDays, nyNow } from '../common/dates';
import { whosOnText } from '../crews/whoson';
import { SlackService } from '../notifications/slack.service';
import { PrismaService } from '../prisma/prisma.service';

/** Slack posts commands as form-encoded bodies. */
interface SlashCommand {
  command?: string;
  text?: string;
  user_id?: string;
  response_url?: string;
}

/**
 * Inbound Slack: slash commands and interactive components.
 *
 * Public in the sense that Slack has no session here — the signing secret is
 * the authentication, and every request is verified against the raw body
 * before anything is read out of it.
 */
@Controller({ path: 'slack', version: '1' })
export class SlackController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slack: SlackService,
  ) {}

  private async assertFromSlack(req: Request): Promise<void> {
    // The raw body, kept by the JSON/urlencoded parsers, is what Slack signed;
    // a re-serialized object would not produce the same signature.
    const raw = (req as Request & { rawBody?: Buffer }).rawBody?.toString(
      'utf8',
    );
    if (raw === undefined) {
      throw new BadRequestException('Raw body unavailable');
    }
    const ok = await this.slack.verify(
      raw,
      req.headers['x-slack-request-timestamp'] as string | undefined,
      req.headers['x-slack-signature'] as string | undefined,
    );
    if (!ok) throw new UnauthorizedException('Bad Slack signature');
  }

  /**
   * /whoson — tonight's crew, or a named night.
   *
   * Answers in the channel rather than privately: the usual reason to ask is
   * so that everyone reading along knows too. Accepts "tomorrow" or a plain
   * date, since the question is often asked the night before.
   */
  @Public()
  @Post('commands')
  async command(@Req() req: Request): Promise<unknown> {
    await this.assertFromSlack(req);
    const body = req.body as SlashCommand;
    if ((body.command ?? '').replace('/', '') !== 'whoson') {
      return { response_type: 'ephemeral', text: 'Unknown command.' };
    }

    const asked = (body.text ?? '').trim().toLowerCase();
    const today = nyNow().dateStr;
    const date =
      asked === '' || asked === 'today' || asked === 'tonight'
        ? today
        : asked === 'tomorrow'
          ? addDays(today, 1)
          : /^\d{4}-\d{2}-\d{2}$/.test(asked)
            ? asked
            : null;
    if (!date) {
      return {
        response_type: 'ephemeral',
        text: 'Try `/whoson`, `/whoson tomorrow`, or `/whoson 2026-08-19`.',
      };
    }

    return {
      response_type: 'in_channel',
      text: await whosOnText(this.prisma, date),
    };
  }
}
