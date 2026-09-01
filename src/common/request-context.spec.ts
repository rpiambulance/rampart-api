import { CLIENT_IP_HEADER, clientIp } from './request-context';
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

describe('whose address is in the log', () => {
  const asRequest = (
    headers: Record<string, string | string[]>,
    ip?: string,
    socket?: string,
  ) =>
    ({
      headers,
      ip,
      socket: { remoteAddress: socket },
    }) as unknown as Parameters<typeof clientIp>[0];

  it('uses the address Express resolved, now that it skips the proxies', () => {
    expect(asRequest({}, '203.0.113.7', '10.0.0.2')).toBeDefined();
    expect(clientIp(asRequest({}, '203.0.113.7', '10.0.0.2'))).toBe(
      '203.0.113.7',
    );
  });

  // The bug this fixes: with no trust-proxy setting Express reported the
  // socket peer, and everything in the log was the proxy.
  it('falls back to the socket only when Express has nothing', () => {
    expect(clientIp(asRequest({}, undefined, '10.0.0.2'))).toBe('10.0.0.2');
  });

  it('prefers the browser a portal names over the portal itself', () => {
    expect(
      clientIp(
        asRequest(
          { [CLIENT_IP_HEADER]: '198.51.100.9' },
          '10.0.0.5',
          '10.0.0.5',
        ),
      ),
    ).toBe('198.51.100.9');
  });

  // A forged X-Forwarded-For used to win outright, because the leftmost entry
  // was read directly. Express now decides, so a prepended address is ignored.
  it('ignores an X-Forwarded-For a caller wrote for itself', () => {
    expect(
      clientIp(
        asRequest(
          { 'x-forwarded-for': '1.2.3.4, 203.0.113.7' },
          '203.0.113.7',
          '10.0.0.2',
        ),
      ),
    ).toBe('203.0.113.7');
  });

  it('treats a blank forwarded address as absent', () => {
    expect(
      clientIp(asRequest({ [CLIENT_IP_HEADER]: '   ' }, '203.0.113.7')),
    ).toBe('203.0.113.7');
  });

  it('has nothing to say when there is nothing to say', () => {
    expect(clientIp(asRequest({}))).toBeNull();
  });
});
