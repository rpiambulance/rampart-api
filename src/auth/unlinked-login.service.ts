import { Injectable, Logger } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

/** What the task is about, so linking closes every officer's copy at once. */
const SUBJECT = 'UnlinkedLogin';

/**
 * Somebody who got through Keycloak and matched no member.
 *
 * Until now this was a dead end nobody was told about: the person saw a page
 * saying their account was not linked, and no officer heard a thing. They
 * could sit locked out indefinitely while everyone assumed they were fine.
 *
 * Reported once per login, not once per request — the guard runs on every
 * call, and a person refreshing a page is not news arriving repeatedly.
 */
@Injectable()
export class UnlinkedLoginService {
  private readonly logger = new Logger(UnlinkedLoginService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Records the attempt, and tells the officers the first time.
   *
   * Never throws: this runs inside the auth guard on a request that is about
   * to be refused anyway, and failing to record it must not turn a clear
   * "your account is not linked" into a 500.
   */
  async record(subject: string, email?: string, name?: string): Promise<void> {
    try {
      const existing = await this.prisma.unlinkedLogin.findUnique({
        where: { keycloakSubject: subject },
      });
      if (existing) {
        await this.prisma.unlinkedLogin.update({
          where: { id: existing.id },
          data: { lastSeenAt: new Date(), attempts: { increment: 1 } },
        });
        // Already reported, unless somebody resolved it and they are back —
        // which is worth saying again, because it did not work.
        if (!existing.resolvedAt) return;
        await this.prisma.unlinkedLogin.update({
          where: { id: existing.id },
          data: { resolvedAt: null, resolvedById: null },
        });
        await this.announce(existing.id, email, name, true);
        return;
      }

      const created = await this.prisma.unlinkedLogin.create({
        data: {
          keycloakSubject: subject,
          email: email ?? null,
          name: name ?? null,
        },
      });
      await this.announce(created.id, email, name, false);
    } catch (error) {
      this.logger.error(`Could not record an unlinked login: ${error}`);
    }
  }

  private async announce(
    id: number,
    email: string | undefined,
    name: string | undefined,
    again: boolean,
  ) {
    const who = name
      ? `${name} (${email ?? 'no address'})`
      : (email ?? 'Someone');
    await this.notifications.notifyPermissionHolders(
      PERMISSIONS.MEMBERS_WRITE,
      {
        type: 'member.unlinked-login',
        subject: `${who} signed in with no member record`,
        body:
          `${who} has a working login but nothing on the roster matches it, so ` +
          'they cannot see anything. Either they are new and need adding, or ' +
          'their record has a different email address on it — linking is by ' +
          'address.' +
          (again ? ' This was marked linked before and has come back.' : '') +
          ' Whoever sorts it out closes this for everyone.',
        task: {
          actionLabel: 'Link this account',
          actionUrl: '/admin/members/unlinked',
        },
        about: { type: SUBJECT, id },
      },
    );
  }

  /** Everything still waiting on somebody. */
  outstanding() {
    return this.prisma.unlinkedLogin.findMany({
      where: { resolvedAt: null },
      orderBy: { firstSeenAt: 'asc' },
    });
  }

  /**
   * Marks one dealt with, closing the task in every officer's inbox.
   *
   * Called both when an officer links the account by hand and when the guard
   * finds the login has started matching a member on its own.
   */
  async resolve(id: number, byMemberId: number | null, memberId?: number) {
    const row = await this.prisma.unlinkedLogin.findUnique({ where: { id } });
    if (!row || row.resolvedAt) return;
    await this.prisma.unlinkedLogin.update({
      where: { id },
      data: {
        resolvedAt: new Date(),
        resolvedById: byMemberId,
        resolvedMemberId: memberId ?? null,
      },
    });
    await this.notifications.completeTasksAbout(
      { type: SUBJECT, id },
      byMemberId,
    );
  }

  /** The same, keyed on the login rather than the row. */
  async resolveBySubject(subject: string, byMemberId: number | null) {
    const row = await this.prisma.unlinkedLogin.findUnique({
      where: { keycloakSubject: subject },
    });
    if (row) await this.resolve(row.id, byMemberId);
  }

  /** Links a waiting login to a member, which is what the task asks for. */
  async link(auth: AuthContext, id: number, memberId: number) {
    const row = await this.prisma.unlinkedLogin.findUniqueOrThrow({
      where: { id },
    });
    await this.prisma.member.update({
      where: { id: memberId },
      data: { keycloakSubject: row.keycloakSubject },
    });
    await this.resolve(
      id,
      auth.kind === 'member' ? auth.memberId : null,
      memberId,
    );
    await this.audit.log(auth, 'members.link-login', 'Member', memberId, {
      keycloakSubject: row.keycloakSubject,
      email: row.email,
    });
    return { ok: true };
  }
}
