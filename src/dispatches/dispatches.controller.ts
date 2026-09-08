import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { createHash } from 'crypto';
import { Public } from '../auth/public.decorator';
import { isDateOnly, nyDayEnd, nyDayStart } from '../common/dates';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import type { AuthContext } from '../auth/auth-context';
import { HeadsupEvents } from '../headsup/headsup.events';
import { WebhooksService } from '../webhooks/webhooks.service';

/**
 * Ingestion + log of text-message dispatches from Herald (techinems/herald).
 *
 * Herald POSTs its parsed dispatch JSON to `${HEADSUP_URL}/dispatch?token=…`,
 * so pointing HEADSUP_URL at `<api>/v1/herald` makes today's Herald work
 * unmodified: the query token must be an rpa_ API token holding
 * dispatches:ingest. A standard Authorization: Bearer header works too.
 *
 * Herald's payload (see its handleDispatchText): keys with spaces —
 *   "Call Type" (raw), "CALL TYPE" {determinant, complaint}, Location
 *   (may already be the geocoded/business-prefixed form), Business,
 *   "Additional Location Info", "Cross Street"/"Cross Streets",
 *   "Dispatched Units", "Response Areas", latitude, longitude,
 *   geocoded_place.
 */
/** What a person can say about a call the feed never delivered. */
class ManualDispatchDto {
  /** When the call came in. Now, unless somebody is writing up an old one. */
  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @IsOptional()
  @IsIn(['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Omega', 'Unknown'])
  determinant?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  complaint?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  business?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  additionalInfo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  crossStreets?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  units?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  responseAreas?: string;
}

@Controller({ version: '1' })
export class DispatchesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webhooks: WebhooksService,
    private readonly headsup: HeadsupEvents,
    private readonly audit: AuditService,
  ) {}

  private async validateIngestToken(raw?: string): Promise<void> {
    if (!raw?.startsWith('rpa_')) {
      throw new UnauthorizedException(
        'A dispatches:ingest API token is required',
      );
    }
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const token = await this.prisma.apiToken.findUnique({
      where: { tokenHash },
    });
    const now = new Date();
    if (
      !token ||
      token.revokedAt ||
      (token.expiresAt && token.expiresAt < now) ||
      !token.permissions.includes(PERMISSIONS.DISPATCHES_INGEST)
    ) {
      throw new UnauthorizedException('Invalid ingest token');
    }
    await this.prisma.apiToken.update({
      where: { id: token.id },
      data: { lastUsedAt: now },
    });
  }

  @Public()
  @Throttle({ default: { limit: 120, ttl: 3_600_000 } })
  @Post('herald/dispatch')
  async ingest(
    @Body() body: Record<string, unknown>,
    @Query('token') queryToken?: string,
  ) {
    await this.validateIngestToken(queryToken);

    const str = (v: unknown): string | null =>
      typeof v === 'string' && v.trim() ? v.trim() : null;
    const num = (v: unknown): number | null =>
      typeof v === 'number' && Number.isFinite(v) ? v : null;
    const callType = (body['CALL TYPE'] ?? {}) as {
      determinant?: unknown;
      complaint?: unknown;
    };

    const dispatch = await this.prisma.dispatch.create({
      data: {
        determinant: str(callType.determinant),
        complaint: str(callType.complaint) ?? str(body['Call Type']),
        location: str(body['Location']),
        business: str(body['Business']),
        additionalInfo: str(body['Additional Location Info']),
        crossStreets: str(body['Cross Street']) ?? str(body['Cross Streets']),
        units: str(body['Dispatched Units']),
        responseAreas: str(body['Response Areas']),
        latitude: num(body['latitude']),
        longitude: num(body['longitude']),
        geocodedPlace: str(body['geocoded_place']),
        // Required by Prisma's JSON input type. The lint rule disagrees —
        // it reads the assertion as redundant — and `eslint --fix` has
        // quietly removed it, which breaks the build and not a test. tsc is
        // the authority here, so the rule is silenced rather than obeyed.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        raw: body as object,
      },
    });
    this.webhooks.emit('dispatch.received', {
      id: dispatch.id,
      determinant: dispatch.determinant,
      complaint: dispatch.complaint,
      location: dispatch.location,
      units: dispatch.units,
      receivedAt: dispatch.receivedAt.toISOString(),
    });
    // Straight to the screens in the bay, which interrupt themselves for it.
    // The call count on the board moves with it, so the board is told too.
    this.headsup.emit({
      kind: 'dispatch',
      determinant: dispatch.determinant,
      complaint: dispatch.complaint,
      location: dispatch.location,
      receivedAt: dispatch.receivedAt.toISOString(),
    });
    this.headsup.boardChanged();
    return { ok: true, id: dispatch.id };
  }

  /**
   * A dispatch entered by hand.
   *
   * Herald misses calls — a dead phone, a dropped message, a page that
   * arrived as mojibake — and a missing one is not just a gap in the log:
   * it is a call absent from the count on the board and from anything
   * anybody reports off that log later.
   *
   * Deliberately quieter than an ingested one. The screens in the bay are
   * not interrupted and the dispatch.received webhook does not fire, because
   * both of those mean "this is happening now" and this almost never is —
   * it is somebody writing up a call that already ended. The board's count
   * does move, because the call did happen and the number is meant to say
   * how many there have been.
   */
  @Post('dispatches')
  @RequirePermissions(PERMISSIONS.DISPATCHES_WRITE)
  async createManually(
    @CurrentAuth() auth: AuthContext,
    @Body() body: ManualDispatchDto,
  ) {
    const clean = (value?: string) => value?.trim() || null;
    const enteredById = auth.kind === 'member' ? auth.memberId : null;
    const dispatch = await this.prisma.dispatch.create({
      data: {
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : new Date(),
        determinant: clean(body.determinant),
        complaint: clean(body.complaint),
        location: clean(body.location),
        business: clean(body.business),
        additionalInfo: clean(body.additionalInfo),
        crossStreets: clean(body.crossStreets),
        units: clean(body.units),
        responseAreas: clean(body.responseAreas),
        enteredById,
        // `raw` is the payload as received, and there wasn't one. Saying so
        // is better than an empty object that reads like a failed ingest.
        raw: { source: 'manual', enteredById },
      },
    });
    await this.audit.log(auth, 'dispatches.create', 'Dispatch', dispatch.id, {
      determinant: dispatch.determinant,
      complaint: dispatch.complaint,
      receivedAt: dispatch.receivedAt.toISOString(),
    });
    // The count on the board is the one thing that should move.
    this.headsup.boardChanged();
    return dispatch;
  }

  @Get('dispatches')
  @RequirePermissions(PERMISSIONS.DISPATCHES_READ)
  list(
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const search = (q ?? '').trim();
    // Both are plain dates naming New York calendar days, while receivedAt is
    // an instant: asking for the 17th must mean local midnight to midnight,
    // not 20:00 the evening before to 20:00 that evening.
    const fromStart = from && isDateOnly(from) ? nyDayStart(from) : undefined;
    const toEnd = to && isDateOnly(to) ? nyDayEnd(to) : undefined;

    return this.prisma.dispatch.findMany({
      where: {
        ...(search
          ? {
              // The fields someone would actually search a call by.
              OR: [
                {
                  complaint: { contains: search, mode: 'insensitive' as const },
                },
                {
                  location: { contains: search, mode: 'insensitive' as const },
                },
                {
                  business: { contains: search, mode: 'insensitive' as const },
                },
                {
                  crossStreets: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
                { units: { contains: search, mode: 'insensitive' as const } },
                {
                  determinant: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
                {
                  additionalInfo: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
              ],
            }
          : {}),
        ...(fromStart || toEnd
          ? {
              receivedAt: {
                ...(fromStart ? { gte: fromStart } : {}),
                ...(toEnd ? { lt: toEnd } : {}),
              },
            }
          : {}),
      },
      include: {
        enteredBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
      orderBy: { receivedAt: 'desc' },
      take: limit ? Math.min(Number(limit), 500) : 100,
    });
  }
}
