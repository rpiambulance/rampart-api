/** Anything carrying a member's name, however much of one the caller selected. */
export interface Named {
  firstName: string;
  /** What they go by. Optional so a narrow `select` still satisfies this. */
  preferredFirstName?: string | null;
  lastName?: string | null;
}

/**
 * What to call somebody.
 *
 * Preferred name wherever there is one. This is the name that goes into
 * Slack posts, emails and inbox subjects — the places a person reads about
 * themselves — so a member who has said they go by Alex is not addressed as
 * Daniel by the portal every morning.
 *
 * Deliberately not used for the roster record or the profile form, where the
 * legal name is the subject rather than a way of addressing somebody.
 */
export function firstNameOf(person: Named): string {
  return person.preferredFirstName?.trim() || person.firstName;
}

/** "Alex Rivera" — the usual way a name appears in a sentence. */
export function displayName(person: Named): string {
  return [firstNameOf(person), person.lastName].filter(Boolean).join(' ');
}

/** "A. Rivera" — the crew board, where width is short. */
export function initialAndSurname(person: Named): string {
  return `${firstNameOf(person).charAt(0)}. ${person.lastName ?? ''}`.trim();
}
