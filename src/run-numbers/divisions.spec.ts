import {
  DEFAULT_DIVISIONS,
  ambiguousOptions,
  divisionFor,
  formatRunNumber,
  windowFor,
  windowKey,
} from './divisions';

describe('run numbers', () => {
  it('formats the way strng did', () => {
    expect(formatRunNumber('DCC', 'S', '25', 1)).toBe('DCC-S25001');
    expect(formatRunNumber('86F', 'F', '26', 142)).toBe('86F-F26142');
  });

  it('picks a term by month', () => {
    expect(divisionFor(DEFAULT_DIVISIONS, 8)).toBe('F'); // September
    expect(divisionFor(DEFAULT_DIVISIONS, 11)).toBe('F'); // December
    expect(divisionFor(DEFAULT_DIVISIONS, 1)).toBe('S'); // February
    expect(divisionFor(DEFAULT_DIVISIONS, 3)).toBe('S'); // April
    expect(divisionFor(DEFAULT_DIVISIONS, 5)).toBe('U'); // June
    expect(divisionFor(DEFAULT_DIVISIONS, 6)).toBe('U'); // July
  });

  it('asks in the single month between each pair of terms', () => {
    // January, May and August: the term ending, then the one beginning.
    expect(divisionFor(DEFAULT_DIVISIONS, 0)).toBeNull();
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 0)).toEqual(['F', 'S']);
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 4)).toEqual(['S', 'U']);
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 7)).toEqual(['U', 'F']);
  });

  it('leaves no month without an answer', () => {
    for (let month = 0; month < 12; month++) {
      const settled = divisionFor(DEFAULT_DIVISIONS, month);
      const asked = ambiguousOptions(DEFAULT_DIVISIONS, month);
      expect(settled ?? asked?.length).toBeTruthy();
    }
  });

  it('names each changeover by its own year', () => {
    const january = windowFor(DEFAULT_DIVISIONS, 0)!;
    expect(windowKey('27', january)).toBe('27-0');
    // The same month a year later is a different changeover, so a decision
    // taken in one does not carry into the next.
    expect(windowKey('28', january)).not.toBe(windowKey('27', january));
    expect(windowFor(DEFAULT_DIVISIONS, 2)).toBeNull(); // March settles itself
  });
});
