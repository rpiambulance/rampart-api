import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { nyNow, toDbDate } from '../common/dates';
import { PrismaService } from '../prisma/prisma.service';
import { crewBoard, type BoardSeat } from './headsup-board';
import { HeadsupEvents } from './headsup.events';

/** The two numbers the board keeps, and can be told to start again. */
export const COUNTERS = ['calls', 'mishaps'] as const;
export type Counter = (typeof COUNTERS)[number];

export function isCounter(value: string): value is Counter {
  return (COUNTERS as readonly string[]).includes(value);
}

/** Unambiguous read off a screen or a slip of paper: no O/0 or I/1. */
const TOKEN_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

export function generateDisplayToken(bytes = randomBytes(24)): string {
  return [...bytes]
    .map((byte) => TOKEN_ALPHABET[byte % TOKEN_ALPHABET.length])
    .join('');
}

export interface Board {
  date: string;
  crew: BoardSeat[];
  outOfService: { reason: string | null } | null;
  calls: number;
  mishaps: number;
  chores: string[];
  notes: { id: number; body: string }[];
}

@Injectable()
export class HeadsupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly events: HeadsupEvents,
  ) {}

  // ------------------------------------------------------------ the board

  /**
   * Everything a display shows, in one read.
   *
   * One payload rather than the five endpoints the old whiteboard called:
   * a screen that fetches its parts separately can show tonight's crew
   * beside yesterday's chores for as long as one request is slower than
   * another, and nobody standing in the bay would know which half to trust.
   */
  async board(): Promise<Board> {
    const today = nyNow().dateStr;
    const [crew, calls, mishaps, chores, notes] = await Promise.all([
      this.prisma.crew.findUnique({
        where: { date: toDbDate(today) },
        include: {
          slots: {
            include: {
              member: {
                select: {
                  firstName: true,
                  preferredFirstName: true,
                  lastName: true,
                  nineHundredNumber: true,
                },
              },
            },
          },
        },
      }),
      this.count('calls'),
      this.count('mishaps'),
      this.choresDue(today),
      this.prisma.headsupNote.findMany({
        where: { removedAt: null },
        orderBy: { createdAt: 'asc' },
        select: { id: true, body: true },
      }),
    ]);

    return {
      date: today,
      crew: crewBoard(crew?.slots ?? []),
      outOfService: crew?.outOfService
        ? { reason: crew.outOfServiceReason }
        : null,
      calls,
      mishaps,
      chores,
      notes,
    };
  }

  /** Tonight's chores, as the one line each that fits on a wall. */
  private async choresDue(dateStr: string): Promise<string[]> {
    const due = await this.prisma.choreOccurrence.findMany({
      where: { dueOn: toDbDate(dateStr), completedAt: null },
      include: { chore: { select: { name: true } } },
      orderBy: { id: 'asc' },
    });
    return due.map((occurrence) => occurrence.chore.name);
  }

  // ----------------------------------------------------------- the counters

  /** When the named counter was last started again, if it ever was. */
  private async lastReset(counter: Counter): Promise<Date | null> {
    const reset = await this.prisma.headsupCounterReset.findFirst({
      where: { counter },
      orderBy: { resetAt: 'desc' },
      select: { resetAt: true },
    });
    return reset?.resetAt ?? null;
  }

  /**
   * What a counter reads: everything since it was last cleared.
   *
   * Nothing is deleted to clear one, so this is a window over data that is
   * all still there — the same dispatches can be counted again from a
   * different point, and the season just closed is still answerable.
   */
  async count(counter: Counter): Promise<number> {
    const since = await this.lastReset(counter);
    if (counter === 'calls') {
      return this.prisma.dispatch.count({
        where: since ? { receivedAt: { gt: since } } : {},
      });
    }
    return this.prisma.dispatchMishap.count({
      where: {
        removedAt: null,
        ...(since ? { occurredAt: { gt: since } } : {}),
      },
    });
  }

  async resetCounter(auth: AuthContext, counter: Counter) {
    const previousCount = await this.count(counter);
    const reset = await this.prisma.headsupCounterReset.create({
      data: {
        counter,
        previousCount,
        resetById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.audit.log(
      auth,
      'headsup.counter.reset',
      'HeadsupCounterReset',
      reset.id,
      { counter, previousCount },
    );
    this.events.boardChanged();
    return reset;
  }

  /** Every time a counter was started again, newest first. */
  resetHistory(counter: Counter) {
    return this.prisma.headsupCounterReset.findMany({
      where: { counter },
      orderBy: { resetAt: 'desc' },
      take: 20,
      include: {
        resetBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });
  }

  // --------------------------------------------------------------- notes

  notes() {
    return this.prisma.headsupNote.findMany({
      where: { removedAt: null },
      orderBy: { createdAt: 'asc' },
      include: {
        createdBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });
  }

  async addNote(auth: AuthContext, body: string) {
    const text = body.trim();
    if (!text) throw new BadRequestException('A note needs something in it.');
    const note = await this.prisma.headsupNote.create({
      data: {
        body: text,
        createdById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    this.events.boardChanged();
    return note;
  }

  /**
   * Taking a note down.
   *
   * Anybody may, because it is a whiteboard — but it is marked removed
   * rather than deleted, so "who rubbed that out" has an answer.
   */
  async removeNote(auth: AuthContext, id: number) {
    const note = await this.prisma.headsupNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('No such note');
    if (note.removedAt) return note;
    const updated = await this.prisma.headsupNote.update({
      where: { id },
      data: {
        removedAt: new Date(),
        removedById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    this.events.boardChanged();
    return updated;
  }

  // ------------------------------------------------------------- mishaps

  mishaps() {
    return this.prisma.dispatchMishap.findMany({
      where: { removedAt: null },
      orderBy: { occurredAt: 'desc' },
      take: 100,
      include: {
        createdBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });
  }

  async addMishap(auth: AuthContext, note?: string, occurredAt?: string) {
    const mishap = await this.prisma.dispatchMishap.create({
      data: {
        note: note?.trim() || null,
        ...(occurredAt ? { occurredAt: new Date(occurredAt) } : {}),
        createdById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    this.events.boardChanged();
    return mishap;
  }

  async removeMishap(auth: AuthContext, id: number) {
    const mishap = await this.prisma.dispatchMishap.findUnique({
      where: { id },
    });
    if (!mishap) throw new NotFoundException('No such mishap');
    if (mishap.removedAt) return mishap;
    const updated = await this.prisma.dispatchMishap.update({
      where: { id },
      data: {
        removedAt: new Date(),
        removedById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    this.events.boardChanged();
    return updated;
  }

  // --------------------------------------------------------------- links

  listLinks() {
    return this.prisma.headsupLink.findMany({
      orderBy: [{ revokedAt: 'asc' }, { createdAt: 'desc' }],
      include: {
        createdBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
      },
    });
  }

  async createLink(auth: AuthContext, label?: string) {
    const link = await this.prisma.headsupLink.create({
      data: {
        token: generateDisplayToken(),
        label: label?.trim() || null,
        createdById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.audit.log(auth, 'headsup.link.create', 'HeadsupLink', link.id, {
      label: link.label,
    });
    return link;
  }

  async revokeLink(auth: AuthContext, id: number) {
    const link = await this.prisma.headsupLink.findUnique({ where: { id } });
    if (!link) throw new NotFoundException('No such display link');
    if (link.revokedAt) return link;
    const updated = await this.prisma.headsupLink.update({
      where: { id },
      data: {
        revokedAt: new Date(),
        revokedById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.audit.log(auth, 'headsup.link.revoke', 'HeadsupLink', id, {
      label: link.label,
    });
    return updated;
  }

  /**
   * The token on a display's URL, checked.
   *
   * Marks the link as seen so an admin can tell which screens are alive,
   * but only about once a minute: a display reconnecting its stream should
   * not be a write per reconnect.
   */
  async requireLink(token?: string) {
    const value = (token ?? '').trim();
    if (!value) throw new ForbiddenException('This display needs its link.');
    const link = await this.prisma.headsupLink.findUnique({
      where: { token: value },
    });
    if (!link || link.revokedAt) {
      throw new ForbiddenException('That display link is not in use.');
    }
    const aMinuteAgo = new Date(Date.now() - 60_000);
    if (!link.lastSeenAt || link.lastSeenAt < aMinuteAgo) {
      await this.prisma.headsupLink.update({
        where: { id: link.id },
        data: { lastSeenAt: new Date() },
      });
    }
    return link;
  }
}
