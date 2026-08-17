import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { Public } from '../auth/public.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import type { EventInput } from '../events/events.service';

/** One event on a request. A submission may carry several. */
class RequestedEventDto {
  @IsString()
  @MaxLength(4000)
  description!: string;

  @IsOptional()
  @IsDateString()
  requestedDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  location?: string;

}

class DeclineDto {
  /** Shared with the requester in the decline email. */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}

class IntakeDto {
  @IsString()
  @MaxLength(100)
  requesterName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  requesterOrg?: string;

  @IsEmail()
  requesterEmail!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  requesterPhone?: string;

  /** Used when `events` is absent; a submission needs one or the other. */
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsDateString()
  requestedDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  location?: string;
  /**
   * Several events in one submission — a season's home games, say. Each
   * becomes its own request so they can be staffed and answered separately,
   * while the requester fills the form once. When absent, the single set of
   * fields above is used instead.
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(25)
  @ValidateNested({ each: true })
  @Type(() => RequestedEventDto)
  events?: RequestedEventDto[];
}

class MessageDto {
  @IsString()
  @MaxLength(4000)
  body!: string;
}

/**
 * Coverage-event intake (spec: outside person requests coverage → event
 * scheduler drafts the event → availability → approval → requester notified).
 * Public endpoints are throttled and keyed by an unguessable status token.
 */
@Controller({ path: 'coverage-requests', version: '1' })
export class CoverageController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly events: EventsService,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  private statusUrl(token: string): string {
    const base = this.config.get('WEB_BASE_URL') ?? 'http://localhost:3000';
    return `${base}/request-coverage/status/${token}`;
  }

  private derivedStatus(request: {
    event: { workflowStatus: string } | null;
    declinedAt?: Date | null;
  }): string {
    // A request can be turned down before any event exists for it, so the
    // decline is recorded on the request itself.
    if (!request.event && request.declinedAt) return 'DENIED';
    return request.event?.workflowStatus ?? 'RECEIVED';
  }

  // ---------------------------------------------------------------- public

  @Public()
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @Post()
  async intake(@Body() body: IntakeDto) {
    const wanted = body.events?.length
      ? body.events
      : body.description
        ? [
            {
              description: body.description,
              requestedDate: body.requestedDate,
              location: body.location,
            },
          ]
        : [];
    if (!wanted.length) {
      throw new BadRequestException(
        'Describe at least one event you need covered',
      );
    }

    const created = await Promise.all(
      wanted.map((item) =>
        this.prisma.coverageRequest.create({
          data: {
            token: randomBytes(24).toString('hex'),
            requesterName: body.requesterName,
            requesterOrg: body.requesterOrg,
            requesterEmail: body.requesterEmail,
            requesterPhone: body.requesterPhone,
            description: item.description,
            requestedDate: item.requestedDate ? new Date(item.requestedDate) : null,
            location: item.location,
          },
        }),
      ),
    );

    // One email covering the submission, so requesting six games does not send
    // six near-identical messages.
    const lines = created.map((request) => {
      const when = request.requestedDate
        ? request.requestedDate.toISOString().slice(0, 10)
        : 'date to be confirmed';
      return `• ${when} — ${request.description.slice(0, 120)}\n  ${this.statusUrl(request.token)}`;
    });
    await this.notifications.sendEmail(
      body.requesterEmail,
      created.length > 1
        ? `RPI Ambulance — ${created.length} coverage requests received`
        : 'RPI Ambulance — coverage request received',
      `We received your ${created.length > 1 ? 'requests' : 'request'}. Track ` +
        `${created.length > 1 ? 'each one' : 'it'} and answer any follow-up ` +
        `questions here:\n\n${lines.join('\n\n')}`,
    );
    await this.notifications.notifyOfficers(
      created.length > 1
        ? `New coverage requests (${created.length})`
        : 'New coverage request',
      `${body.requesterName}${body.requesterOrg ? ` (${body.requesterOrg})` : ''}: ` +
        created.map((r) => r.description.slice(0, 120)).join(' | ').slice(0, 500),
    );

    return {
      ok: true,
      // Kept singular for anything already reading it.
      statusUrl: this.statusUrl(created[0].token),
      statusUrls: created.map((request) => this.statusUrl(request.token)),
    };
  }

  @Public()
  @Get('status/:token')
  async status(@Param('token') token: string) {
    const request = await this.prisma.coverageRequest.findUnique({
      where: { token },
      include: {
        event: {
          select: { workflowStatus: true, title: true, startsAt: true, endsAt: true, location: true },
        },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!request) throw new NotFoundException();
    return {
      status: this.derivedStatus(request),
      requesterName: request.requesterName,
      description: request.description,
      requestedDate: request.requestedDate,
      location: request.location,
      createdAt: request.createdAt,
      event: request.event,
      messages: request.messages.map((m) => ({
        direction: m.direction,
        body: m.body,
        createdAt: m.createdAt,
      })),
    };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 3_600_000 } })
  @Post('status/:token/messages')
  async requesterMessage(@Param('token') token: string, @Body() body: MessageDto) {
    const request = await this.prisma.coverageRequest.findUnique({
      where: { token },
    });
    if (!request) throw new NotFoundException();
    await this.prisma.coverageMessage.create({
      data: { requestId: request.id, direction: 'FROM_REQUESTER', body: body.body },
    });
    await this.notifications.notifyOfficers(
      `Coverage request #${request.id}: reply from ${request.requesterName}`,
      body.body.slice(0, 300),
    );
    return { ok: true };
  }

  // ----------------------------------------------------------------- staff

  @Get()
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  async list() {
    const requests = await this.prisma.coverageRequest.findMany({
      include: {
        event: { select: { id: true, workflowStatus: true, title: true, startsAt: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return requests.map((r) => ({ ...r, status: this.derivedStatus(r) }));
  }

  /**
   * Turn down a request that has no event yet. Once one exists the event's own
   * workflow owns the outcome, and DENY there is the way to decline.
   */
  @Post(':id/decline')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  async decline(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DeclineDto,
  ) {
    // Same rule as declining an event: either permission will do.
    if (
      !auth.permissions.has(PERMISSIONS.EVENTS_DECLINE) &&
      !auth.permissions.has(PERMISSIONS.EVENTS_APPROVE)
    ) {
      throw new ForbiddenException(
        'Missing permission: events:decline (or events:approve)',
      );
    }
    const request = await this.prisma.coverageRequest.findUnique({
      where: { id },
      include: { event: { select: { id: true } } },
    });
    if (!request) throw new NotFoundException();
    if (request.event) {
      throw new BadRequestException(
        'This request already has an event — decline it from the event workflow',
      );
    }
    if (request.declinedAt) {
      throw new BadRequestException('This request was already declined');
    }

    const updated = await this.prisma.coverageRequest.update({
      where: { id },
      data: { declinedAt: new Date(), declineReason: body.reason ?? null },
    });
    await this.audit.log(auth, 'coverage.decline', 'CoverageRequest', id, {
      reason: body.reason,
    });
    await this.notifications.sendEmail(
      updated.requesterEmail,
      'RPI Ambulance — coverage request declined',
      `We're sorry — we can't staff this request.${
        body.reason ? `\n\n${body.reason}` : ''
      }\n\nDetails: ${this.statusUrl(updated.token)}`,
    );
    return { ok: true };
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  async get(@Param('id', ParseIntPipe) id: number) {
    const request = await this.prisma.coverageRequest.findUnique({
      where: { id },
      include: {
        event: { include: { positions: true, tier: true } },
        messages: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!request) throw new NotFoundException();
    return { ...request, status: this.derivedStatus(request) };
  }

  /** Query the requester for more information (emails them a prompt). */
  @Post(':id/messages')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  async staffMessage(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: MessageDto,
  ) {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('Requires a member session');
    }
    const request = await this.prisma.coverageRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException();
    await this.prisma.coverageMessage.create({
      data: {
        requestId: id,
        direction: 'TO_REQUESTER',
        body: body.body,
        authorId: auth.memberId,
      },
    });
    await this.notifications.sendEmail(
      request.requesterEmail,
      'RPI Ambulance — question about your coverage request',
      `${body.body}\n\nReply here: ${this.statusUrl(request.token)}`,
    );
    return { ok: true };
  }

  /** Draft the event from the request (workflow starts at DRAFT, hidden). */
  @Post(':id/event')
  @RequirePermissions(PERMISSIONS.EVENTS_CREATE)
  async createEvent(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EventInput,
  ) {
    const request = await this.prisma.coverageRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException();
    if (request.eventId) {
      throw new ForbiddenException('An event already exists for this request');
    }
    const event = await this.events.create(auth, {
      ...body,
      hidden: true,
      workflowStatus: 'DRAFT',
    });
    await this.prisma.coverageRequest.update({
      where: { id },
      data: { eventId: event.id },
    });
    await this.audit.log(auth, 'coverage.event.create', 'CoverageRequest', id, {
      eventId: event.id,
    });
    return event;
  }
}
