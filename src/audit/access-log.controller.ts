import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IsString } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { AGENCY_TZ, isDateOnly, nyDayEnd, nyDayStart } from '../common/dates';
import { currentRequest } from '../common/request-context';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AccessLogService } from './access-log.service';

class PageViewDto {
  @IsString()
  path!: string;
}

@Controller({ path: 'access-log', version: '1' })
export class AccessLogController {
  constructor(
    private readonly accessLog: AccessLogService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * A portal reporting a page it rendered.
   *
   * The API sees the calls a page makes but not the page itself, and a page
   * served from cache makes none at all. 204 with no body: the caller has
   * nothing to do with the answer and should not be kept waiting on it.
   */
  @Post('page-view')
  @HttpCode(204)
  pageView(@CurrentAuth() auth: AuthContext, @Body() body: PageViewDto) {
    const request = currentRequest();
    this.accessLog.record({
      kind: 'PAGE',
      memberId: auth.kind === 'member' ? auth.memberId : null,
      apiTokenId: auth.kind === 'api-token' ? auth.apiTokenId : null,
      method: 'GET',
      path: body.path,
      // The address of the browser, forwarded by the portal rendering for it,
      // falling back to the portal's own if it did not say.
      ip: request?.ip ?? null,
      userAgent: request?.userAgent ?? null,
    });
  }

  /** Recent traffic, for whoever may read the audit log. */
  @Get()
  @RequirePermissions(PERMISSIONS.AUDIT_READ)
  list(
    @Query('memberId') memberId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('path') path?: string,
    @Query('limit') limit?: string,
  ) {
    // New York calendar days, like every other date filter in the API.
    const since = from && isDateOnly(from) ? nyDayStart(from) : undefined;
    const until = to && isDateOnly(to) ? nyDayEnd(to) : undefined;
    const member = Number(memberId);

    return this.prisma.accessLog.findMany({
      where: {
        ...(Number.isInteger(member) ? { memberId: member } : {}),
        ...(path ? { path: { contains: path, mode: 'insensitive' } } : {}),
        ...(since || until
          ? {
              at: {
                ...(since ? { gte: since } : {}),
                ...(until ? { lt: until } : {}),
              },
            }
          : {}),
      },
      orderBy: { at: 'desc' },
      take: Math.min(Number(limit) || 100, 1000),
    });
  }

  /** Keeps the traffic log from growing without bound. Never touches AuditLog. */
  @Cron('30 3 * * *', { timeZone: AGENCY_TZ })
  async prune(): Promise<void> {
    await this.accessLog.prune();
  }
}
