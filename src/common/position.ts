/**
 * Event positions are free text — schedulers name whatever a given event
 * needs, and the legacy import brought over its own spellings. They are also
 * matched by value: a signup's position has to equal the event position it
 * fills. Store one canonical form so "CC", "cc " and "Cc" are the same
 * position, and let the UI decide how to present it.
 */
export function normalizePosition<T extends string | null | undefined>(
  value: T,
): T {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase().replace(/\s+/g, ' ') as T;
}
