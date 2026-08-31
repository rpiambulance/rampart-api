import { describeAccess, mergeNewest, type FeedEntry } from './audit-feed';

const entry = (
  id: string,
  at: string,
  kind: FeedEntry['kind'] = 'DECISION',
): FeedEntry => ({
  id,
  kind,
  at: new Date(at),
  actorType: 'MEMBER',
  actorId: 1,
  actorName: 'Alex Rivera',
  action: 'x',
  entity: 'Thing',
  entityId: null,
  diff: null,
  ip: null,
});

describe('merging the two records into one log', () => {
  it('is in time order regardless of which record an entry came from', () => {
    const decisions = [entry('a:3', '2026-08-31T12:00:00Z')];
    const traffic = [
      entry('b:2', '2026-08-31T12:00:30Z', 'PAGE'),
      entry('b:1', '2026-08-31T11:59:00Z', 'API'),
    ];
    expect(mergeNewest([decisions, traffic], 10).map((e) => e.id)).toEqual([
      'b:2',
      'a:3',
      'b:1',
    ]);
  });

  // Taking half from each source would drop real entries on any day where
  // one is busier than the other — which is every day.
  it('keeps the newest overall, not a share from each record', () => {
    const decisions = [entry('a:1', '2026-08-31T09:00:00Z')];
    const traffic = Array.from({ length: 5 }, (_, i) =>
      entry(`b:${i}`, `2026-08-31T1${i}:00:00Z`, 'API'),
    );
    const merged = mergeNewest([decisions, traffic], 3);
    expect(merged.map((e) => e.id)).toEqual(['b:4', 'b:3', 'b:2']);
  });

  // Two rows in the same millisecond must not swap between loads, or paging
  // through the log skips some entries and repeats others.
  it('orders entries written in the same instant the same way every time', () => {
    const same = '2026-08-31T12:00:00Z';
    const a = [entry('a:2', same), entry('a:1', same)];
    const b = [entry('b:9', same, 'API')];
    const once = mergeNewest([a, b], 10).map((e) => e.id);
    const again = mergeNewest([b, a], 10).map((e) => e.id);
    expect(once).toEqual(again);
  });

  it('takes nothing when there is nothing', () => {
    expect(mergeNewest([[], []], 10)).toEqual([]);
  });
});

describe('describing a traffic row', () => {
  it('calls a page load what it is', () => {
    expect(
      describeAccess({
        kind: 'PAGE',
        method: 'GET',
        path: '/members',
        status: 200,
      }),
    ).toEqual({ action: 'page.view', entity: 'Page' });
  });

  it('names the method for an API call', () => {
    expect(
      describeAccess({
        kind: 'API',
        method: 'POST',
        path: '/v1/x',
        status: 201,
      }),
    ).toEqual({ action: 'api.post', entity: 'Endpoint' });
  });
});
