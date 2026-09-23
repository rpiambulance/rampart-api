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

/** What somebody who has said they are coming can do on a truck. */
export interface ResponderSkills {
  name: string;
  /** Holds the credential, or one above it. */
  cc: boolean;
  driver: boolean;
  /** Holds only the probationary one, which rides with a trainer. */
  probCC: boolean;
  probDriver: boolean;
  ccTrainer: boolean;
  driverTrainer: boolean;
}

export interface FullCrew {
  cc: ResponderSkills;
  driver: ResponderSkills;
  /** Named only when somebody is riding on a probationary credential. */
  ccTrainer?: ResponderSkills;
  driverTrainer?: ResponderSkills;
}

/**
 * Can the people who have answered take a truck out?
 *
 * A crew chief and a driver, and they cannot be the same person — one
 * drives and one is in the back. Somebody riding on a probationary
 * credential needs the matching trainer to have answered as well, and the
 * trainer is allowed to be the other seat: a probationary crew chief with a
 * CC-T driving is a crew, which is most of how probationary crew chiefs get
 * their hours.
 *
 * Nobody supervises themselves. Beyond that the search is exhaustive rather
 * than clever, because six responders is a big call and the answer has to
 * be right rather than fast: a full crew missed here is a truck that does
 * not roll.
 */
export function fullCrewAmong(
  responders: ResponderSkills[],
  probationaryRequiresTrainer = true,
): FullCrew | null {
  // Whoever holds the credential outright is tried first, so the message
  // names the plainest crew of the several that may be possible.
  const byFull =
    (key: 'cc' | 'driver') => (a: ResponderSkills, b: ResponderSkills) =>
      Number(b[key]) - Number(a[key]);
  const chiefs = responders.filter((r) => r.cc || r.probCC).sort(byFull('cc'));
  const drivers = responders
    .filter((r) => r.driver || r.probDriver)
    .sort(byFull('driver'));

  for (const cc of chiefs) {
    for (const driver of drivers) {
      if (driver === cc) continue;
      const needsCcTrainer = !cc.cc && probationaryRequiresTrainer;
      const needsDriverTrainer = !driver.driver && probationaryRequiresTrainer;
      const ccTrainer = needsCcTrainer
        ? responders.find((r) => r !== cc && r.ccTrainer)
        : undefined;
      const driverTrainer = needsDriverTrainer
        ? responders.find((r) => r !== driver && r.driverTrainer)
        : undefined;
      if (needsCcTrainer && !ccTrainer) continue;
      if (needsDriverTrainer && !driverTrainer) continue;
      return { cc, driver, ccTrainer, driverTrainer };
    }
  }
  return null;
}

/** The line that says a truck can go, or nothing when it cannot. */
export function fullCrewLine(crew: FullCrew | null): string | null {
  if (!crew) return null;
  const seat = (
    person: ResponderSkills,
    full: boolean,
    trainer: ResponderSkills | undefined,
    label: string,
  ) =>
    full || !trainer
      ? `${person.name} (${label})`
      : `${person.name} (probationary ${label}, with ${trainer.name})`;
  return (
    '*Full crew responding* — ' +
    [
      seat(crew.cc, crew.cc.cc, crew.ccTrainer, 'CC'),
      seat(crew.driver, crew.driver.driver, crew.driverTrainer, 'driver'),
    ].join(', ')
  );
}
