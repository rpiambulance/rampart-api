import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { GoogleCalendarService } from '../integrations/google-calendar.service';
import { PrismaService } from '../prisma/prisma.service';

export interface EventPositionInput {
  position: string;
  count: number;
  requiredCredentialKey?: string | null;
}

export interface EventInput {
  title: string;
  description?: string;
  location?: string;
  startsAt: string;
  endsAt: string;
  kindId: number;
  attendeeCap?: number | null;
  hidden?: boolean;
  positions?: EventPositionInput[];
}

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly graph: CredentialGraphService,
    private readonly audit: AuditService,
    private readonly gcal: GoogleCalendarService,
  ) {}

  list(opts: { from?: string; to?: string; includeHidden?: boolean }) {
    return this.prisma.event.findMany({
      where: {
        ...(opts.includeHidden ? {} : { hidden: false }),
        startsAt: {
          ...(opts.from ? { gte: new Date(opts.from) } : {}),
          ...(opts.to ? { lte: new Date(opts.to) } : {}),
        },
      },
      include: {
        kind: true,
        positions: true,
        _count: { select: { signups: true } },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  async get(eventId: number, viewerId?: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        kind: true,
        positions: true,
        signups: {
          include: {
            member: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
    if (!event) throw new NotFoundException('Event not found');

    let eligiblePositions: string[] = [];
    let myPosition: string | null | undefined;
    if (viewerId) {
      const held = await this.graph.heldKeys(viewerId);
      eligiblePositions = (
        await Promise.all(
          event.positions.map(async (p) => {
            const filled = event.signups.filter(
              (s) => s.position === p.position,
            ).length;
            if (filled >= p.count) return null;
            if (
              p.requiredCredentialKey &&
              !(await this.graph.satisfies(held, p.requiredCredentialKey))
            ) {
              return null;
            }
            return p.position;
          }),
        )
      ).filter((p): p is string => !!p);
      myPosition = event.signups.find((s) => s.member.id === viewerId)
        ?.position;
    }

    return { ...event, eligiblePositions, myPosition };
  }

  async create(auth: AuthContext, input: EventInput) {
    const event = await this.prisma.event.create({
      data: {
        title: input.title,
        description: input.description,
        location: input.location,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        kindId: input.kindId,
        attendeeCap: input.attendeeCap ?? null,
        hidden: input.hidden ?? false,
        positions: {
          create: (input.positions ?? []).map((p) => ({
            position: p.position,
            count: p.count,
            requiredCredentialKey: p.requiredCredentialKey ?? null,
          })),
        },
      },
      include: { positions: true },
    });
    await this.audit.log(auth, 'events.create', 'Event', event.id);
    if (!event.hidden) {
      const gcalEventId = await this.gcal.upsertEvent(null, event);
      if (gcalEventId) {
        return this.prisma.event.update({
          where: { id: event.id },
          data: { gcalEventId },
          include: { positions: true },
        });
      }
    }
    return event;
  }

  async update(auth: AuthContext, eventId: number, input: Partial<EventInput>) {
    const existing = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existing) throw new NotFoundException('Event not found');

    const event = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.startsAt ? { startsAt: new Date(input.startsAt) } : {}),
        ...(input.endsAt ? { endsAt: new Date(input.endsAt) } : {}),
        ...(input.kindId !== undefined ? { kindId: input.kindId } : {}),
        ...(input.attendeeCap !== undefined
          ? { attendeeCap: input.attendeeCap }
          : {}),
        ...(input.hidden !== undefined ? { hidden: input.hidden } : {}),
      },
    });
    if (input.positions) {
      await this.prisma.eventPosition.deleteMany({ where: { eventId } });
      await this.prisma.eventPosition.createMany({
        data: input.positions.map((p) => ({
          eventId,
          position: p.position,
          count: p.count,
          requiredCredentialKey: p.requiredCredentialKey ?? null,
        })),
      });
    }
    await this.audit.log(auth, 'events.update', 'Event', eventId);
    const gcalEventId = await this.gcal.upsertEvent(event.gcalEventId, event);
    if (gcalEventId && gcalEventId !== event.gcalEventId) {
      await this.prisma.event.update({
        where: { id: eventId },
        data: { gcalEventId },
      });
    }
    return event;
  }

  async setLocked(auth: AuthContext, eventId: number, locked: boolean) {
    await this.prisma.event.update({ where: { id: eventId }, data: { locked } });
    await this.audit.log(auth, 'events.lock', 'Event', eventId, { locked });
    return { ok: true };
  }

  async remove(auth: AuthContext, eventId: number) {
    const event = await this.prisma.event.delete({ where: { id: eventId } });
    if (event.gcalEventId) {
      await this.gcal.deleteEvent(event.gcalEventId);
    }
    await this.audit.log(auth, 'events.delete', 'Event', eventId);
    return { ok: true };
  }

  // -------------------------------------------------------------- signups

  async signup(
    memberId: number,
    eventId: number,
    position: string | null,
    opts: { override?: boolean } = {},
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { positions: true, signups: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.locked && !opts.override) {
      throw new ForbiddenException('Signups for this event are locked');
    }

    if (position) {
      const posDef = event.positions.find((p) => p.position === position);
      if (!posDef) throw new BadRequestException('No such position');
      const filled = event.signups.filter(
        (s) => s.position === position && s.memberId !== memberId,
      ).length;
      if (filled >= posDef.count) {
        throw new ConflictException('That position is full');
      }
      if (posDef.requiredCredentialKey && !opts.override) {
        const held = await this.graph.heldKeys(memberId);
        if (!(await this.graph.satisfies(held, posDef.requiredCredentialKey))) {
          throw new ForbiddenException(
            `Requires ${posDef.requiredCredentialKey} credential`,
          );
        }
      }
    } else {
      // plain attendee pool
      if (event.attendeeCap === -1) {
        throw new ForbiddenException('This event is closed to signups');
      }
      const attendees = event.signups.filter(
        (s) => !s.position && s.memberId !== memberId,
      ).length;
      if (
        event.attendeeCap != null &&
        event.attendeeCap > 0 &&
        attendees >= event.attendeeCap &&
        !opts.override
      ) {
        throw new ConflictException('Event is full');
      }
    }

    return this.prisma.eventSignup.upsert({
      where: { eventId_memberId: { eventId, memberId } },
      create: { eventId, memberId, position },
      update: { position },
    });
  }

  async drop(memberId: number, eventId: number) {
    await this.prisma.eventSignup.deleteMany({
      where: { eventId, memberId },
    });
    return { ok: true };
  }

  async dropOther(auth: AuthContext, eventId: number, memberId: number) {
    await this.prisma.eventSignup.deleteMany({ where: { eventId, memberId } });
    await this.audit.log(auth, 'events.drop-other', 'EventSignup', undefined, {
      eventId,
      memberId,
    });
    return { ok: true };
  }

  listKinds() {
    return this.prisma.eventKind.findMany({ where: { active: true } });
  }

  createKind(name: string, defaults?: Record<string, unknown>) {
    return this.prisma.eventKind.create({
      data: { name, defaults: defaults as object | undefined },
    });
  }

  updateKind(
    id: number,
    data: Partial<{ name: string; defaults: Record<string, unknown>; active: boolean }>,
  ) {
    return this.prisma.eventKind.update({
      where: { id },
      data: { ...data, defaults: data.defaults as object | undefined },
    });
  }
}
