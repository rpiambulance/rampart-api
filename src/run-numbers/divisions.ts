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
 * The three academic terms, as strng was configured in production: fall from
 * October, spring from March, summer from July.
 *
 * Each ambiguous window spans a changeover — the last month of the outgoing
 * term and the first of the incoming one — because a standby in those months
 * can belong to either depending on what it is for.
 */
export const DEFAULT_DIVISIONS: DivisionConfig = {
  divisions: [
    { abbr: 'F', start: 9, end: 1 },
    { abbr: 'S', start: 2, end: 5 },
    { abbr: 'U', start: 6, end: 8 },
  ],
  ambiguous: [
    { start: 1, end: 2, options: ['F', 'S'] },
    { start: 5, end: 6, options: ['S', 'U'] },
    { start: 8, end: 9, options: ['U', 'F'] },
  ],
};

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
