import {
  DEFAULT_INBOX_SORT,
  INBOX_SORT_KEYS,
  isInboxSort,
  orderByFor,
} from './inbox-sort';

/**
 * The inbox order a member has saved.
 *
 * The part worth pinning is the nulls. Postgres puts them last on an
 * ascending column, and both columns that decide this order use null to mean
 * "still needs you" — an unread message has no readAt, an outstanding task no
 * completedAt — so the default would sink exactly the rows meant to float.
 */
describe('inbox ordering', () => {
  it('puts outstanding tasks above completed ones, whatever the sort', () => {
    for (const sort of INBOX_SORT_KEYS) {
      expect(orderByFor(sort)[0]).toEqual({
        completedAt: { sort: 'asc', nulls: 'first' },
      });
    }
  });

  it('floats unread to the top under "unread first"', () => {
    expect(orderByFor('unreadFirst')).toEqual([
      { completedAt: { sort: 'asc', nulls: 'first' } },
      { readAt: { sort: 'asc', nulls: 'first' } },
      { createdAt: 'desc' },
    ]);
  });

  it('orders purely by arrival when asked to', () => {
    expect(orderByFor('newest')).toEqual([
      { completedAt: { sort: 'asc', nulls: 'first' } },
      { createdAt: 'desc' },
    ]);
    expect(orderByFor('oldest')).toEqual([
      { completedAt: { sort: 'asc', nulls: 'first' } },
      { createdAt: 'asc' },
    ]);
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
});
