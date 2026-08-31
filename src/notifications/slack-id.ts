import { displayName } from '../common/name';
/**
 * Telling a Slack user ID from something that merely names a Slack user.
 *
 * The legacy portal stored handles — "@everest" — and the import copied them
 * into the field this system treats as an ID. A handle in `<@…>` produces
 * `<@@everest>`, which Slack renders as broken punctuation rather than a
 * mention, and is no good as a channel for a direct message either.
 *
 * IDs are U or W followed by uppercase letters and digits: U024BE7LH,
 * W012A3CDE. Nothing else is usable, so nothing else is treated as usable.
 */
export function looksLikeSlackId(value: string | null | undefined): boolean {
  return /^[UW][A-Z0-9]{6,}$/.test((value ?? '').trim());
}

/**
 * How to refer to somebody in a Slack message.
 *
 * A real ID becomes a mention that notifies them. Anything else falls back to
 * their name — a legible line nobody is pinged by beats a broken one that
 * pings nobody either.
 */
export function mentionFor(member: {
  firstName: string;
  lastName: string;
  slackId?: string | null;
}): string {
  return looksLikeSlackId(member.slackId)
    ? `<@${member.slackId!.trim()}>`
    : displayName(member);
}
