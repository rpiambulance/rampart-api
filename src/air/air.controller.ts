import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { createHash } from 'crypto';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Public } from '../auth/public.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AirService } from './air.service';

/**
 * What the pager sends.
 *
 * The field names are AIR's, because the thing sending them is a paging
 * gateway nobody here controls: `verification` is a shared string and
 * `dispatch` is the one line of text it knows. Kept exactly so the feed can
 * be pointed at this without being rewritten first.
 */
class PageDto {
  @IsOptional() @IsString() @MaxLength(200) verification?: string;
  @IsOptional() @IsString() @MaxLength(2000) dispatch?: string;
  /** What a sender we do control would send instead. */
  @IsOptional() @IsString() @MaxLength(2000) text?: string;
}

/**
 * AIR: the page in, and the answers out.
 *
 * The page endpoint is public in the same sense Herald's is — no session,
 * authenticated by what it carries. Either an ingest API token, or the
 * shared verification string the old gateway sends.
 */
@Controller({ version: '1' })
export class AirController {
  constructor(
    private readonly air: AirService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Whoever sent this has to prove it somehow.
   *
   * An ingest token is the way to do it now. The shared string is accepted
   * because the gateway that sends it cannot be changed today, and a page
   * that arrives unauthenticated is worse than one authenticated weakly:
   * anybody could make the whole membership turn out.
   */
  private async authenticate(
    token: string | undefined,
    verification: string | undefined,
  ): Promise<void> {
    if (token?.startsWith('rpa_')) {
      const tokenHash = createHash('sha256').update(token).digest('hex');
      const found = await this.prisma.apiToken.findUnique({
        where: { tokenHash },
      });
      const now = new Date();
      if (
        found &&
        !found.revokedAt &&
        (!found.expiresAt || found.expiresAt >= now) &&
        found.permissions.includes(PERMISSIONS.DISPATCHES_INGEST)
      ) {
        await this.prisma.apiToken.update({
          where: { id: found.id },
          data: { lastUsedAt: now },
        });
        return;
      }
      throw new UnauthorizedException('Invalid ingest token');
    }

    const expected = process.env.AIR_PAGE_SECRET?.trim();
    if (expected && verification && verification.trim() === expected) return;
    throw new UnauthorizedException(
      'A dispatches:ingest API token or the page secret is required',
    );
  }

  /** The tones dropped. */
  @Public()
  @Throttle({ default: { limit: 120, ttl: 3_600_000 } })
  @Post('air/page')
  async page(@Body() body: PageDto, @Query('token') token?: string) {
    await this.authenticate(token, body.verification);
    const text = (body.text ?? body.dispatch ?? '').trim();
    if (!text) return { ok: false, reason: 'Nothing to post' };
    const callout = await this.air.page(text, 'DISPATCH');
    return { ok: true, id: callout.id, asked: callout.asked };
  }

  /** A county longtone. Posted for awareness; nobody is asked. */
  @Public()
  @Throttle({ default: { limit: 120, ttl: 3_600_000 } })
  @Post('air/longtone')
  async longtone(@Body() body: PageDto, @Query('token') token?: string) {
    await this.authenticate(token, body.verification);
    const text = (body.text ?? body.dispatch ?? '').trim();
    if (!text) return { ok: false, reason: 'Nothing to post' };
    const callout = await this.air.page(text, 'LONGTONE');
    return { ok: true, id: callout.id, asked: false };
  }

  /** What is being asked right now — the screen in the bay reads this. */
  @Get('air/live')
  live() {
    return this.air.live();
  }

  @Get('air/callouts/:id')
  @RequirePermissions(PERMISSIONS.DISPATCHES_READ)
  get(@Param('id', ParseIntPipe) id: number) {
    return this.air.get(id);
  }
}
