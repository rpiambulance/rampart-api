import { Injectable, Logger } from '@nestjs/common';
import type { CalloutKind } from '../generated/prisma/enums';
import { initialAndSurname } from '../common/name';
import { toDbDate } from '../common/dates';
import { HeadsupEvents } from '../headsup/headsup.events';
import { SlackService } from '../notifications/slack.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  MATCH_WINDOW_MINUTES,
  RESPONSE_WINDOW_MINUTES,
  crewNightFor,
  rosterLines,
  shouldAsk,
  withinMatchWindow,
  withinWindow,
  type Responder,
} from './air-logic';

/** What a dispatch looks like to the callout, whoever wrote it down. */
interface DispatchLine {
  id: number;
  determinant: string | null;
  complaint: string | null;
  location: string | null;
  units: string | null;
  receivedAt: Date;
}

const RESPONSES_INCLUDE = {
  responses: {
    orderBy: { at: 'asc' as const },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          preferredFirstName: true,
          lastName: true,
        },
      },
    },
  },
  dispatch: true,
};

/**
 * AIR: who is coming.
 *
 * A page and a dispatch are two signals for one call. The page is fast and
 * carries a single line of text; Herald's dispatch is structured and carries
 * the call. Neither reliably arrives first, so whichever does opens the
 * callout and the other joins it — a page-first callout asks with the line
 * it has and rewrites itself when the detail lands.
 *
 * Slack is where the asking happens, and the message is edited in place as
 * answers arrive rather than answered with a new message each time: a busy
 * call would otherwise bury the channel it is trying to inform.
 */
@Injectable()
export class AirService {
  private readonly logger = new Logger(AirService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slack: SlackService,
    private readonly headsup: HeadsupEvents,
  ) {}

  // --------------------------------------------------------------- signals

  /**
   * A page arrived: the tones dropped and this is all anybody knows yet.
   *
   * Joins the dispatch Herald has already filed if there is one close
   * enough in time, and otherwise stands up a callout of its own for the
   * dispatch to join later.
   */
  async page(text: string, kind: CalloutKind = 'DISPATCH', now = new Date()) {
    const existing = await this.openCalloutNear(now, kind);
    if (existing) {
      if (existing.pageText) return existing; // a repeated page is one call
      const joined = await this.prisma.callout.update({
        where: { id: existing.id },
        data: { pageText: text, pagedAt: now },
        include: RESPONSES_INCLUDE,
      });
      await this.render(joined.id);
      return joined;
    }

    const dispatch = await this.unclaimedDispatchNear(now);
    const callout = await this.open({
      kind,
      now,
      pageText: text,
      pagedAt: now,
      dispatchId: dispatch?.id ?? null,
    });
    await this.render(callout.id);
    return callout;
  }

  /**
   * Herald filed a dispatch. Either it is the call a page already opened, or
   * it is the first anybody here has heard of it.
   */
  async dispatched(dispatch: DispatchLine, now = new Date()) {
    const existing = await this.openCalloutNear(now, 'DISPATCH');
    if (existing && !existing.dispatchId) {
      const joined = await this.prisma.callout.update({
        where: { id: existing.id },
        data: { dispatchId: dispatch.id },
        include: RESPONSES_INCLUDE,
      });
      // The ask went out with one line of pager text; now it can say what
      // the call actually is.
      await this.render(joined.id);
      return joined;
    }
    if (existing) return existing;

    const callout = await this.open({
      kind: 'DISPATCH',
      now,
      pageText: null,
      pagedAt: null,
      dispatchId: dispatch.id,
    });
    await this.render(callout.id);
    return callout;
  }

  // ---------------------------------------------------------------- answers

  /**
   * Somebody pressed a button.
   *
   * Pressing again changes the answer rather than adding to it: a member who
   * says yes and then cannot go has to be able to say so, and two answers
   * from one person is not information.
   */
  async respond(input: {
    calloutId: number;
    slackUserId: string;
    slackName?: string | null;
    responding: boolean;
    now?: Date;
  }): Promise<{ ok: boolean; reason?: string }> {
    const now = input.now ?? new Date();
    const callout = await this.prisma.callout.findUnique({
      where: { id: input.calloutId },
    });
    if (!callout) return { ok: false, reason: 'No such callout' };
    if (!callout.asked) return { ok: false, reason: 'Nobody was asked' };
    if (!withinWindow(callout.closesAt, now)) {
      return {
        ok: false,
        reason:
          'Sorry, your response was logged too long after the dispatch went out.',
      };
    }

    const member = await this.prisma.member.findFirst({
      where: { slackId: input.slackUserId },
      select: { id: true },
    });
    await this.prisma.calloutResponse.upsert({
      where: {
        calloutId_slackUserId: {
          calloutId: callout.id,
          slackUserId: input.slackUserId,
        },
      },
      create: {
        calloutId: callout.id,
        slackUserId: input.slackUserId,
        slackName: input.slackName ?? null,
        memberId: member?.id ?? null,
        responding: input.responding,
      },
      update: {
        responding: input.responding,
        at: now,
        memberId: member?.id ?? null,
        ...(input.slackName ? { slackName: input.slackName } : {}),
      },
    });
    await this.render(callout.id);
    return { ok: true };
  }

  // ----------------------------------------------------------------- reading

  /** One callout with its answers, for the portal and the board. */
  async get(id: number) {
    return this.prisma.callout.findUnique({
      where: { id },
      include: RESPONSES_INCLUDE,
    });
  }

  /** The callouts attached to these dispatches, keyed by dispatch. */
  async forDispatches(dispatchIds: number[]) {
    if (!dispatchIds.length)
      return new Map<number, Awaited<ReturnType<AirService['get']>>>();
    const callouts = await this.prisma.callout.findMany({
      where: { dispatchId: { in: dispatchIds } },
      include: RESPONSES_INCLUDE,
    });
    return new Map(callouts.map((callout) => [callout.dispatchId!, callout]));
  }

  /** What is being asked right now, for the screen in the bay. */
  async live(now = new Date()) {
    return this.prisma.callout.findMany({
      where: { asked: true, closesAt: { gte: now } },
      orderBy: { openedAt: 'desc' },
      include: RESPONSES_INCLUDE,
    });
  }

  // ----------------------------------------------------------------- innards

  private async open(input: {
    kind: CalloutKind;
    now: Date;
    pageText: string | null;
    pagedAt: Date | null;
    dispatchId: number | null;
  }) {
    const crew = await this.crewTonight(input.now);
    const asked = shouldAsk({ kind: input.kind, crew, now: input.now });
    return this.prisma.callout.create({
      data: {
        kind: input.kind,
        openedAt: input.now,
        pageText: input.pageText,
        pagedAt: input.pagedAt,
        dispatchId: input.dispatchId,
        asked,
        closesAt: new Date(
          input.now.getTime() + RESPONSE_WINDOW_MINUTES * 60_000,
        ),
      },
      include: RESPONSES_INCLUDE,
    });
  }

  /** The crew filed under the night in force at this moment. */
  private async crewTonight(now: Date) {
    return this.prisma.crew.findUnique({
      where: { date: toDbDate(crewNightFor(now)) },
      select: {
        outOfService: true,
        slots: { select: { position: true, memberId: true } },
      },
    });
  }

  /** A callout opened close enough in time to be this same call. */
  private async openCalloutNear(now: Date, kind: CalloutKind) {
    const since = new Date(now.getTime() - MATCH_WINDOW_MINUTES * 60_000);
    const recent = await this.prisma.callout.findFirst({
      where: { kind, openedAt: { gte: since } },
      orderBy: { openedAt: 'desc' },
      include: RESPONSES_INCLUDE,
    });
    if (!recent) return null;
    return withinMatchWindow(recent.openedAt, now) ? recent : null;
  }

  /** A dispatch Herald filed that no callout has claimed. */
  private async unclaimedDispatchNear(now: Date) {
    const since = new Date(now.getTime() - MATCH_WINDOW_MINUTES * 60_000);
    return this.prisma.dispatch.findFirst({
      where: { receivedAt: { gte: since }, callout: { is: null } },
      orderBy: { receivedAt: 'desc' },
      select: { id: true },
    });
  }

  // ------------------------------------------------------------------ Slack

  /** What to call somebody on a roster line, member record or not. */
  private nameFor(response: {
    slackName: string | null;
    member: {
      firstName: string;
      preferredFirstName: string | null;
      lastName: string | null;
    } | null;
  }): string {
    if (response.member) return initialAndSurname(response.member);
    return response.slackName?.trim() || 'Somebody';
  }

  /** The headline: what the call is, as well as anybody here knows. */
  private headline(callout: {
    kind: CalloutKind;
    pageText: string | null;
    dispatch: {
      determinant: string | null;
      complaint: string | null;
      location: string | null;
      units: string | null;
    } | null;
  }): string {
    const dispatch = callout.dispatch;
    if (dispatch) {
      const what = [dispatch.determinant, dispatch.complaint]
        .filter(Boolean)
        .join(' ');
      const line = [what || 'Call', dispatch.location]
        .filter(Boolean)
        .join(' — ');
      return dispatch.units ? `${line} (${dispatch.units})` : line;
    }
    return callout.pageText?.trim() || 'RPI Ambulance dispatched';
  }

  private blocksFor(callout: {
    id: number;
    kind: CalloutKind;
    asked: boolean;
    openedAt: Date;
    pageText: string | null;
    dispatch: {
      determinant: string | null;
      complaint: string | null;
      location: string | null;
      units: string | null;
    } | null;
    responses: Array<{
      responding: boolean;
      slackName: string | null;
      member: {
        firstName: string;
        preferredFirstName: string | null;
        lastName: string | null;
      } | null;
    }>;
  }): unknown[] {
    const when = callout.openedAt.toISOString();
    const heading =
      callout.kind === 'LONGTONE'
        ? '*Rensselaer County longtone*'
        : '*RPI Ambulance dispatched*';
    const blocks: unknown[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${heading}\n${this.headline(callout)}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `<!date^${Math.floor(
              new Date(when).getTime() / 1000,
            )}^{date_short_pretty} at {time_secs}|${when}>`,
          },
        ],
      },
    ];

    if (!callout.asked) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text:
              callout.kind === 'LONGTONE'
                ? 'For information. No response is needed.'
                : 'Night crew call. No response is needed.',
          },
        ],
      });
      return blocks;
    }

    const responders: Responder[] = callout.responses.map((response) => ({
      name: this.nameFor(response),
      responding: response.responding,
    }));
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: rosterLines(responders).join('\n') },
    });
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Responding', emoji: true },
          style: 'primary',
          action_id: `air:yes:${callout.id}`,
          value: String(callout.id),
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Not responding', emoji: true },
          action_id: `air:no:${callout.id}`,
          value: String(callout.id),
        },
      ],
    });
    return blocks;
  }

  /**
   * Draws the callout in Slack: posts it the first time, edits it after.
   *
   * Slack is a courtesy here, as everywhere else in this system — a failed
   * post is logged and the callout stands, because the record of who said
   * they were coming is in the database either way.
   */
  private async render(calloutId: number): Promise<void> {
    const callout = await this.prisma.callout.findUnique({
      where: { id: calloutId },
      include: RESPONSES_INCLUDE,
    });
    if (!callout) return;

    const text = `${
      callout.kind === 'LONGTONE'
        ? 'Rensselaer County longtone'
        : 'RPI Ambulance dispatched'
    }: ${this.headline(callout)}`;
    const blocks = this.blocksFor(callout);

    if (callout.slackTs && callout.slackChannel) {
      await this.slack.update(
        callout.slackChannel,
        callout.slackTs,
        text,
        blocks,
      );
    } else {
      const posted = await this.slack.postReturning('dispatches', text, blocks);
      if (posted) {
        await this.prisma.callout.update({
          where: { id: callout.id },
          data: { slackChannel: posted.channel, slackTs: posted.ts },
        });
      } else {
        this.logger.warn(`callout ${callout.id}: nothing posted to Slack`);
      }
    }

    // The screen in the bay fills in as answers land.
    this.headsup.emit({
      kind: 'responders',
      calloutId: callout.id,
      asked: callout.asked,
      headline: this.headline(callout),
      openedAt: callout.openedAt.toISOString(),
      closesAt: callout.closesAt.toISOString(),
      responders: callout.responses.map((response) => ({
        name: this.nameFor(response),
        responding: response.responding,
      })),
    });
  }
}
