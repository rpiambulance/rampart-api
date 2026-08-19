import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AccessLogService } from '../audit/access-log.service';
import type { AuthContext } from '../auth/auth-context';
import { clientIp, requestContext } from './request-context';

/**
 * Health checks are the load balancer talking to itself; nothing to record.
 *
 * The version prefix is optional in these patterns because routes are served
 * under /v1 while the path a probe uses may not be — matching only the bare
 * form let every health check through into the log.
 */
const IGNORED = [/^(\/v\d+)?\/health/, /^(\/v\d+)?\/docs/, /^\/favicon\.ico$/];

/**
 * Puts the request where the rest of the process can find it, and records
 * that it happened.
 *
 * Running as middleware rather than an interceptor means the context is in
 * place before the guards run, so anything an auth failure writes is still
 * attributed to an address.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly accessLog: AccessLogService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const ip = clientIp(req);
    const userAgent = req.headers['user-agent'] ?? null;
    const path = req.originalUrl || req.url;
    const started = Date.now();

    if (!IGNORED.some((pattern) => pattern.test(path))) {
      // On finish, so the status and duration are the real ones. The auth
      // context is attached by the guard, which has run by then.
      res.on('finish', () => {
        const auth = (req as Request & { auth?: AuthContext }).auth;
        this.accessLog.record({
          kind: 'API',
          memberId: auth?.kind === 'member' ? auth.memberId : null,
          apiTokenId: auth?.kind === 'api-token' ? auth.apiTokenId : null,
          method: req.method,
          path,
          status: res.statusCode,
          durationMs: Date.now() - started,
          ip,
          userAgent,
        });
      });
    }

    requestContext.run({ ip, userAgent, method: req.method, path }, () =>
      next(),
    );
  }
}
