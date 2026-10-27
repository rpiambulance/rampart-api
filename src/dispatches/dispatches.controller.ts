import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type { Request } from 'express';
import { Public } from '../auth/public.decorator';
import { requireIngestToken } from '../auth/ingest-token';
import { isDateOnly, nyDayEnd, nyDayStart } from '../common/dates';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import type { AuthContext } from '../auth/auth-context';
import { ConfigService } from '@nestjs/config';
import { AirService } from '../air/air.service';
import type { DispatchDetail } from '../air/dispatch-message';
import {
  mergeMessages,
  samePlace,
  UPDATE_WINDOW_MINUTES,
} from '../air/dispatch-updates';
import { geocode } from './geocode';
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
    private readonly air: AirService,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(DispatchesController.name);

  /**
   * Coordinates for a call that arrived without them.
   *
   * Herald geocodes before it forwards, so this only runs when it did not —
   * Herald has no key, its lookup failed, or somebody typed the call in.
   * Optional: with no GOOGLE_MAPS_API_KEY the call is filed as it came, and
   * the Slack post builds its directions from the address text instead.
   */
  /**
   * The call this message is more about, if it is one.
   *
   * Same place, and within a few minutes of the last message about it —
   * measured from when they arrived, since a call's own time can be backdated
   * to the pager. Calls typed in by hand are left out: they are somebody's
   * recollection, and Herald's message about the same call should stand as
   * the call that gets asked about.
   */
  private async callBeingUpdated(
    incoming: DispatchDetail,
    now: Date,
  ): Promise<number | null> {
    const since = new Date(now.getTime() - UPDATE_WINDOW_MINUTES * 60_000);
    const recent = await this.prisma.dispatch.findMany({
      where: { arrivedAt: { gte: since }, enteredById: null },
      orderBy: { arrivedAt: 'desc' },
    });
    const match = recent.find((message) => samePlace(message, incoming));
    return match ? (match.primaryId ?? match.id) : null;
  }

  private async locate(
    location: string | null,
    have: { latitude: number | null; longitude: number | null },
  ): Promise<{
    latitude?: number;
    longitude?: number;
    geocodedPlace?: string;
  }> {
    if (have.latitude != null && have.longitude != null) return {};
    const key = this.config.get<string>('GOOGLE_MAPS_API_KEY');
    if (!location || !key) return {};
    const found = await geocode(location, key);
    if (!found) {
      this.logger.warn(`could not place "${location}" on the map`);
      return {};
    }
    return {
      latitude: found.latitude,
      longitude: found.longitude,
      geocodedPlace: found.place,
    };
  }

  @Public()
  @Throttle({ default: { limit: 120, ttl: 3_600_000 } })
  @Post('herald/dispatch')
  async ingest(
    @Body() body: Record<string, unknown>,
    @Req() req: Request,
    @Query('token') queryToken?: string,
  ) {
    await requireIngestToken(this.prisma, PERMISSIONS.DISPATCHES_INGEST, {
      query: queryToken,
      request: req,
    });

    const str = (v: unknown): string | null =>
      typeof v === 'string' && v.trim() ? v.trim() : null;
    const num = (v: unknown): number | null =>
      typeof v === 'number' && Number.isFinite(v) ? v : null;
    const callType = (body['CALL TYPE'] ?? {}) as {
      determinant?: unknown;
      complaint?: unknown;
    };

    const now = new Date();
    const location = str(body['Location']);
    const latitude = num(body['latitude']);
    const longitude = num(body['longitude']);
    const fields = {
      determinant: str(callType.determinant),
      complaint: str(callType.complaint) ?? str(body['Call Type']),
      location,
      business: str(body['Business']),
      additionalInfo: str(body['Additional Location Info']),
      crossStreets: str(body['Cross Street']) ?? str(body['Cross Streets']),
      units: str(body['Dispatched Units']),
      responseAreas: str(body['Response Areas']),
      latitude,
      longitude,
      geocodedPlace: str(body['geocoded_place']),
      ...(await this.locate(location, { latitude, longitude })),
    };
    // Required by Prisma's JSON input type. The lint rule disagrees — it
    // reads the assertion as redundant — and `eslint --fix` has quietly
    // removed it, which breaks the build and not a test. tsc is the
    // authority here, so the rule is silenced rather than obeyed.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const raw = body as object;

    // More about a call already received — usually the call type, which
    // dispatch sends a minute or two after the location. Kept as a message
    // of its own, attached to the call, and the call's post is redrawn
    // rather than a second one going out and asking everybody again.
    const primaryId = await this.callBeingUpdated(fields, now);
    if (primaryId) {
      const update = await this.prisma.dispatch.create({
        data: { ...fields, receivedAt: now, primaryId, raw },
      });
      const first = await this.prisma.dispatch.findUniqueOrThrow({
        where: { id: primaryId },
        include: { followUps: { orderBy: { arrivedAt: 'asc' } } },
      });
      const call = mergeMessages([first, ...first.followUps]);
      this.webhooks.emit('dispatch.updated', {
        id: primaryId,
        messageId: update.id,
        determinant: call.determinant,
        complaint: call.complaint,
        location: call.location,
        units: call.units,
        receivedAt: first.receivedAt.toISOString(),
      });
      // The screens in the bay show the call again with what is now known.
      // The count does not move: it is the same call.
      this.headsup.emit({
        kind: 'dispatch',
        determinant: call.determinant,
        complaint: call.complaint,
        location: call.location,
        receivedAt: first.receivedAt.toISOString(),
      });
      await this.air.updated(primaryId);
      return { ok: true, id: update.id, updates: primaryId };
    }

    // The tones are the call. When a page opened a callout minutes ago,
    // that is when this happened — Herald arriving later is the paperwork
    // catching up, and the log, the counts and anything searched by date
    // should all say the earlier time.
    const receivedAt = await this.air.callTime(now);
    const dispatch = await this.prisma.dispatch.create({
      data: { ...fields, receivedAt, raw },
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
    // And to the membership, unless a crew is already out there. The page
    // from the tones may have opened the asking already, in which case this
    // joins it and the message in Slack rewrites itself with the detail.
    await this.air.dispatched(dispatch);
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
    const located = await this.locate(clean(body.location), {
      latitude: null,
      longitude: null,
    });
    const dispatch = await this.prisma.dispatch.create({
      data: {
        ...located,
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
  async list(
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

    // The fields someone would actually search a call by — in any of the
    // call's messages, since the call type is often only in the second.
    const matches = (needle: string) => [
      {
        complaint: { contains: needle, mode: 'insensitive' as const },
      },
      {
        location: { contains: needle, mode: 'insensitive' as const },
      },
      {
        business: { contains: needle, mode: 'insensitive' as const },
      },
      {
        crossStreets: {
          contains: needle,
          mode: 'insensitive' as const,
        },
      },
      { units: { contains: needle, mode: 'insensitive' as const } },
      {
        determinant: {
          contains: needle,
          mode: 'insensitive' as const,
        },
      },
      {
        additionalInfo: {
          contains: needle,
          mode: 'insensitive' as const,
        },
      },
    ];
    const rows = await this.prisma.dispatch.findMany({
      where: {
        // A call's first message is the call; updates appear within it.
        primaryId: null,
        ...(search
          ? {
              OR: [
                ...matches(search),
                { followUps: { some: { OR: matches(search) } } },
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
        followUps: { orderBy: { arrivedAt: 'asc' } },
        enteredBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
        // Who said they were coming, when anybody was asked. The dispatch is
        // what the call was; this is what the agency did about it.
        callout: {
          select: {
            id: true,
            asked: true,
            // What the scanner recorded, so the log can play the call back.
            audio: {
              orderBy: { receivedAt: 'asc' },
              select: {
                id: true,
                receivedAt: true,
                bytes: true,
                slackPermalink: true,
              },
            },
            responses: {
              where: { responding: true },
              orderBy: { at: 'asc' },
              select: {
                at: true,
                slackName: true,
                member: {
                  select: {
                    id: true,
                    firstName: true,
                    preferredFirstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { receivedAt: 'desc' },
      take: limit ? Math.min(Number(limit), 500) : 100,
    });
    // Each call as all its messages describe it, with how many there were.
    return rows.map(({ followUps, ...row }) => ({
      ...row,
      ...mergeMessages([row, ...followUps]),
      updates: followUps.length,
    }));
  }
}
