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
 * The client address.
 *
 * Behind a proxy the socket address is the proxy's, so X-Forwarded-For is
 * read first — its leftmost entry is the original client. That header is
 * caller-supplied and trivially forged, so it is only worth what the proxy in
 * front of this makes it worth: an address recorded here says "this is what
 * the request claimed", which is the most an application can honestly log.
 */
export function clientIp(req: Request): string | null {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = raw?.split(',')[0]?.trim();
  if (first) return first;
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.trim()) return real.trim();
  return req.ip ?? req.socket?.remoteAddress ?? null;
}
