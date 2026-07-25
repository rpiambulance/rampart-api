import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { createHash } from 'crypto';
import { Public } from '../auth/public.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

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
@Controller({ version: '1' })
export class DispatchesController {
  constructor(private readonly prisma: PrismaService) {}

  private async validateIngestToken(raw?: string): Promise<void> {
    if (!raw?.startsWith('rpa_')) {
      throw new UnauthorizedException('A dispatches:ingest API token is required');
    }
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const token = await this.prisma.apiToken.findUnique({ where: { tokenHash } });
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
        raw: body as object,
      },
    });
    return { ok: true, id: dispatch.id };
  }

  @Get('dispatches')
  @RequirePermissions(PERMISSIONS.DISPATCHES_READ)
  list(@Query('limit') limit?: string) {
    return this.prisma.dispatch.findMany({
      orderBy: { receivedAt: 'desc' },
      take: limit ? Math.min(Number(limit), 500) : 100,
    });
  }
}
