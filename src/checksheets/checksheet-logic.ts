import { addDays, nyToday } from '../common/dates';

/** The shape of an item, as much of it as the rules below care about. */
export interface ItemShape {
  id: number;
  /** Null for an item loose at the top of the sheet. */
  sectionId?: number | null;
  label: string;
  kind: 'PRESENCE' | 'PAR';
  parLevel: number | null;
  expiryTracking: 'NONE' | 'SINGLE' | 'PER_UNIT';
}

/** The seal a section carries, as configured. */
export interface SectionShape {
  id: number;
  heading: string;
  hasSeal: boolean;
}

/** What somebody reported about one sealed section. */
export interface SectionEntryInput {
  sectionId: number;
  sealPresent?: boolean;
  sealNumber?: string;
  sealBroken?: boolean;
  note?: string;
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

/**
 * Sections whose seal has to be broken before the sheet can be filed.
 *
 * A sealed section is checked by reading the number rather than opening it —
 * which is only honest while everything inside is in date. The moment
 * something in there has expired, the seal is a claim that the contents are
 * good, and it is not: somebody has to open it, deal with the item, and seal
 * it again.
 *
 * Only when there is a seal to break. A section found unsealed is already
 * open, and one configured without seals was never making the claim.
 */
export function sealsNeedingBreak(
  sections: SectionShape[],
  items: ItemShape[],
  entries: EntryInput[],
  sectionEntries: SectionEntryInput[],
  today: string,
): SectionShape[] {
  const byId = new Map(entries.map((entry) => [entry.itemId, entry]));
  const reported = new Map(
    sectionEntries.map((entry) => [entry.sectionId, entry]),
  );

  return sections.filter((section) => {
    if (!section.hasSeal) return false;
    const seal = reported.get(section.id);
    if (!seal?.sealPresent) return false;
    if (seal.sealBroken) return false;

    return items.some((item) => {
      if (item.sectionId !== section.id) return false;
      const entry = byId.get(item.id);
      if (!entry?.expiries?.length) return false;
      // Expired means the date has passed. A card is good through the whole
      // of its expiry day, so equality is not yet expiry.
      return entry.expiries.some((date) => date && date < today);
    });
  });
}
