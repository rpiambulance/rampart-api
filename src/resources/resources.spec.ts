import { BadRequestException } from '@nestjs/common';
import { cleanUrl } from './resources.controller';

/**
 * Links are typed by one member and clicked by another, which is what makes
 * the scheme worth checking: a `javascript:` URL saved here would run in the
 * clicker's session, not the author's.
 */
describe('resource links', () => {
  it('keeps an ordinary link', () => {
    expect(cleanUrl('https://rpiambulance.com/protocols')).toBe(
      'https://rpiambulance.com/protocols',
    );
  });

  it('assumes https for what people actually type', () => {
    expect(cleanUrl('rpiambulance.com')).toBe('https://rpiambulance.com/');
    expect(cleanUrl('  docs.google.com/spreadsheets/d/abc  ')).toBe(
      'https://docs.google.com/spreadsheets/d/abc',
    );
  });

  it('allows plain http, which some county systems still are', () => {
    expect(cleanUrl('http://intranet.local/radio-plan')).toBe(
      'http://intranet.local/radio-plan',
    );
  });

  it('refuses a script URL', () => {
    // The whole reason this function exists.
    expect(() => cleanUrl('javascript:alert(document.cookie)')).toThrow(
      BadRequestException,
    );
    expect(() => cleanUrl('JavaScript:alert(1)')).toThrow(BadRequestException);
  });

  it('refuses data and file URLs', () => {
    expect(() => cleanUrl('data:text/html,<script>alert(1)</script>')).toThrow(
      BadRequestException,
    );
    expect(() => cleanUrl('file:///etc/passwd')).toThrow(BadRequestException);
  });

  it('refuses something that is not an address at all', () => {
    expect(() => cleanUrl('   ')).toThrow(BadRequestException);
  });
});
