import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityStatus } from '../generated/prisma/enums';

class CreatePollDto {
  @IsString()
  name!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  memberIds!: number[];
}

class ResponseEntryDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @IsIn(['AVAILABLE', 'UNAVAILABLE', 'IF_NEEDED'])
  status!: AvailabilityStatus;
}

class SubmitResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseEntryDto)
  entries!: ResponseEntryDto[];
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

/**
 * Weekly-availability polls: a scheduler invites selected members to fill a
 * per-weekday grid, then overlays the results while building the default
 * crew schedule. Replaces the third-party polling app.
 */
@Controller({ path: 'availability/polls', version: '1' })
export class AvailabilityController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
  ) {}

  // ------------------------------------------------------------- scheduler

  @Get()
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  list() {
    return this.prisma.availabilityPoll.findMany({
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { invites: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  async create(@CurrentAuth() auth: AuthContext, @Body() body: CreatePollDto) {
    const poll = await this.prisma.availabilityPoll.create({
      data: {
        name: body.name,
        createdById: requireMember(auth),
        invites: {
          create: [...new Set(body.memberIds)].map((memberId) => ({ memberId })),
        },
      },
    });
    await this.audit.log(auth, 'availability.poll.create', 'AvailabilityPoll', poll.id);
    for (const memberId of new Set(body.memberIds)) {
      await this.notifications.notify(memberId, {
        type: 'availability.requested',
        subject: `Availability requested: ${body.name}`,
        body: 'Tell us which weeknights you can ride.',
        task: {
          actionLabel: 'Fill in your availability',
          actionUrl: '/availability',
        },
      });
    }
    return poll;
  }

  /** Full grid: invited members × weekdays, for the defaults editor overlay. */
  @Get(':id')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  async grid(@Param('id', ParseIntPipe) id: number) {
    const poll = await this.prisma.availabilityPoll.findUniqueOrThrow({
      where: { id },
      include: {
        invites: {
          include: {
            member: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        responses: true,
      },
    });
    return {
      id: poll.id,
      name: poll.name,
      status: poll.status,
      createdAt: poll.createdAt,
      closedAt: poll.closedAt,
      members: poll.invites.map((invite) => ({
        member: invite.member,
        responded: poll.responses.some((r) => r.memberId === invite.memberId),
        days: Object.fromEntries(
          poll.responses
            .filter((r) => r.memberId === invite.memberId)
            .map((r) => [r.weekday, r.status]),
        ),
      })),
    };
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS)
  async close(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'OPEN' | 'CLOSED' },
  ) {
    const poll = await this.prisma.availabilityPoll.update({
      where: { id },
      data: {
        status: body.status,
        closedAt: body.status === 'CLOSED' ? new Date() : null,
      },
    });
    await this.audit.log(auth, 'availability.poll.status', 'AvailabilityPoll', id, body);
    return poll;
  }

  // ---------------------------------------------------------------- member

  /** Open polls the caller is invited to, with their current answers. */
  @Get('mine/open')
  async mine(@CurrentAuth() auth: AuthContext) {
    const memberId = requireMember(auth);
    const polls = await this.prisma.availabilityPoll.findMany({
      where: { status: 'OPEN', invites: { some: { memberId } } },
      include: { responses: { where: { memberId } } },
      orderBy: { createdAt: 'desc' },
    });
    return polls.map((poll) => ({
      id: poll.id,
      name: poll.name,
      createdAt: poll.createdAt,
      days: Object.fromEntries(
        poll.responses.map((r) => [r.weekday, r.status]),
      ),
    }));
  }

  @Put(':id/response')
  async respond(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SubmitResponseDto,
  ) {
    const memberId = requireMember(auth);
    const poll = await this.prisma.availabilityPoll.findUnique({
      where: { id },
      include: { invites: { where: { memberId } } },
    });
    if (!poll || !poll.invites.length) {
      throw new ForbiddenException('You are not invited to this poll');
    }
    if (poll.status !== 'OPEN') {
      throw new BadRequestException('This poll is closed');
    }
    for (const entry of body.entries) {
      await this.prisma.availabilityResponse.upsert({
        where: {
          pollId_memberId_weekday: { pollId: id, memberId, weekday: entry.weekday },
        },
        create: { pollId: id, memberId, weekday: entry.weekday, status: entry.status },
        update: { status: entry.status },
      });
    }
    return { ok: true };
  }
}
