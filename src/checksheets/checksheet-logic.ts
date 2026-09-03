import { addDays, isDateOnly, nyToday, toDbDate } from '../common/dates';

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
 *
 * A date already past counts too. An expired pack is not a warning about a
 * future problem, it is a thing that has to be replaced before the next call,
 * which is exactly what the deficiency list is for. It stays on the expiry
 * report as well: the two answer different questions — what needs doing, and
 * what is coming — and something overdue is the honest answer to both.
 *
 * One entry per item however many ways it is short, so an item both under par
 * and out of date reads as one job rather than two, and reconciliation cannot
 * open a second deficiency for something it has already opened one for.
 */
export function shortfalls(
  items: ItemShape[],
  entries: EntryInput[],
  today: Date = nyToday(),
): Shortfall[] {
  const byItem = new Map(entries.map((entry) => [entry.itemId, entry]));
  const out: Shortfall[] = [];

  for (const item of items) {
    const entry = byItem.get(item.id);
    if (!entry) continue;

    const reasons: string[] = [];
    let expected: number | null = null;
    let found: number | null = null;

    if (item.kind === 'PRESENCE') {
      if (entry.present === false) reasons.push('missing');
    } else {
      const par = item.parLevel ?? 0;
      const counted = entry.countPresent;
      if (counted !== undefined && counted !== null && counted < par) {
        reasons.push(`${counted} of ${par}`);
        expected = par;
        found = counted;
      }
    }

    // Same boundary the expiry report uses: something dated today has not
    // expired yet. The two lists must agree about what "expired" means, or
    // an item appears on one and not the other for a day.
    const expired = (entry.expiries ?? [])
      .filter((date) => isDateOnly(date) && toDbDate(date) < today)
      .sort();
    if (expired.length === 1) {
      reasons.push(`expired ${expired[0]}`);
    } else if (expired.length > 1) {
      reasons.push(`${expired.length} expired, earliest ${expired[0]}`);
    }

    if (reasons.length) {
      out.push({
        itemId: item.id,
        detail: `${item.label} — ${reasons.join('; ')}`,
        expected,
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
