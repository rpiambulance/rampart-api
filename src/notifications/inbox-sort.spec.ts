import {
  DEFAULT_INBOX_SORT,
  INBOX_SORT_KEYS,
  isInboxSort,
  orderByFor,
} from './inbox-sort';

/**
 * The inbox order a member has saved.
 *
 * Two things worth pinning. A date order must be only a date order, with
 * nothing sorted ahead of it. And Postgres puts nulls last on an ascending
 * column, which is backwards for readAt — an unread message has none, and
 * those are the rows meant to float.
 */
describe('inbox ordering', () => {
  it('orders purely by arrival when asked for a date order', () => {
    // Nothing ahead of the date. An earlier version sorted completed tasks
    // to the bottom first, which made "newest first" return today, then last
    // week, then yesterday.
    expect(orderByFor('newest')).toEqual([{ createdAt: 'desc' }]);
    expect(orderByFor('oldest')).toEqual([{ createdAt: 'asc' }]);
  });

  it('floats unread to the top under "unread first"', () => {
    expect(orderByFor('unreadFirst')).toEqual([
      { readAt: { sort: 'asc', nulls: 'first' } },
      { createdAt: 'desc' },
    ]);
  });

  it('asks for nulls first, which Postgres does not do by default', () => {
    // An unread message has no readAt, and ascending order would otherwise
    // sink exactly the rows meant to float.
    const [first] = orderByFor('unreadFirst');
    expect(first).toEqual({ readAt: { sort: 'asc', nulls: 'first' } });
  });

  it('falls back rather than failing on a value it does not know', () => {
    // The column is plain text and holds whatever was written to it, this
    // release or two releases ago. An inbox must still open.
    expect(orderByFor('nonsense')).toEqual(orderByFor(DEFAULT_INBOX_SORT));
    expect(orderByFor(null)).toEqual(orderByFor(DEFAULT_INBOX_SORT));
    expect(orderByFor(undefined)).toEqual(orderByFor(DEFAULT_INBOX_SORT));
  });

  it('knows which values it accepts', () => {
    expect(isInboxSort('unreadFirst')).toBe(true);
    expect(isInboxSort('nonsense')).toBe(false);
    expect(isInboxSort(undefined)).toBe(false);
  });

  it('offers every sort it advertises', () => {
    for (const key of INBOX_SORT_KEYS) {
      expect(orderByFor(key).length).toBeGreaterThan(0);
    }
  });
});
