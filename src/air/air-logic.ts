/**
 * The rules AIR runs on, kept apart from Slack and the database so they can
 * be read and tested as rules.
 *
 * AIR — "am I responding" — asks the membership who is coming when a call
 * drops, and shows the answers to everybody. The original decided by the
 * clock: ask between 05:55 and 18:05, and outside that say a night crew has
 * it. The clock was standing in for a question it could not ask.
 */

import { CREW_END_HOUR, currentCrewNight } from '../crews/crew-night';
import { nyNow } from '../common/dates';

/** The hour the night crew comes on, matching the ICS feed and the roster. */
export const CREW_START_HOUR = 18;

/** How long a press still says something useful about who is going. */
export const RESPONSE_WINDOW_MINUTES = 12;

/**
 * How far apart a page and a dispatch may be and still be one call.
 *
 * Neither signal reliably arrives first and both are minutes-scale, so this
 * is generous enough to catch the late one and short enough that two real
 * calls in the same quarter hour are not welded together.
 */
export const MATCH_WINDOW_MINUTES = 10;

export interface CrewSeat {
  position: string;
  memberId: number | null;
}

export interface CrewNight {
  outOfService: boolean;
  slots: CrewSeat[];
}

/**
 * Is an ambulance already crewed and on the road right now?
 *
 * Two seats decide it: a crew chief and a driver. Anything less cannot roll,
 * whatever else is filled, and a call landing on a crew that cannot roll is
 * exactly the call the membership should be asked about.
 *
 * A placeholder in a seat — "CLOSED", and what the legacy import left — is
 * not somebody, so it does not count as filled.
 */
export function crewIsOnTheRoad(
  crew: CrewNight | null,
  now = new Date(),
): boolean {
  const { minutes } = nyNow(now);
  const inCrewHours =
    minutes >= CREW_START_HOUR * 60 || minutes < CREW_END_HOUR * 60;
  if (!inCrewHours) return false;
  if (!crew || crew.outOfService) return false;
  const filled = (position: string) =>
    crew.slots.some((slot) => slot.position === position && slot.memberId);
  return filled('CC') && filled('DRIVER');
}

/** The night whose crew would be on the road at this moment. */
export function crewNightFor(now = new Date()): string {
  return currentCrewNight(now);
}

/**
 * Should this page ask who is responding?
 *
 * A longtone never asks: it is the county's business and ours to know about,
 * not a call to turn out for. Otherwise the membership is asked unless an
 * ambulance is already crewed and out there.
 */
export function shouldAsk(input: {
  kind: 'DISPATCH' | 'LONGTONE';
  crew: CrewNight | null;
  now?: Date;
}): boolean {
  if (input.kind === 'LONGTONE') return false;
  return !crewIsOnTheRoad(input.crew, input.now ?? new Date());
}

/** Whether a press still counts, and is not an answer to yesterday. */
export function withinWindow(closesAt: Date, now = new Date()): boolean {
  return now.getTime() <= closesAt.getTime();
}

/**
 * Whether these two signals are the same call.
 *
 * Time is all there is to go on: a page carries one line of text with no
 * identifier, and Herald's dispatch has no idea a pager exists.
 */
export function withinMatchWindow(
  openedAt: Date,
  arrivedAt: Date,
  minutes = MATCH_WINDOW_MINUTES,
): boolean {
  return Math.abs(arrivedAt.getTime() - openedAt.getTime()) <= minutes * 60_000;
}

export interface Responder {
  name: string;
  responding: boolean;
}

/**
 * The roster line under a callout: who is coming, and who has said no.
 *
 * Both are worth showing. "Not responding" is information — it is the
 * difference between somebody who has seen the page and decided, and the
 * silence of a phone face-down on a desk.
 */
export function rosterLines(responders: Responder[]): string[] {
  const yes = responders.filter((r) => r.responding).map((r) => r.name);
  const no = responders.filter((r) => !r.responding).map((r) => r.name);
  const lines: string[] = [];
  lines.push(
    yes.length
      ? `*Responding (${yes.length}):* ${yes.join(', ')}`
      : '*Responding:* nobody yet',
  );
  if (no.length) lines.push(`*Not responding:* ${no.join(', ')}`);
  return lines;
}
