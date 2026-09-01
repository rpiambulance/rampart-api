import { AsyncLocalStorage } from 'async_hooks';
import type { Request } from 'express';

export interface RequestContext {
  /** The caller's address, as far as it can be established. */
  ip: string | null;
  userAgent: string | null;
  method: string;
  path: string;
}

/**
 * The current request, reachable from anywhere without threading it through.
 *
 * The audit log wants the caller's address, and the services that write it are
 * plain singletons. Making them request-scoped would spread that scope to
 * everything that injects them; async-local storage keeps the request where
 * the code that needs it can find it and changes nothing else.
 */
export const requestContext = new AsyncLocalStorage<RequestContext>();

export function currentRequest(): RequestContext | undefined {
  return requestContext.getStore();
}

/**
 * The header central uses to name the browser it is rendering for.
 *
 * Deliberately not X-Forwarded-For. That chain is hop-counted from the right,
 * and this leg has a different number of proxies on it than a request the
 * browser makes directly — folding it in would shift the count and start
 * reporting the wrong entry, silently, on one path or the other.
 */
export const CLIENT_IP_HEADER = 'x-rampart-client-ip';

/**
 * The client address.
 *
 * Two kinds of caller reach this service. Something at a browser talking to
 * it through the proxy, where Express — now told how many proxies to skip —
 * resolves the address itself and ignores anything a client prepended. And
 * one of the portals, rendering server-side on somebody's behalf, where the
 * socket peer is the portal and the address that matters comes in a header
 * of its own.
 *
 * That header is only worth what the caller is: anyone able to call this API
 * directly could set it and name any address they liked, in their own rows.
 * The same was true of the X-Forwarded-For read this replaces, and less
 * obviously so. What an address here means is "this is what the request
 * claimed, from a caller we let in" — which is the most an application can
 * honestly log.
 */
export function clientIp(req: Request): string | null {
  const passed = req.headers[CLIENT_IP_HEADER];
  const named = Array.isArray(passed) ? passed[0] : passed;
  if (typeof named === 'string' && named.trim()) return named.trim();
  // Express walks X-Forwarded-For from the right, skipping the proxies it
  // has been told to trust. Set in main.ts; without it this is the proxy.
  return req.ip ?? req.socket?.remoteAddress ?? null;
}
