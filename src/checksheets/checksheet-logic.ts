import { addDays, nyToday } from '../common/dates';

/** The shape of an item, as much of it as the rules below care about. */
export interface ItemShape {
  id: number;
  label: string;
  kind: 'PRESENCE' | 'PAR';
  parLevel: number | null;
  expiryTracking: 'NONE' | 'SINGLE' | 'PER_UNIT';
}

/** What somebody filled in for one item. */
export interface EntryInput {
  itemId: number;
  present?: boolean;
  countPresent?: number;
  note?: string;
  expiries?: string[];
}

export interface Shortfall {
  itemId: number;
  detail: string;
  expected: number | null;
  found: number | null;
}

/**
 * How many dates an item wants.
 *
 * PER_UNIT on a par of four means four slots, so each pack can carry its own
 * date — which is the point, since they rarely expire together. Anything
 * else that logs dates wants exactly one.
 */
export function expirySlots(item: ItemShape): number {
  if (item.expiryTracking === 'NONE') return 0;
  if (item.expiryTracking === 'SINGLE') return 1;
  return Math.max(1, item.parLevel ?? 1);
}

/**
 * What is short on a completed sheet.
 *
 * An unanswered item is not a shortage — somebody who skipped a line has told
 * us nothing, and inventing a deficiency from silence would fill the list
 * with things nobody has actually looked at.
 */
export function shortfalls(
  items: ItemShape[],
  entries: EntryInput[],
): Shortfall[] {
  const byItem = new Map(entries.map((entry) => [entry.itemId, entry]));
  const out: Shortfall[] = [];

  for (const item of items) {
    const entry = byItem.get(item.id);
    if (!entry) continue;

    if (item.kind === 'PRESENCE') {
      if (entry.present === false) {
        out.push({
          itemId: item.id,
          detail: `${item.label} — missing`,
          expected: null,
          found: null,
        });
      }
      continue;
    }

    const par = item.parLevel ?? 0;
    const found = entry.countPresent;
    if (found === undefined || found === null) continue;
    if (found < par) {
      out.push({
        itemId: item.id,
        detail: `${item.label} — ${found} of ${par}`,
        expected: par,
        found,
      });
    }
  }
  return out;
}

/** Days between two calendar days, positive when `to` is later. */
function daysBetween(from: string, to: string): number {
  const a = Date.UTC(
    Number(from.slice(0, 4)),
    Number(from.slice(5, 7)) - 1,
    Number(from.slice(8, 10)),
  );
  const b = Date.UTC(
    Number(to.slice(0, 4)),
    Number(to.slice(5, 7)) - 1,
    Number(to.slice(8, 10)),
  );
  return Math.round((b - a) / 86_400_000);
}

export const CADENCE_DAYS: Record<string, number | null> = {
  NONE: null,
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
};

export interface DueState {
  /** Null when the template has no cadence, or has never been completed. */
  dueInDays: number | null;
  overdue: boolean;
  neverCompleted: boolean;
}

/**
 * Whether a check is due.
 *
 * A cadence that has never been met reads as overdue rather than as "no
 * information": a truck nobody has ever checked is exactly the one worth
 * showing at the top of the list.
 */
export function dueState(
  cadence: string,
  lastCompletedAt: Date | null,
  now = new Date(),
): DueState {
  const period = CADENCE_DAYS[cadence] ?? null;
  if (period === null) {
    return {
      dueInDays: null,
      overdue: false,
      neverCompleted: !lastCompletedAt,
    };
  }
  if (!lastCompletedAt) {
    return { dueInDays: null, overdue: true, neverCompleted: true };
  }
  const today = nyToday(now).toISOString().slice(0, 10);
  const last = lastCompletedAt.toISOString().slice(0, 10);
  const nextDue = addDays(last, period);
  const dueInDays = daysBetween(today, nextDue);
  return { dueInDays, overdue: dueInDays <= 0, neverCompleted: false };
}
