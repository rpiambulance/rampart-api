/**
 * The comparable form of an email address.
 *
 * Addresses are stored as typed but matched in lower case: a member record
 * created as `Jane.Doe@rpiambulance.com` and a login whose verified email
 * arrives as `jane.doe@rpiambulance.com` are the same person, and an exact
 * comparison between them quietly fails to link the two — which surfaces as
 * the member being told they have no account here.
 */
export function normalizeEmail(email: string): string;
export function normalizeEmail(email: undefined): undefined;
export function normalizeEmail(email: string | undefined): string | undefined;
export function normalizeEmail(email: string | undefined): string | undefined {
  return email === undefined ? undefined : email.trim().toLowerCase();
}
