/** What the audit log shows, whichever record it came from. */
export type FeedKind = 'DECISION' | 'PAGE' | 'API';

export interface FeedEntry {
  /** Prefixed by source: the two tables number their rows independently. */
  id: string;
  kind: FeedKind;
  at: Date;
  actorType: 'MEMBER' | 'API_TOKEN' | 'SYSTEM';
  actorId: number | null;
  actorName: string;
  action: string;
  entity: string;
  entityId: string | null;
  diff: unknown;
  ip: string | null;
}

/**
 * The newest `limit` entries across both records.
 *
 * Each source is read for its own newest `limit` and merged here, so the
 * result is the true newest overall — taking half from each would drop
 * real entries on any day where one source is busier, which is every day.
 *
 * Ties break on kind then id so the order is total: two rows written in the
 * same millisecond must not swap places between two loads of the page, or
 * paging through the log skips and repeats entries.
 */
export function mergeNewest(
  sources: FeedEntry[][],
  limit: number,
): FeedEntry[] {
  return sources
    .flat()
    .sort((a, b) => {
      const byTime = b.at.getTime() - a.at.getTime();
      if (byTime !== 0) return byTime;
      if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
      return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
    })
    .slice(0, limit);
}

/**
 * A traffic row as a line in the log.
 *
 * The method and path are the action, because "who opened the member
 * directory" and "who changed a credential" are the same question asked of
 * different records, and reading them in one column is the point of merging
 * them at all.
 */
export function describeAccess(row: {
  kind: string;
  method: string;
  path: string;
  status: number | null;
}): { action: string; entity: string } {
  if (row.kind === 'PAGE') {
    return { action: 'page.view', entity: 'Page' };
  }
  return { action: `api.${row.method.toLowerCase()}`, entity: 'Endpoint' };
}
