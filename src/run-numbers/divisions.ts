/**
 * How a run number's division letter is chosen, ported from strng's config.
 *
 * A division covers a run of months and can wrap the year end, which is why
 * "fall" is months 9–1 rather than a simple range. The overlaps between them
 * are deliberately ambiguous: at the turn of a term either letter may be
 * right depending on what the standby is for, so those months ask rather than
 * guess.
 */
export const DIVISION_SETTING_KEY = 'runNumbers.divisions';

export interface MonthDivision {
  abbr: string;
  /** 0 = January. Inclusive, and wraps when start > end. */
  start: number;
  end: number;
}

export interface AmbiguousMonths {
  start: number;
  end: number;
  /** The letters offered, best guess first. */
  options: string[];
}

export interface DivisionConfig {
  divisions: MonthDivision[];
  ambiguous: AmbiguousMonths[];
}

/**
 * The three academic terms, and the single month between each pair.
 *
 * September through December is fall, February through April spring, June and
 * July summer. The month either side of each pair — January, May, August — is
 * a changeover: a standby then can belong to the term ending or the one
 * beginning, so it is asked rather than assumed, outgoing term first.
 */
export const DEFAULT_DIVISIONS: DivisionConfig = {
  divisions: [
    { abbr: 'F', start: 8, end: 11 },
    { abbr: 'S', start: 1, end: 3 },
    { abbr: 'U', start: 5, end: 6 },
  ],
  ambiguous: [
    { start: 0, end: 0, options: ['F', 'S'] },
    { start: 4, end: 4, options: ['S', 'U'] },
    { start: 7, end: 7, options: ['U', 'F'] },
  ],
};

/**
 * Once somebody says the new term has started, it has.
 *
 * A changeover month is only genuinely open until the first person decides
 * it. Choosing the outgoing term is not a decision — it says "this one still
 * belongs to the term that is ending" and leaves the question open for the
 * next person. Choosing the incoming term is: the term has turned over, and
 * everyone after that gets it without being asked.
 */
export interface TermLatch {
  division: string;
  /** The changeover this was decided in; a later one starts open again. */
  window: string;
}

export const TERM_LATCH_KEY = 'runNumbers.termLatch';

export function monthBetween(
  month: number,
  start: number,
  end: number,
): boolean {
  return start <= end
    ? month >= start && month <= end
    : month >= start || month <= end;
}

/** The division for a month, or null when the month is one of the ambiguous ones. */
export function divisionFor(
  config: DivisionConfig,
  month: number,
): string | null {
  if (ambiguousOptions(config, month)) return null;
  for (const division of config.divisions) {
    if (monthBetween(month, division.start, division.end)) return division.abbr;
  }
  return null;
}

/** The changeover a month falls in, or null outside one. */
export function windowFor(
  config: DivisionConfig,
  month: number,
): AmbiguousMonths | null {
  for (const window of config.ambiguous) {
    if (monthBetween(month, window.start, window.end)) return window;
  }
  return null;
}

/**
 * Names one occurrence of a changeover, so a decision made in January 2027
 * does not carry into January 2028.
 *
 * Keyed on the window's first month rather than the current one, so a window
 * spanning two months stays one decision. A window that wrapped a year end
 * would start over at New Year, which none of them do.
 */
export function windowKey(year: string, window: AmbiguousMonths): string {
  return `${year}-${window.start}`;
}

export function ambiguousOptions(
  config: DivisionConfig,
  month: number,
): string[] | null {
  for (const window of config.ambiguous) {
    if (monthBetween(month, window.start, window.end)) return window.options;
  }
  return null;
}

/** `DCC-S25001` — location, division letter, two-digit year, three-digit run. */
export function formatRunNumber(
  abbr: string,
  division: string,
  year: string,
  sequence: number,
): string {
  return `${abbr}-${division}${year}${String(sequence).padStart(3, '0')}`;
}
