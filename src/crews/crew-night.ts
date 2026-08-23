import { addDays, nyNow } from '../common/dates';

/**
 * A night crew runs 1800 to 0600, so a crew night outlives the calendar date
 * it is filed under. The ICS feed writes the same window.
 */
export const CREW_END_HOUR = 6;

/**
 * The crew night in force at a given moment, as the date its crew is filed
 * under.
 *
 * Before 0600 that is yesterday's date: the people on the road at 0200 signed
 * up for last night, and asking "who is on now" must not answer with the crew
 * that comes on this evening. From 0600 it is today's — for the twelve hours
 * with no crew on the road, the night about to start is the useful answer and
 * the only one anybody could act on.
 */
export function currentCrewNight(now = new Date()): string {
  const { dateStr, minutes } = nyNow(now);
  return minutes < CREW_END_HOUR * 60 ? addDays(dateStr, -1) : dateStr;
}
