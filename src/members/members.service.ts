import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { KeycloakAdminService } from '../integrations/keycloak-admin.service';
import { nyDayStart, toDbDate } from '../common/dates';
import { normalizePhone } from '../common/phone';
import { grantObserver } from '../credentials/observer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly keycloak: KeycloakAdminService,
  ) {}

  list(includeInactive = false) {
    return this.prisma.member.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        cellPhone: true,
        active: true,
        nineHundredNumber: true,
        credentials: {
          where: { status: 'ACTIVE' },
          select: { title: true, type: { select: { key: true, name: true } } },
        },
      },
    });
  }

  async get(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        credentials: { include: { type: true } },
        certifications: { include: { type: true, documents: true } },
      },
    });
    if (!member) throw new NotFoundException(`Member ${id} not found`);
    return member;
  }

  async create(
    auth: AuthContext,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      dob?: string;
      personalEmail?: string;
      cellPhone?: string;
      localAddress?: string;
      homeAddress?: string;
      rcsId?: string;
      nineHundredNumber?: string;
      rin?: string;
      keycloakSubject?: string;
    },
  ) {
    let keycloakSubject = data.keycloakSubject ?? null;
    if (!keycloakSubject) {
      keycloakSubject = await this.keycloak.provisionUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }
    const member = await this.prisma.member.create({
      data: {
        ...data,
        cellPhone: normalizePhone(data.cellPhone),
        keycloakSubject,
        dob: data.dob ? new Date(data.dob) : null,
      },
    });
    // Every member starts at the floor of the ladder.
    await grantObserver(this.prisma, member.id);
    await this.audit.log(auth, 'members.create', 'Member', member.id);
    return member;
  }

  /**
   * Active members with no night crew or event participation on or after
   * `since`. The window deliberately runs to the end of time, so anyone
   * already scheduled ahead is treated as participating and never appears —
   * which also means a deactivation from this list can never orphan a future
   * assignment.
   */
  async inactivityReview(since: string, excludeMemberId?: number) {
    // The two columns are not the same kind of thing: a crew's date is a
    // calendar day, an event's startsAt is an instant. Comparing both against
    // one value would move the cutoff by the UTC offset on one of them.
    const [recentCrew, recentEvent] = await Promise.all([
      this.prisma.crewSlot.findMany({
        where: {
          memberId: { not: null },
          crew: { date: { gte: toDbDate(since) } },
        },
        select: { memberId: true },
        distinct: ['memberId'],
      }),
      this.prisma.eventSignup.findMany({
        where: { event: { startsAt: { gte: nyDayStart(since) } } },
        select: { memberId: true },
        distinct: ['memberId'],
      }),
    ]);
    const participated = new Set<number>([
      ...recentCrew.map((r) => r.memberId!),
      ...recentEvent.map((r) => r.memberId),
    ]);

    const candidates = await this.prisma.member.findMany({
      where: {
        active: true,
        id: {
          notIn: [...participated, ...(excludeMemberId ? [excludeMemberId] : [])],
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });
    const ids = candidates.map((c) => c.id);

    // Last participation of any kind, for context in the review.
    const [crewHistory, eventHistory] = await Promise.all([
      this.prisma.crewSlot.findMany({
        where: { memberId: { in: ids } },
        select: { memberId: true, crew: { select: { date: true } } },
      }),
      this.prisma.eventSignup.findMany({
        where: { memberId: { in: ids } },
        select: { memberId: true, event: { select: { startsAt: true } } },
      }),
    ]);
    const lastSeen = new Map<number, Date>();
    const note = (memberId: number, at: Date) => {
      const current = lastSeen.get(memberId);
      if (!current || at > current) lastSeen.set(memberId, at);
    };
    for (const row of crewHistory) note(row.memberId!, row.crew.date);
    for (const row of eventHistory) note(row.memberId, row.event.startsAt);

    return candidates.map((c) => ({
      ...c,
      lastParticipation: lastSeen.get(c.id)?.toISOString() ?? null,
      /** Joined after the cutoff, so they never had the chance to take part. */
      joinedAfterCutoff: c.createdAt >= nyDayStart(since),
    }));
  }

  /** Deactivates an explicitly chosen set of members. */
  async deactivateMany(ids: number[], auth: AuthContext, reason: string) {
    const actingMemberId = auth.kind === 'member' ? auth.memberId : undefined;
    // Never let a review sweep up the person running it.
    const targets = await this.prisma.member.findMany({
      where: {
        id: { in: ids.filter((id) => id !== actingMemberId) },
        active: true,
      },
      select: { id: true, firstName: true, lastName: true },
    });
    for (const target of targets) {
      await this.prisma.member.update({
        where: { id: target.id },
        data: { active: false },
      });
      await this.audit.log(auth, 'members.deactivate', 'Member', target.id, {
        reason,
        via: 'inactivity-review',
      });
    }
    return {
      deactivated: targets.length,
      members: targets.map((t) => `${t.firstName} ${t.lastName}`),
    };
  }

  async update(
    id: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      dob: string;
      personalEmail: string;
      cellPhone: string;
      homePhone: string;
      localAddress: string;
      homeAddress: string;
      navLayout: string;
      eventView: string;
      timeFormat: string;
      rcsId: string;
      nineHundredNumber: string;
      rin: string;
      keycloakSubject: string;
      active: boolean;
    }>,
    auth?: AuthContext,
  ) {
    const member = await this.prisma.member.update({
      where: { id },
      data: {
        ...data,
        // Undefined means "leave alone"; normalizePhone preserves that.
        cellPhone: normalizePhone(data.cellPhone),
        homePhone: normalizePhone(data.homePhone),
        dob: data.dob ? new Date(data.dob) : undefined,
      },
    });
    if (auth) {
      await this.audit.log(auth, 'members.update', 'Member', id, data);
    }
    return member;
  }
}
