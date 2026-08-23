import { BadRequestException } from '@nestjs/common';
import { TurnstileService } from './turnstile.service';

/**
 * The bot check on the public coverage form.
 *
 * Two things matter more than the happy path: an install with no keys must
 * keep taking requests, and an install with keys must not quietly stop
 * checking when Cloudflare has a bad afternoon.
 */
function serviceWith(
  secret: string | undefined,
  reply?: { ok?: boolean; body?: unknown } | Error,
) {
  const calls: Array<Record<string, string>> = [];
  global.fetch = ((_url: string, init: { body: URLSearchParams }) => {
    calls.push(Object.fromEntries(init.body));
    if (reply instanceof Error) return Promise.reject(reply);
    return Promise.resolve({
      ok: reply?.ok ?? true,
      status: reply?.ok === false ? 500 : 200,
      json: () => Promise.resolve(reply?.body ?? { success: true }),
    });
  }) as unknown as typeof fetch;
  const config = { get: () => secret };
  return { service: new TurnstileService(config as never), calls };
}

describe('Turnstile', () => {
  it('is off when no key is configured, and lets submissions through', async () => {
    const { service, calls } = serviceWith(undefined);
    expect(service.enabled).toBe(false);
    await expect(service.verify(undefined, null)).resolves.toBeUndefined();
    expect(calls).toEqual([]);
  });

  it('reports which state it booted in', () => {
    // The symptom of a half-configured install — widget on the page, nothing
    // verifying its tokens — is invisible from outside, so the log says.
    expect(serviceWith('secret').service.enabled).toBe(true);
    expect(serviceWith(undefined).service.enabled).toBe(false);
  });

  it('turns away a submission with no token', async () => {
    const { service, calls } = serviceWith('secret');
    await expect(service.verify(undefined, '1.2.3.4')).rejects.toThrow(
      BadRequestException,
    );
    // Nothing was asked of Cloudflare: there was nothing to ask about.
    expect(calls).toEqual([]);
  });

  it('passes a good token, with the requester’s address', async () => {
    const { service, calls } = serviceWith('secret');
    await expect(service.verify('token', '1.2.3.4')).resolves.toBeUndefined();
    expect(calls).toEqual([
      { secret: 'secret', response: 'token', remoteip: '1.2.3.4' },
    ]);
  });

  it('omits the address when the web app did not pass one on', async () => {
    const { service, calls } = serviceWith('secret');
    await service.verify('token', null);
    expect(calls[0].remoteip).toBeUndefined();
  });

  it('says so plainly when the check has expired', async () => {
    const { service } = serviceWith('secret', {
      body: { success: false, 'error-codes': ['timeout-or-duplicate'] },
    });
    await expect(service.verify('stale', null)).rejects.toThrow(/expired/i);
  });

  it('does not blame the submitter for our own bad key', async () => {
    const { service } = serviceWith('secret', {
      body: { success: false, 'error-codes': ['invalid-input-secret'] },
    });
    await expect(service.verify('token', null)).rejects.toThrow(
      /could not run the bot check/i,
    );
  });

  it('fails closed when Cloudflare cannot be reached', async () => {
    const { service } = serviceWith('secret', new Error('ECONNREFUSED'));
    await expect(service.verify('token', null)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('fails closed on a bad response as well as no response', async () => {
    const { service } = serviceWith('secret', { ok: false });
    await expect(service.verify('token', null)).rejects.toThrow(
      BadRequestException,
    );
  });
});
