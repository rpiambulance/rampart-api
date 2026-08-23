import { redactSecrets } from './request-context.middleware';

/**
 * The access log stores the whole URL. Anything a caller could only send in
 * the query string — the DiALERT token — would otherwise be written in the
 * clear, on every call, into a table the console shows on request.
 */
describe('redacting secrets from a logged path', () => {
  it('keeps the endpoint and drops the token', () => {
    expect(redactSecrets('/v1/dialert/duty-supervisor?token=s3cret')).toBe(
      '/v1/dialert/duty-supervisor?token=REDACTED',
    );
  });

  it('leaves everything else alone', () => {
    expect(redactSecrets('/v1/crews?week=2026-08-16')).toBe(
      '/v1/crews?week=2026-08-16',
    );
    expect(redactSecrets('/v1/members/12')).toBe('/v1/members/12');
  });

  it('does not stop at the first one, or eat the parameters after it', () => {
    expect(redactSecrets('/x?a=1&token=s3cret&b=2&api_key=other')).toBe(
      '/x?a=1&token=REDACTED&b=2&api_key=REDACTED',
    );
  });

  it('is not fooled by capitals or an empty value', () => {
    expect(redactSecrets('/x?Token=s3cret')).toBe('/x?Token=REDACTED');
    expect(redactSecrets('/x?token=')).toBe('/x?token=REDACTED');
  });

  it('leaves a parameter that merely ends in the word alone', () => {
    // `ics_token` is a path segment elsewhere, but a query name that only
    // ends in "token" is not one of ours and should not be quietly rewritten.
    expect(redactSecrets('/x?not_token=keep')).toBe('/x?not_token=keep');
  });
});
