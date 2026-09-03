import {
  type ItemShape,
  dueState,
  expirySlots,
  sealsNeedingBreak,
  shortfalls,
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

describe('seals that have to be broken', () => {
  const TODAY = '2026-08-30';
  const drugBox = { id: 1, heading: 'Drug box', hasSeal: true };
  const openShelf = { id: 2, heading: 'Shelf', hasSeal: false };
  const inBox = item({
    id: 10,
    sectionId: 1,
    label: 'Epi',
    expiryTracking: 'SINGLE',
  });
  const onShelf = item({
    id: 20,
    sectionId: 2,
    label: 'Gloves',
    expiryTracking: 'SINGLE',
  });

  const check = (
    entries: Parameters<typeof sealsNeedingBreak>[2],
    sections: Parameters<typeof sealsNeedingBreak>[3],
  ) =>
    sealsNeedingBreak(
      [drugBox, openShelf],
      [inBox, onShelf],
      entries,
      sections,
      TODAY,
    ).map((section) => section.heading);

  it('leaves an intact seal alone when nothing inside has expired', () => {
    expect(
      check(
        [{ itemId: 10, present: true, expiries: ['2027-01-01'] }],
        [{ sectionId: 1, sealPresent: true, sealNumber: '12345' }],
      ),
    ).toEqual([]);
  });

  it('demands the seal be broken when something inside has expired', () => {
    expect(
      check(
        [{ itemId: 10, present: true, expiries: ['2026-08-01'] }],
        [{ sectionId: 1, sealPresent: true, sealNumber: '12345' }],
      ),
    ).toEqual(['Drug box']);
  });

  it('is satisfied once the breaking is recorded', () => {
    expect(
      check(
        [{ itemId: 10, present: true, expiries: ['2026-08-01'] }],
        [
          {
            sectionId: 1,
            sealPresent: true,
            sealBroken: true,
            sealNumber: '67890',
          },
        ],
      ),
    ).toEqual([]);
  });

  it('asks nothing of a section found without a seal', () => {
    // Nothing to break. It is already open, which is the state the rule
    // exists to reach.
    expect(
      check(
        [{ itemId: 10, present: true, expiries: ['2026-08-01'] }],
        [{ sectionId: 1, sealPresent: false }],
      ),
    ).toEqual([]);
  });

  it('asks nothing of a section that carries no seal at all', () => {
    expect(
      check([{ itemId: 20, present: true, expiries: ['2026-08-01'] }], []),
    ).toEqual([]);
  });

  it('counts today as still in date', () => {
    // A card is good through the whole of its expiry day, so a seal is not
    // broken over something expiring this evening.
    expect(
      check(
        [{ itemId: 10, present: true, expiries: [TODAY] }],
        [{ sectionId: 1, sealPresent: true }],
      ),
    ).toEqual([]);
  });

  it('ignores an expiry in a different section', () => {
    expect(
      check(
        [{ itemId: 20, present: true, expiries: ['2026-08-01'] }],
        [{ sectionId: 1, sealPresent: true }],
      ),
    ).toEqual([]);
  });

  it('catches one expired date among several in the same item', () => {
    expect(
      check(
        [
          {
            itemId: 10,
            present: true,
            expiries: ['2027-01-01', '2026-08-01', '2027-05-01'],
          },
        ],
        [{ sectionId: 1, sealPresent: true }],
      ),
    ).toEqual(['Drug box']);
  });
});

describe('an expired item is a deficiency, not only a warning', () => {
  const TODAY = new Date('2026-09-03T00:00:00Z');
  const item = (over: Partial<ItemShape> = {}): ItemShape => ({
    id: 1,
    label: 'Epi 0.3mg',
    kind: 'PAR',
    parLevel: 2,
    expiryTracking: 'PER_UNIT',
    ...over,
  });

  it('is short when a date has passed, even at full par', () => {
    const found = shortfalls(
      [item()],
      [{ itemId: 1, countPresent: 2, expiries: ['2026-08-01', '2027-01-01'] }],
      TODAY,
    );
    expect(found).toHaveLength(1);
    expect(found[0].detail).toBe('Epi 0.3mg — expired 2026-08-01');
    // Nothing is missing, so the counts say so.
    expect(found[0]).toMatchObject({ expected: null, found: null });
  });

  // The boundary has to match the expiry report's, or an item shows on one
  // list and not the other for a day.
  it('does not call something dated today expired', () => {
    expect(
      shortfalls(
        [item()],
        [{ itemId: 1, countPresent: 2, expiries: ['2026-09-03'] }],
        TODAY,
      ),
    ).toEqual([]);
  });

  it('leaves a future date alone', () => {
    expect(
      shortfalls(
        [item()],
        [{ itemId: 1, countPresent: 2, expiries: ['2026-12-25'] }],
        TODAY,
      ),
    ).toEqual([]);
  });

  // One job, not two: reconciliation keys deficiencies on the item, so two
  // shortfalls for one item would open a second deficiency for it.
  it('reports an item both under par and out of date once', () => {
    const found = shortfalls(
      [item()],
      [{ itemId: 1, countPresent: 1, expiries: ['2026-08-01'] }],
      TODAY,
    );
    expect(found).toHaveLength(1);
    expect(found[0].detail).toBe('Epi 0.3mg — 1 of 2; expired 2026-08-01');
    // The count is still carried, so the list can show what was expected.
    expect(found[0]).toMatchObject({ expected: 2, found: 1 });
  });

  it('names how many when several units have gone off, earliest first', () => {
    const found = shortfalls(
      [item({ parLevel: 3 })],
      [
        {
          itemId: 1,
          countPresent: 3,
          expiries: ['2026-08-20', '2026-07-04', '2027-05-05'],
        },
      ],
      TODAY,
    );
    expect(found[0].detail).toBe('Epi 0.3mg — 2 expired, earliest 2026-07-04');
  });

  it('counts a missing item that is also out of date as one job', () => {
    const found = shortfalls(
      [item({ kind: 'PRESENCE', parLevel: null })],
      [{ itemId: 1, present: false, expiries: ['2026-08-01'] }],
      TODAY,
    );
    expect(found).toHaveLength(1);
    expect(found[0].detail).toBe('Epi 0.3mg — missing; expired 2026-08-01');
  });

  it('ignores a date it cannot read rather than calling it expired', () => {
    expect(
      shortfalls(
        [item()],
        [{ itemId: 1, countPresent: 2, expiries: ['soon', ''] }],
        TODAY,
      ),
    ).toEqual([]);
  });

  it('still says nothing about an item nobody filled in', () => {
    expect(shortfalls([item()], [], TODAY)).toEqual([]);
  });
});
