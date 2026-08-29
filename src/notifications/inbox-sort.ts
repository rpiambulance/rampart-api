import type { Prisma } from '../generated/prisma/client';

/**
 * How a member's inbox is ordered, as a saved preference.
 *
 * Outstanding tasks come before completed ones in every order here: a done
 * task is a receipt, and a list that mixes the two by date buries the thing
 * you came to do. The choice below is what happens within that.
 */
export const INBOX_SORTS = {
  unreadFirst: 'Unread first',
  newest: 'Date received, newest first',
  oldest: 'Date received, oldest first',
} as const;

export type InboxSort = keyof typeof INBOX_SORTS;

export const INBOX_SORT_KEYS = Object.keys(INBOX_SORTS) as InboxSort[];

export const DEFAULT_INBOX_SORT: InboxSort = 'unreadFirst';

export function isInboxSort(value: unknown): value is InboxSort {
  return typeof value === 'string' && value in INBOX_SORTS;
}

/**
 * Postgres sorts nulls last on an ascending column, which is backwards for
 * the column that matters here: an unread message has a null readAt, and
 * those are the ones that belong at the top. Prisma spells that out per
 * field.
 *
 * A date order is only a date order. An earlier version put completed tasks
 * below everything else in every sort, on the theory that a finished task is
 * a receipt — which made "date received, newest first" return today, then
 * last week, then yesterday, and read as simply broken. Someone who wants
 * outstanding work grouped has "unread first" and the To do filter; someone
 * who asks for date order means date order.
 */
export function orderByFor(
  sort: string | null | undefined,
): Prisma.InboxMessageOrderByWithRelationInput[] {
  const chosen = isInboxSort(sort) ? sort : DEFAULT_INBOX_SORT;
  if (chosen === 'unreadFirst') {
    return [{ readAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'desc' }];
  }
  return [{ createdAt: chosen === 'oldest' ? 'asc' : 'desc' }];
}
