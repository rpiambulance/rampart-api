import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { timingSafeEqual } from 'crypto';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/public.decorator';
import { toDbDate } from '../common/dates';
import { currentCrewNight } from '../crews/crew-night';
import { PrismaService } from '../prisma/prisma.service';

/** Compares without leaking how much of the token was right. */
function tokenMatches(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on a length mismatch, which would be the leak all
  // over again; the length check is done separately and constant work is
  // still performed on the equal-length path.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * The on-duty supervisor, for DiALERT.
 *
 * Deliberately the plainest thing that can work: one GET, a shared secret in
 * the query string, and a body containing the member's ID and nothing else —
 * no JSON, no wrapper, nothing to parse. An empty body means there is nobody
 * to name, which a caller can treat as "no answer" without inspecting it.
 *
 * The secret lives in DIALERT_TOKEN. With the variable unset the endpoint
 * answers nothing to anyone: an unconfigured secret must never come out as
 * "no authentication required", which is the way this kind of endpoint
 * usually goes wrong.
 *
 * A token in a query string is weaker than a header — it is the sort of thing
 * that ends up in proxy logs — and it is here because it is what the caller
 * can send. Ours is kept out of our own access log by the redaction in
 * RequestContextMiddleware. For anything that can set a header, the
 * admin-issued API tokens are the better door.
 */
@Controller({ path: 'dialert', version: '1' })
export class DialertController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Get('duty-supervisor')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  async dutySupervisor(
    @Query('token') token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const expected = this.config.get<string>('DIALERT_TOKEN');
    if (!expected || !token || !tokenMatches(token, expected)) {
      res.status(401);
      return '';
    }

    const slot = await this.prisma.crewSlot.findFirst({
      where: {
        position: 'DUTY_SUP',
        crew: { date: toDbDate(currentCrewNight()) },
        // A seat held by a placeholder rather than a member — "CLOSED" and
        // the like — names nobody, so it is no answer.
        memberId: { not: null },
      },
      select: { memberId: true },
    });

    if (!slot?.memberId) {
      // Nothing scheduled, or the seat is open. 204 rather than an error:
      // the question was answerable and the answer is nobody.
      res.status(204);
      return '';
    }
    return String(slot.memberId);
  }
}
