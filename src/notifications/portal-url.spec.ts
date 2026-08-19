import { portalUrl } from './notifications.service';

/**
 * Task links are stored relative for the inbox and made absolute on the way
 * out. A bare "/availability" in an email is not a link, just text, so this
 * is the difference between a message somebody can act on and one they
 * cannot.
 */
describe('portalUrl', () => {
  const original = { ...process.env };
  afterEach(() => {
    process.env = { ...original };
  });

  it('puts the configured base in front of a path', () => {
    process.env.WEB_BASE_URL = 'https://members.rpiambulance.com';
    expect(portalUrl('/availability')).toBe(
      'https://members.rpiambulance.com/availability',
    );
  });

  it('does not double the slash when the base carries one', () => {
    process.env.WEB_BASE_URL = 'https://members.rpiambulance.com/';
    expect(portalUrl('/evals/12')).toBe(
      'https://members.rpiambulance.com/evals/12',
    );
  });

  it('falls back to the first allowed origin', () => {
    delete process.env.WEB_BASE_URL;
    process.env.WEB_ORIGIN = 'http://localhost:3000,http://localhost:3002';
    expect(portalUrl('/inbox')).toBe('http://localhost:3000/inbox');
  });

  it('leaves an absolute URL alone', () => {
    process.env.WEB_BASE_URL = 'https://members.rpiambulance.com';
    expect(portalUrl('https://example.org/thing')).toBe(
      'https://example.org/thing',
    );
  });

  it('returns the path unchanged when nothing is configured', () => {
    delete process.env.WEB_BASE_URL;
    delete process.env.WEB_ORIGIN;
    // Worse than a link, better than an empty string followed by a path.
    expect(portalUrl('/training')).toBe('/training');
  });
});
