import { Injectable, Logger } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from './slack.service';

export interface SlackWorkspaceUser {
  id: string;
  email: string | null;
  name: string;
}

export interface LinkProposal {
  memberId: number;
  memberName: string;
  memberEmail: string;
  slackId: string;
  slackName: string;
  /** Which address matched, since a personal one is worth seeing. */
  matchedOn: 'portal email' | 'personal email';
}

/**
 * Tying Slack accounts to member records.
 *
 * Without the link three things degrade silently: a member gets no Slack
 * direct messages however their notification settings read, the nightly crew
 * post names them instead of mentioning them, and a chore they press Done on
 * is recorded with nobody's name against it. Silently is the problem — hence
 * the count on the settings page as much as the matching itself.
 */
@Injectable()
export class SlackLinkService {
  private readonly logger = new Logger(SlackLinkService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slack: SlackService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Everyone in the workspace, following Slack's paging.
   *
   * Bots and deactivated accounts are dropped: neither is a person who can be
   * sent a shift reminder.
   */
  async workspaceUsers(): Promise<SlackWorkspaceUser[]> {
    const { botToken } = await this.slack.settings();
    if (!botToken) return [];

    const users: SlackWorkspaceUser[] = [];
    let cursor: string | undefined;
    do {
      const url = new URL('https://slack.com/api/users.list');
      url.searchParams.set('limit', '200');
      if (cursor) url.searchParams.set('cursor', cursor);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${botToken}` },
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        members?: Array<{
          id: string;
          deleted?: boolean;
          is_bot?: boolean;
          real_name?: string;
          name?: string;
          profile?: { email?: string };
        }>;
        response_metadata?: { next_cursor?: string };
      };
      if (!data.ok) {
        this.logger.error(`slack users.list failed: ${data.error}`);
        // A missing users:read.email scope is the usual cause, and returning
        // nothing is honest: no matches rather than wrong ones.
        return users;
      }
      for (const user of data.members ?? []) {
        if (user.deleted || user.is_bot || user.id === 'USLACKBOT') continue;
        users.push({
          id: user.id,
          email: user.profile?.email?.toLowerCase() ?? null,
          name: user.real_name || user.name || user.id,
        });
      }
      cursor = data.response_metadata?.next_cursor || undefined;
    } while (cursor);
    return users;
  }

  /** Active members with no Slack account against them. */
  unlinked() {
    return this.prisma.member.findMany({
      where: { active: true, slackId: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        personalEmail: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  async counts() {
    const [linked, unlinked] = await Promise.all([
      this.prisma.member.count({ where: { active: true, slackId: { not: null } } }),
      this.prisma.member.count({ where: { active: true, slackId: null } }),
    ]);
    return { linked, unlinked };
  }

  /**
   * What matching on email would do, without doing it.
   *
   * Shown before it is applied because this writes to member records in bulk
   * off somebody else's data: a workspace where two people share an address,
   * or where an address was reused, should be seen rather than discovered.
   */
  async proposals(): Promise<LinkProposal[]> {
    const [users, members] = await Promise.all([
      this.workspaceUsers(),
      this.unlinked(),
    ]);
    const byEmail = new Map<string, SlackWorkspaceUser>();
    for (const user of users) {
      if (user.email && !byEmail.has(user.email)) byEmail.set(user.email, user);
    }

    const taken = new Set(
      (
        await this.prisma.member.findMany({
          where: { slackId: { not: null } },
          select: { slackId: true },
        })
      ).map((row) => row.slackId!),
    );

    const out: LinkProposal[] = [];
    for (const member of members) {
      const portal = member.email?.toLowerCase();
      const personal = member.personalEmail?.toLowerCase();
      const match =
        (portal && byEmail.get(portal)) || (personal && byEmail.get(personal));
      if (!match || taken.has(match.id)) continue;
      // One Slack account cannot stand for two members.
      taken.add(match.id);
      out.push({
        memberId: member.id,
        memberName: `${member.firstName} ${member.lastName}`,
        memberEmail: member.email,
        slackId: match.id,
        slackName: match.name,
        matchedOn:
          portal && byEmail.get(portal) ? 'portal email' : 'personal email',
      });
    }
    return out;
  }

  /** Writes the links an administrator confirmed. */
  async apply(
    auth: AuthContext,
    pairs: Array<{ memberId: number; slackId: string }>,
  ) {
    let linked = 0;
    for (const pair of pairs) {
      const clash = await this.prisma.member.findFirst({
        where: { slackId: pair.slackId, id: { not: pair.memberId } },
        select: { id: true },
      });
      // Skip rather than fail the batch: one collision should not undo
      // twenty good links.
      if (clash) {
        this.logger.warn(
          `slack link: ${pair.slackId} already belongs to member ${clash.id}`,
        );
        continue;
      }
      await this.prisma.member.update({
        where: { id: pair.memberId },
        data: { slackId: pair.slackId },
      });
      linked += 1;
    }
    await this.audit.log(auth, 'slack.link', 'Member', undefined, {
      linked,
      requested: pairs.length,
    });
    return { linked, skipped: pairs.length - linked };
  }

  /**
   * Links whoever ran /linkme, using the email Slack holds for them.
   *
   * Self-service and safe: the proof is Slack's own record of the account's
   * address, not something the member typed.
   */
  async linkBySlackUser(slackUserId: string): Promise<string> {
    const { botToken } = await this.slack.settings();
    if (!botToken) return 'Slack is not configured here yet.';

    const existing = await this.prisma.member.findFirst({
      where: { slackId: slackUserId },
      select: { firstName: true, lastName: true },
    });
    if (existing) {
      return `You are already linked to ${existing.firstName} ${existing.lastName}.`;
    }

    const res = await fetch(
      `https://slack.com/api/users.info?user=${encodeURIComponent(slackUserId)}`,
      { headers: { Authorization: `Bearer ${botToken}` } },
    );
    const data = (await res.json()) as {
      ok: boolean;
      error?: string;
      user?: { profile?: { email?: string } };
    };
    const email = data.user?.profile?.email?.toLowerCase();
    if (!data.ok || !email) {
      return data.error === 'missing_scope'
        ? 'This app cannot read Slack profile emails yet — ask an officer to add the users:read.email scope.'
        : 'Slack did not give an email for your account, so there is nothing to match on. Ask an officer to link you.';
    }

    const member = await this.prisma.member.findFirst({
      where: {
        active: true,
        slackId: null,
        OR: [{ email }, { personalEmail: email }],
      },
      select: { id: true, firstName: true, lastName: true },
    });
    if (!member) {
      return `No member record matches ${email}. Ask an officer to link you, or add that address to your profile.`;
    }

    await this.prisma.member.update({
      where: { id: member.id },
      data: { slackId: slackUserId },
    });
    await this.audit.log('system', 'slack.link.self', 'Member', member.id, {
      slackId: slackUserId,
      email,
    });
    return `Linked to ${member.firstName} ${member.lastName}. You will get portal messages here from now on.`;
  }
}
