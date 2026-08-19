import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../auth/public.decorator';
import { ChoresService } from '../chores/chores.service';
import { addDays, nyNow } from '../common/dates';
import { whosOnText } from '../crews/whoson';
import { SlackLinkService } from '../notifications/slack-link.service';
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
    private readonly chores: ChoresService,
    private readonly links: SlackLinkService,
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
   * Answers only to whoever asked. Checking who is on is a glance, not an
   * announcement, and a channel that fills with the same roster four times an
   * evening trains people to scroll past it.
   *
   * It also means the reply does not depend on the bot being in the channel:
   * an ephemeral response goes back through the command itself, so /whoson
   * works anywhere the app is installed.
   *
   * Accepts "tomorrow" or a plain date, since the question is often asked the
   * night before.
   */
  @Public()
  @Post('commands')
  async command(@Req() req: Request): Promise<unknown> {
    await this.assertFromSlack(req);
    const body = req.body as SlashCommand;
    const command = (body.command ?? '').replace('/', '');

    // Always private: it is about one person's account, and a channel full of
    // "linked to Dev Member" helps nobody.
    if (command === 'linkme') {
      return {
        response_type: 'ephemeral',
        text: body.user_id
          ? await this.links.linkBySlackUser(body.user_id)
          : 'Slack did not say who you are.',
      };
    }

    if (command !== 'whoson') {
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
      response_type: 'ephemeral',
      text: await whosOnText(this.prisma, date),
    };
  }

  /**
   * Button presses. Slack sends these as a `payload` field holding JSON.
   *
   * Answered immediately with 200 and nothing else: Slack gives three seconds
   * before it shows the user an error, and the message is redrawn through the
   * API rather than in this response.
   */
  @Public()
  @Post('interactions')
  async interaction(@Req() req: Request): Promise<void> {
    await this.assertFromSlack(req);
    const raw = (req.body as { payload?: string }).payload;
    if (!raw) return;

    let payload: {
      user?: { id?: string };
      actions?: Array<{ action_id?: string; value?: string }>;
    };
    try {
      payload = JSON.parse(raw) as typeof payload;
    } catch {
      throw new BadRequestException('Unreadable payload');
    }

    for (const action of payload.actions ?? []) {
      const id = action.action_id ?? '';
      if (!id.startsWith('chore:')) continue;
      const occurrenceId = Number(id.slice('chore:'.length));
      if (!Number.isInteger(occurrenceId)) continue;

      // Slack knows the presser by their Slack id; a member who has never
      // been linked still gets the chore marked done, just unattributed —
      // better than refusing the press and leaving the list stale.
      const member = payload.user?.id
        ? await this.prisma.member.findFirst({
            where: { slackId: payload.user.id },
            select: { id: true },
          })
        : null;
      await this.chores.complete(occurrenceId, member?.id ?? null);
    }
  }
}
