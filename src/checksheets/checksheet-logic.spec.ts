import {
  dueState,
  expirySlots,
  shortfalls,
  type ItemShape,
} from './checksheet-logic';

const item = (over: Partial<ItemShape> = {}): ItemShape => ({
  id: 1,
  label: 'Epi 1:1000',
  kind: 'PRESENCE',
  parLevel: null,
  expiryTracking: 'NONE',
  ...over,
});

describe('how many expiry dates an item asks for', () => {
  it('asks for none unless configured', () => {
    expect(expirySlots(item())).toBe(0);
  });

  it('asks for one when the item carries a single date', () => {
    expect(expirySlots(item({ expiryTracking: 'SINGLE' }))).toBe(1);
    // Even on a par item: one date covering the lot is a valid way to run it.
    expect(
      expirySlots(item({ kind: 'PAR', parLevel: 4, expiryTracking: 'SINGLE' })),
    ).toBe(1);
  });

  it('asks for one per unit when each carries its own', () => {
    // Four packs, four dates: they rarely expire together, which is the whole
    // reason for tracking them separately.
    expect(
      expirySlots(
        item({ kind: 'PAR', parLevel: 4, expiryTracking: 'PER_UNIT' }),
      ),
    ).toBe(4);
  });

  it('still asks for one when a par level is missing', () => {
    expect(expirySlots(item({ kind: 'PAR', expiryTracking: 'PER_UNIT' }))).toBe(
      1,
    );
  });
});

describe('what counts as short', () => {
  const items = [
    item({ id: 1, label: 'Suction unit' }),
    item({ id: 2, label: 'Epi 1:1000', kind: 'PAR', parLevel: 4 }),
  ];

  it('finds nothing wrong with a full truck', () => {
    expect(
      shortfalls(items, [
        { itemId: 1, present: true },
        { itemId: 2, countPresent: 4 },
      ]),
    ).toEqual([]);
  });

  it('reports a missing item', () => {
    expect(shortfalls(items, [{ itemId: 1, present: false }])).toEqual([
      {
        itemId: 1,
        detail: 'Suction unit — missing',
        expected: null,
        found: null,
      },
    ]);
  });

  it('reports a count under par, and says how far under', () => {
    expect(shortfalls(items, [{ itemId: 2, countPresent: 1 }])).toEqual([
      { itemId: 2, detail: 'Epi 1:1000 — 1 of 4', expected: 4, found: 1 },
    ]);
  });

  it('treats none present as short rather than as unanswered', () => {
    expect(shortfalls(items, [{ itemId: 2, countPresent: 0 }])).toHaveLength(1);
  });

  it('says nothing about a line nobody filled in', () => {
    // Silence is not a shortage. Inventing one would fill the list with
    // things nobody has actually looked at.
    expect(shortfalls(items, [])).toEqual([]);
    expect(shortfalls(items, [{ itemId: 1 }])).toEqual([]);
  });

  it('does not mind more than par', () => {
    expect(shortfalls(items, [{ itemId: 2, countPresent: 6 }])).toEqual([]);
  });
});

describe('whether a check is due', () => {
  const noon = (day: number) => new Date(Date.UTC(2026, 7, day, 16, 0));

  it('has nothing to say without a cadence', () => {
    expect(dueState('NONE', noon(20), noon(28))).toEqual({
      dueInDays: null,
      overdue: false,
      neverCompleted: false,
    });
  });

  it('counts a daily check done today as not yet due', () => {
    expect(dueState('DAILY', noon(28), noon(28)).dueInDays).toBe(1);
    expect(dueState('DAILY', noon(28), noon(28)).overdue).toBe(false);
  });

  it('calls a daily check overdue the day after', () => {
    expect(dueState('DAILY', noon(27), noon(28)).overdue).toBe(true);
  });

  it('gives a weekly check its week', () => {
    expect(dueState('WEEKLY', noon(24), noon(28)).dueInDays).toBe(3);
    expect(dueState('WEEKLY', noon(20), noon(28)).overdue).toBe(true);
  });

  it('treats never-checked as overdue, not as unknown', () => {
    // A truck nobody has ever checked belongs at the top of the list.
    expect(dueState('DAILY', null, noon(28))).toEqual({
      dueInDays: null,
      overdue: true,
      neverCompleted: true,
    });
  });

  it('leaves a never-checked sheet with no cadence alone', () => {
    expect(dueState('NONE', null, noon(28)).overdue).toBe(false);
  });
});
