import { isDateOnly, nyDayEnd, nyDayStart, nyToday, toDbDate } from './dates';

/**
 * The day-boundary helpers, which decide what "on the 17th" means for every
 * date filter in the API. They are pure, so unlike the rest of the suite these
 * need no database.
 */
describe('New York day boundaries', () => {
  it('starts a summer day at 04:00 UTC and a winter day at 05:00', () => {
    // EDT is UTC-4, EST is UTC-5. Getting this wrong shifts every filter by an
    // hour for part of the year, which is the failure that hides longest.
    expect(nyDayStart('2026-08-17').toISOString()).toBe(
      '2026-08-17T04:00:00.000Z',
    );
    expect(nyDayStart('2026-01-17').toISOString()).toBe(
      '2026-01-17T05:00:00.000Z',
    );
  });

  it('ends a day where the next one begins', () => {
    expect(nyDayEnd('2026-08-17').toISOString()).toBe(
      '2026-08-18T04:00:00.000Z',
    );
    // The bound is exclusive, so it must not be a moment short of midnight:
    // a dispatch at 23:59:59.7 belongs to the 17th.
    const lastMoment = new Date('2026-08-18T03:59:59.700Z');
    expect(lastMoment < nyDayEnd('2026-08-17')).toBe(true);
    expect(lastMoment >= nyDayStart('2026-08-17')).toBe(true);
  });

  it('crosses the DST boundaries without losing or gaining a day', () => {
    // 2026: forward on 8 March, back on 1 November.
    expect(nyDayStart('2026-03-08').toISOString()).toBe(
      '2026-03-08T05:00:00.000Z',
    );
    expect(nyDayEnd('2026-03-08').toISOString()).toBe(
      '2026-03-09T04:00:00.000Z',
    );
    expect(nyDayStart('2026-11-01').toISOString()).toBe(
      '2026-11-01T04:00:00.000Z',
    );
    expect(nyDayEnd('2026-11-01').toISOString()).toBe(
      '2026-11-02T05:00:00.000Z',
    );
  });

  it('puts a late New York evening on the day it is locally', () => {
    // 21:00 on the 17th in New York is already the 18th in UTC. Anything
    // deriving today's date from the instant flips over four hours early.
    const lateEvening = new Date('2026-08-18T01:00:00.000Z');
    expect(nyToday(lateEvening)).toEqual(toDbDate('2026-08-17'));
  });

  it('treats a New York day as containing its own evening', () => {
    const start = nyDayStart('2026-08-17');
    const end = nyDayEnd('2026-08-17');
    const at2300Local = new Date('2026-08-18T03:00:00.000Z');
    expect(at2300Local >= start && at2300Local < end).toBe(true);

    // ...and not the previous evening, which UTC boundaries would swallow.
    const previousEvening = new Date('2026-08-17T03:00:00.000Z');
    expect(previousEvening >= start).toBe(false);
  });

  it('is the day to stamp a date-only column with', () => {
    // Writing `new Date()` into a date-only column stores the UTC date, which
    // for the last four hours of every New York evening is tomorrow. A role
    // starting "today" then confers nothing until tomorrow, and a
    // certification issued "today" is dated a day late.
    const lateEvening = new Date('2026-08-21T01:07:00.000Z'); // 21:07 on the 20th
    expect(nyToday(lateEvening)).toEqual(toDbDate('2026-08-20'));
    expect(nyToday(lateEvening).toISOString().slice(0, 10)).not.toBe(
      lateEvening.toISOString().slice(0, 10),
    );
  });

  it('tells a plain date from an instant', () => {
    expect(isDateOnly('2026-08-17')).toBe(true);
    expect(isDateOnly('2026-08-17T18:00:00.000Z')).toBe(false);
    expect(isDateOnly('')).toBe(false);
  });
});
