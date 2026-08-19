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

  it('picks a term by month and asks when either could apply', () => {
    expect(divisionFor(DEFAULT_DIVISIONS, 10)).toBe('F'); // November
    expect(divisionFor(DEFAULT_DIVISIONS, 4)).toBe('S'); // May
    expect(divisionFor(DEFAULT_DIVISIONS, 8)).toBeNull(); // September
    expect(ambiguousOptions(DEFAULT_DIVISIONS, 8)).toEqual(['S', 'F']);
  });
});
