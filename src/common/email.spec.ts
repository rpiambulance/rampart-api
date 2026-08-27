import { normalizeEmail } from './email';

/**
 * A login is matched to a member record by email. The two only meet if both
 * sides are written the same way, and the side an officer types by hand is
 * the one that varies.
 */
describe('normalizeEmail', () => {
  it('lower-cases, so a typed capital cannot orphan an account', () => {
    expect(normalizeEmail('Jane.Doe@RPIAmbulance.com')).toBe(
      'jane.doe@rpiambulance.com',
    );
  });

  it('trims, so a pasted address with a trailing space still matches', () => {
    expect(normalizeEmail('  jane@rpiambulance.com \n')).toBe(
      'jane@rpiambulance.com',
    );
  });

  it('leaves an already-clean address alone', () => {
    expect(normalizeEmail('jane@rpiambulance.com')).toBe(
      'jane@rpiambulance.com',
    );
  });

  it('passes undefined through, so "leave this field alone" survives', () => {
    // members.update spreads its input: turning undefined into '' here would
    // blank the email of every member edited for any other reason.
    expect(normalizeEmail(undefined)).toBeUndefined();
  });
});
