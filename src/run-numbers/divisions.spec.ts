import {
  DEFAULT_DIVISIONS,
  ambiguousOptions,
  divisionFor,
  formatRunNumber,
} from './divisions';

describe('run numbers', () => {
  it('formats the way strng did', () => {
    expect(formatRunNumber('DCC', 'S', '25', 1)).toBe('DCC-S25001');
    expect(formatRunNumber('86F', 'F', '26', 142)).toBe('86F-F26142');
  });

  it('picks a term by month', () => {
    expect(divisionFor(DEFAULT_DIVISIONS, 10)).toBe('F'); // November
    expect(divisionFor(DEFAULT_DIVISIONS, 0)).toBe('F'); // January, wrapping
    expect(divisionFor(DEFAULT_DIVISIONS, 4)).toBe('S'); // May
    expect(divisionFor(DEFAULT_DIVISIONS, 7)).toBe('U'); // August
  });

  it('asks at each changeover, offering the outgoing term first', () => {
    // The last month of the outgoing term and the first of the incoming one:
    // a standby in either can belong to either.
    expect(divisionFor(DEFAULT_DIVISIONS, 1)).toBeNull(); // February
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 1)).toEqual(['F', 'S']);
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 2)).toEqual(['F', 'S']); // March
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 5)).toEqual(['S', 'U']); // June
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 6)).toEqual(['S', 'U']); // July
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 8)).toEqual(['U', 'F']); // Sept
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 9)).toEqual(['U', 'F']); // Oct
  });

  it('leaves no month without an answer', () => {
    for (let month = 0; month < 12; month++) {
      const settled = divisionFor(DEFAULT_DIVISIONS, month);
      const asked = ambiguousOptions(DEFAULT_DIVISIONS, month);
      expect(settled ?? asked?.length).toBeTruthy();
    }
  });
});
