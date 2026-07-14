/**
 * Date helpers. All scheduling logic runs in the agency's timezone
 * (America/New_York), on plain YYYY-MM-DD date strings.
 */
export const AGENCY_TZ = 'America/New_York';

export interface NyNow {
  dateStr: string; // YYYY-MM-DD
  weekday: number; // 0 = Sunday
  minutes: number; // minutes since local midnight
}

export function nyNow(now = new Date()): NyNow {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: AGENCY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const dateStr = `${parts.year}-${parts.month}-${parts.day}`;
  const hour = Number(parts.hour) % 24; // 'h23' can still yield "24" on some ICU versions
  return {
    dateStr,
    weekday: weekdayOf(dateStr),
    minutes: hour * 60 + Number(parts.minute),
  };
}

export function weekdayOf(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Sunday of the week containing dateStr. */
export function startOfWeek(dateStr: string): string {
  return addDays(dateStr, -weekdayOf(dateStr));
}

export function parseHm(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** dateStr as a Date for Prisma @db.Date columns (UTC midnight). */
export function toDbDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`);
}

export function fromDbDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Compare "now" against a local deadline of (dateStr - daysBefore) at `time`. */
export function isBeforeDeadline(
  now: NyNow,
  dateStr: string,
  daysBefore: number,
  time: string,
): boolean {
  const deadlineDate = addDays(dateStr, -daysBefore);
  if (now.dateStr < deadlineDate) return true;
  if (now.dateStr > deadlineDate) return false;
  return now.minutes <= parseHm(time);
}

export function ageInYears(dob: Date, onDate: string): number {
  const birth = fromDbDate(dob);
  const [by, bm, bd] = birth.split('-').map(Number);
  const [y, m, d] = onDate.split('-').map(Number);
  let age = y - by;
  if (m < bm || (m === bm && d < bd)) age -= 1;
  return age;
}
