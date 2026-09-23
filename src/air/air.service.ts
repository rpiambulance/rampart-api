import { Injectable, Logger } from '@nestjs/common';
import type { CalloutKind } from '../generated/prisma/enums';
import { initialAndSurname } from '../common/name';
import { toDbDate } from '../common/dates';
import { HeadsupEvents } from '../headsup/headsup.events';
import { StorageService } from '../storage/storage.service';
import { SlackService } from '../notifications/slack.service';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { SettingsService } from '../settings/settings.service';
import {
  MATCH_WINDOW_MINUTES,
  RESPONSE_WINDOW_MINUTES,
  crewNightFor,
  fullCrewAmong,
  fullCrewLine,
  rosterLines,
  shouldAsk,
  withinMatchWindow,
  withinWindow,
  type Responder,
  type ResponderSkills,
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

/**
 * How long after a call a recording can still be of it.
 *
 * Longer than the window that joins a page to a dispatch: those two are
 * both struck at the moment the call goes out, while the recording cannot
 * exist until the transmission has finished and the scanner has written the
 * file out.
 */
const AUDIO_MATCH_WINDOW_MINUTES = 20;

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
          credentials: {
            where: { status: 'ACTIVE' as const },
            select: { type: { select: { key: true } } },
          },
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
    private readonly storage: StorageService,
    private readonly graph: CredentialGraphService,
    private readonly settings: SettingsService,
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
    await this.adoptOrphanAudio(callout.id, now);
    await this.render(callout.id);
    return callout;
  }

  /**
   * When the call this dispatch belongs to actually happened.
   *
   * The tones are the call. If a page opened a callout minutes ago, that
   * moment is the time of the call and Herald's arrival is only when the
   * paperwork caught up — so the dispatch is filed under the earlier one,
   * and everything counting or searching by time agrees with the pager.
   *
   * Asked before the dispatch row is written, so nothing has to be
   * corrected afterwards.
   */
  async callTime(now = new Date()): Promise<Date> {
    const open = await this.openCalloutNear(now, 'DISPATCH');
    return open && !open.dispatchId ? open.openedAt : now;
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
        data: { dispatchId: dispatch.id, dispatchAt: now },
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
      dispatchAt: now,
    });
    await this.adoptOrphanAudio(callout.id, now);
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

  // ------------------------------------------------------------------ audio

  /**
   * What the scanner recorded, stored here and handed to Slack.
   *
   * The page goes out when the tones drop and this arrives when the
   * transmission ends, so it is always later — by seconds, or by minutes on
   * a long dispatch. It attaches to the most recent callout within a window
   * wide enough to cover that, and stands on its own when there is none:
   * the recording is worth keeping whether or not anything else about the
   * call reached us.
   */
  async audio(input: {
    body: Buffer;
    filename: string;
    contentType: string;
    now?: Date;
  }) {
    const now = input.now ?? new Date();
    const callout = await this.calloutForAudio(now);
    const key = `callout-audio/${now.toISOString().slice(0, 10)}/${
      callout?.id ?? 'unattached'
    }-${now.getTime()}-${input.filename.replace(/[^\w.-]/g, '_')}`;

    await this.storage.put(key, input.body, input.contentType);
    const stored = await this.prisma.calloutAudio.create({
      data: {
        calloutId: callout?.id ?? null,
        key,
        contentType: input.contentType,
        bytes: input.body.byteLength,
        filename: input.filename,
        receivedAt: now,
      },
    });

    await this.forward(stored.id, input.body);
    return stored;
  }

  /**
   * The call a recording belongs to.
   *
   * The newest callout inside the window, which is the best anybody can do:
   * a recording carries no identifier, only the moment it was written.
   */
  private async calloutForAudio(now: Date) {
    const since = new Date(now.getTime() - AUDIO_MATCH_WINDOW_MINUTES * 60_000);
    return this.prisma.callout.findFirst({
      where: { openedAt: { gte: since, lte: now } },
      orderBy: { openedAt: 'desc' },
      select: { id: true, slackChannel: true, slackTs: true },
    });
  }

  /**
   * A recording that arrived before anything opened a callout.
   *
   * Rare — the page is sent first and the audio written afterwards — but a
   * page that failed to send leaves the recording orphaned, and the next
   * thing to open a callout should pick it up rather than leaving a file
   * attached to nothing.
   */
  private async adoptOrphanAudio(calloutId: number, openedAt: Date) {
    const since = new Date(
      openedAt.getTime() - AUDIO_MATCH_WINDOW_MINUTES * 60_000,
    );
    const orphans = await this.prisma.calloutAudio.findMany({
      where: { calloutId: null, receivedAt: { gte: since, lte: openedAt } },
      select: { id: true },
    });
    if (!orphans.length) return;
    await this.prisma.calloutAudio.updateMany({
      where: { id: { in: orphans.map((orphan) => orphan.id) } },
      data: { calloutId },
    });
  }

  /** Hands a stored recording to Slack, under the call it belongs to. */
  private async forward(audioId: number, body: Buffer) {
    const audio = await this.prisma.calloutAudio.findUnique({
      where: { id: audioId },
      include: { callout: true },
    });
    if (!audio) return;

    const threadTs = audio.callout?.slackTs ?? null;
    const channelKey =
      audio.callout?.slackChannel &&
      audio.callout.slackChannel === (await this.slack.channelId('responding'))
        ? 'responding'
        : 'dispatches';
    const posted = await this.slack.uploadFile({
      channelKey,
      filename: audio.filename ?? `dispatch-${audio.id}.mp3`,
      body,
      title: 'Dispatch audio',
      // Said only when it is arriving on its own, where it would otherwise
      // be a file with no call attached to it.
      comment: threadTs ? undefined : 'Dispatch audio from the scanner.',
      threadTs,
    });
    if (posted) {
      await this.prisma.calloutAudio.update({
        where: { id: audio.id },
        data: {
          slackFileId: posted.fileId,
          slackPermalink: posted.permalink,
        },
      });
    } else {
      this.logger.warn(`callout audio ${audio.id}: not handed to Slack`);
    }
  }

  /** The stored bytes, for playing it back in the portal. */
  async audioFile(id: number) {
    const audio = await this.prisma.calloutAudio.findUnique({ where: { id } });
    if (!audio) return null;
    const object = await this.storage.get(audio.key);
    return { audio, object };
  }

  // ----------------------------------------------------------------- innards

  private async open(input: {
    kind: CalloutKind;
    now: Date;
    pageText: string | null;
    pagedAt: Date | null;
    dispatchId: number | null;
    dispatchAt?: Date | null;
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
        dispatchAt: input.dispatchAt ?? null,
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
  /**
   * What the people coming can do, asked of the credential ladder rather
   * than of the rows they happen to hold: a duty supervisor satisfies the
   * lot whether or not anybody ever wrote the lower ones down.
   *
   * Somebody who pressed the button without a linked member record counts
   * as a body but not as a seat — we know a Slack account is coming and
   * nothing else about them.
   */
  private async skillsOf(
    responses: Array<{
      responding: boolean;
      slackName: string | null;
      member: {
        firstName: string;
        preferredFirstName: string | null;
        lastName: string | null;
        credentials: Array<{ type: { key: string } }>;
      } | null;
    }>,
  ): Promise<ResponderSkills[]> {
    const skills: ResponderSkills[] = [];
    for (const response of responses) {
      if (!response.responding || !response.member) continue;
      const can = await this.graph.keysSatisfiedBy(
        new Set(response.member.credentials.map((c) => c.type.key)),
      );
      skills.push({
        name: this.nameFor(response),
        cc: can.has('CC'),
        driver: can.has('D'),
        probCC: can.has('P_CC') && !can.has('CC'),
        probDriver: can.has('P_D') && !can.has('D'),
        ccTrainer: can.has('CC_T'),
        driverTrainer: can.has('D_T'),
      });
    }
    return skills;
  }

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

  private blocksFor(
    callout: {
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
    },
    crew: string | null,
  ): unknown[] {
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
      text: {
        type: 'mrkdwn',
        // Whether they add up to a truck, under who they are. Absent when
        // they do not, and it goes again if somebody takes their answer
        // back — the message is redrawn from the answers every time, so
        // there is nothing here to keep in step.
        text: [...rosterLines(responders), ...(crew ? [crew] : [])].join('\n'),
      },
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

  /** The same call, stated once for the channel that keeps the record. */
  private mirrorBlocks(callout: {
    kind: CalloutKind;
    pageText: string | null;
    dispatch: {
      determinant: string | null;
      complaint: string | null;
      location: string | null;
      units: string | null;
    } | null;
  }): unknown[] {
    const heading =
      callout.kind === 'LONGTONE'
        ? '*Rensselaer County longtone*'
        : '*RPI Ambulance dispatched*';
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${heading}\n${this.headline(callout)}`,
        },
      },
    ];
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
    const blocks = this.blocksFor(
      callout,
      callout.asked
        ? fullCrewLine(
            fullCrewAmong(
              await this.skillsOf(callout.responses),
              (await this.settings.scheduling()).probationaryRequiresTrainer,
            ),
          )
        : null,
    );

    if (callout.slackTs && callout.slackChannel) {
      await this.slack.update(
        callout.slackChannel,
        callout.slackTs,
        text,
        blocks,
      );
    } else {
      // The asking goes to the channel kept for it, which is how AIR was
      // arranged: one channel people watch when they might turn out, and one
      // that carries every call whether or not anybody is asked. Agencies
      // that want a single channel leave the second unset.
      const asking = (await this.slack.channelId('responding'))
        ? 'responding'
        : 'dispatches';
      const posted = await this.slack.postReturning(asking, text, blocks);
      if (posted) {
        await this.prisma.callout.update({
          where: { id: callout.id },
          data: { slackChannel: posted.channel, slackTs: posted.ts },
        });
      } else {
        this.logger.warn(`callout ${callout.id}: nothing posted to Slack`);
      }
      // A plain copy for the record, when the two are separate channels.
      // Never edited afterwards: it is a log line, not a conversation.
      if (asking === 'responding') {
        await this.slack.post('dispatches', text, this.mirrorBlocks(callout));
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
