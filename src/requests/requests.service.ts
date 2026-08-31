import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { normalizeEmail } from '../common/email';
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { MembersService } from '../members/members.service';
import { displayName } from '../common/name';

/**
 * The profile fields a member cannot change for themselves.
 *
 * Name and portal email are identity: the email is what a login is matched
 * on, and a member editing it would lock themselves out. Locked is not the
 * same as unchangeable though — people marry, and "email an officer" is a
 * worse process than one that leaves a record.
 */
export const REQUESTABLE_FIELDS = {
  firstName: 'Legal first name',
  lastName: 'Last name',
  email: 'Portal email',
} as const;

export type RequestableField = keyof typeof REQUESTABLE_FIELDS;

export function isRequestableField(value: string): value is RequestableField {
  return value in REQUESTABLE_FIELDS;
}

/**
 * A stored date-of-birth as the calendar day it names.
 *
 * The column is a DATE, so the Date it comes back as sits at UTC midnight;
 * taking the ISO date part gives back exactly the day that was entered,
 * where local formatting could shift it a day either way.
 */
function toDateOnly(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

/** Unambiguous by eye and by phone: no O/0, I/1, or similar. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateInviteCode(bytes = randomBytes(8)): string {
  return [...bytes]
    .map((byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length])
    .join('');
}

/** Why an invite code is not usable, or null when it is. */
export function inviteProblem(
  invite: {
    closedAt: Date | null;
    expiresAt: Date | null;
    maxUses: number | null;
    uses: number;
  } | null,
  now = new Date(),
): string | null {
  if (!invite) return 'That invite code is not one of ours.';
  if (invite.closedAt) return 'That invite code has been closed.';
  if (invite.expiresAt && invite.expiresAt < now) {
    return 'That invite code has expired.';
  }
  if (invite.maxUses !== null && invite.uses >= invite.maxUses) {
    return 'That invite code has been used as many times as it allows.';
  }
  return null;
}

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
    private readonly members: MembersService,
  ) {}

  // ------------------------------------------------- profile change requests

  async requestProfileChange(
    auth: AuthContext,
    input: { field: string; requestedValue: string; reason?: string },
  ) {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('This endpoint requires a member session');
    }
    if (!isRequestableField(input.field)) {
      throw new BadRequestException(
        `${input.field} is not a field you have to ask about.`,
      );
    }
    const value = input.requestedValue.trim();
    if (!value) throw new BadRequestException('Say what it should be.');

    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: auth.memberId },
      select: {
        firstName: true,
        preferredFirstName: true,
        lastName: true,
        email: true,
      },
    });
    const current = member[input.field];
    if (current === value) {
      throw new BadRequestException(
        `That is already your ${REQUESTABLE_FIELDS[input.field].toLowerCase()}.`,
      );
    }

    const request = await this.prisma.profileChangeRequest.create({
      data: {
        memberId: auth.memberId,
        field: input.field,
        currentValue: current,
        requestedValue: value,
        reason: input.reason?.trim() || null,
      },
    });

    await this.notifications.notifyPermissionHolders(
      PERMISSIONS.MEMBERS_WRITE,
      {
        type: 'profile.change-requested',
        subject: `${displayName(member)} asked to change their ${REQUESTABLE_FIELDS[input.field].toLowerCase()}`,
        body:
          `From "${current ?? 'blank'}" to "${value}".` +
          (input.reason?.trim() ? `\n\n"${input.reason.trim()}"` : '') +
          '\n\nWhoever deals with it closes this for everyone.',
        task: {
          actionLabel: 'Review the request',
          actionUrl: '/admin/members/requests',
        },
        about: { type: 'ProfileChangeRequest', id: request.id },
      },
    );
    return request;
  }

  pendingProfileChanges() {
    return this.prisma.profileChangeRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  myProfileChanges(memberId: number) {
    return this.prisma.profileChangeRequest.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  /**
   * Approving applies the change; declining explains why.
   *
   * The value is re-read from the request rather than resent by the client,
   * so what is applied is what was asked for and reviewed.
   */
  async decideProfileChange(
    auth: AuthContext,
    id: number,
    approve: boolean,
    note?: string,
  ) {
    const request = await this.prisma.profileChangeRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('No such request');
    if (request.status !== 'PENDING') {
      throw new BadRequestException('That one has already been decided.');
    }
    if (!isRequestableField(request.field)) {
      throw new BadRequestException('That request names a field nobody edits.');
    }

    if (approve) {
      const value =
        request.field === 'email'
          ? normalizeEmail(request.requestedValue)
          : request.requestedValue;
      // The email is unique and is what a login matches on, so a clash has to
      // be a refusal rather than a constraint violation at the far end.
      if (request.field === 'email') {
        const taken = await this.prisma.member.findFirst({
          where: {
            email: { equals: value, mode: 'insensitive' },
            id: { not: request.memberId },
          },
          select: { firstName: true, preferredFirstName: true, lastName: true },
        });
        if (taken) {
          throw new BadRequestException(
            `${displayName(taken)} already has that address.`,
          );
        }
      }
      await this.prisma.member.update({
        where: { id: request.memberId },
        data: { [request.field]: value },
      });
    }

    const decidedById = auth.kind === 'member' ? auth.memberId : null;
    const updated = await this.prisma.profileChangeRequest.update({
      where: { id },
      data: {
        status: approve ? 'APPROVED' : 'DECLINED',
        decidedAt: new Date(),
        decidedById,
        decisionNote: note?.trim() || null,
      },
    });
    await this.notifications.completeTasksAbout(
      { type: 'ProfileChangeRequest', id },
      decidedById,
    );
    await this.notifications.notify(request.memberId, {
      type: 'profile.change-decided',
      subject: approve
        ? `Your ${REQUESTABLE_FIELDS[request.field].toLowerCase()} has been changed`
        : `Your request to change your ${REQUESTABLE_FIELDS[request.field].toLowerCase()} was declined`,
      body: approve
        ? `It is now "${request.requestedValue}".` +
          (request.field === 'email'
            ? ' Sign in with the new address from now on.'
            : '')
        : `It stays "${request.currentValue ?? 'blank'}".` +
          (note?.trim() ? `\n\n"${note.trim()}"` : ''),
    });
    await this.audit.log(
      auth,
      'members.profile-change.decide',
      'Member',
      request.memberId,
      {
        field: request.field,
        approve,
      },
    );
    return updated;
  }

  // ------------------------------------------------------------ invite codes

  async createInvite(
    auth: AuthContext,
    input: { label?: string; maxUses?: number; expiresAt?: string },
  ) {
    const invite = await this.prisma.inviteCode.create({
      data: {
        code: generateInviteCode(),
        label: input.label?.trim() || null,
        maxUses: input.maxUses ?? null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        createdById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.audit.log(auth, 'invites.create', 'InviteCode', undefined, {
      code: invite.code,
      label: invite.label,
    });
    return invite;
  }

  listInvites() {
    return this.prisma.inviteCode.findMany({
      include: {
        createdBy: {
          select: { firstName: true, preferredFirstName: true, lastName: true },
        },
        _count: { select: { requests: true } },
      },
      orderBy: [{ closedAt: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async closeInvite(auth: AuthContext, code: string) {
    const invite = await this.prisma.inviteCode.findUnique({ where: { code } });
    if (!invite) throw new NotFoundException('No such invite code');
    if (invite.closedAt) return invite;
    const updated = await this.prisma.inviteCode.update({
      where: { code },
      data: {
        closedAt: new Date(),
        closedById: auth.kind === 'member' ? auth.memberId : null,
      },
    });
    await this.audit.log(auth, 'invites.close', 'InviteCode', undefined, {
      code,
    });
    return updated;
  }

  /** Whether a code will be accepted, without spending it. */
  async checkInvite(code: string) {
    const invite = await this.prisma.inviteCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
    const problem = inviteProblem(invite);
    return { ok: !problem, problem, label: invite?.label ?? null };
  }

  // -------------------------------------------------------- account requests

  /**
   * Somebody asking to be let in.
   *
   * Public, and the only unauthenticated way to reach the roster — so the
   * code is checked, spent, and the request recorded, but nobody is notified
   * here. That happens once a day; see RequestsJobs.
   */
  async requestAccount(input: {
    inviteCode: string;
    firstName: string;
    lastName: string;
    email: string;
    preferredFirstName?: string;
    personalEmail?: string;
    cellPhone?: string;
    homePhone?: string;
    localAddress?: string;
    homeAddress?: string;
    dob?: string;
    note?: string;
  }) {
    const code = input.inviteCode.trim().toUpperCase();
    const invite = await this.prisma.inviteCode.findUnique({ where: { code } });
    const problem = inviteProblem(invite);
    if (problem) throw new BadRequestException(problem);

    const email = normalizeEmail(input.email);
    const existingMember = await this.prisma.member.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existingMember) {
      throw new BadRequestException(
        'There is already an account for that email address. Try signing in, ' +
          'or ask an officer if you cannot get in.',
      );
    }
    const alreadyAsked = await this.prisma.accountRequest.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        status: 'PENDING',
      },
    });
    if (alreadyAsked) {
      throw new BadRequestException(
        'We already have a request from that address waiting to be looked at.',
      );
    }

    const request = await this.prisma.accountRequest.create({
      data: {
        inviteCode: code,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        preferredFirstName: input.preferredFirstName?.trim() || null,
        personalEmail: input.personalEmail?.trim()
          ? normalizeEmail(input.personalEmail)
          : null,
        cellPhone: input.cellPhone?.trim() || null,
        homePhone: input.homePhone?.trim() || null,
        localAddress: input.localAddress?.trim() || null,
        homeAddress: input.homeAddress?.trim() || null,
        // Same handling as the roster's own form, so a date entered here and
        // a date entered there land on the same day.
        dob: input.dob ? new Date(input.dob) : null,
        note: input.note?.trim() || null,
      },
    });
    await this.prisma.inviteCode.update({
      where: { code },
      data: { uses: { increment: 1 } },
    });
    return { id: request.id };
  }

  pendingAccountRequests() {
    return this.prisma.accountRequest.findMany({
      where: { status: 'PENDING' },
      include: { invite: { select: { code: true, label: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Approving, declining, or recording that a member was made from it.
   *
   * Approving creates the member from what was asked for, because the point
   * of collecting their details on the request form was that nobody should
   * have to retype them. An officer can still hand in an existing `memberId`
   * — for somebody already on the roster — and then nothing is created.
   *
   * Two things can stop the creation, and both are answers rather than
   * failures: a date of birth the request never captured (optional there,
   * required on a member) and a name already on the roster. Each comes back
   * as a question the review page can put to the officer.
   */
  async decideAccountRequest(
    auth: AuthContext,
    id: number,
    approve: boolean,
    opts: {
      memberId?: number;
      note?: string;
      /** Supplied by the officer when the request itself carried none. */
      dob?: string;
      confirmDuplicateName?: boolean;
    } = {},
  ) {
    const request = await this.prisma.accountRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('No such request');
    if (request.status !== 'PENDING') {
      throw new BadRequestException('That one has already been decided.');
    }

    let createdMemberId = opts.memberId ?? null;
    let keycloakLinked: boolean | null = null;
    if (approve && !createdMemberId) {
      const dob = opts.dob ?? toDateOnly(request.dob);
      if (!dob) {
        throw new BadRequestException(
          'This request has no date of birth, and a member record needs one. ' +
            'Add it here and approve again.',
        );
      }
      // Anything the requester left blank stays blank rather than becoming an
      // empty string, so the new member looks the same as one added by hand.
      const created = await this.members.create(auth, {
        firstName: request.firstName,
        preferredFirstName: request.preferredFirstName ?? undefined,
        lastName: request.lastName,
        email: request.email,
        dob,
        personalEmail: request.personalEmail ?? undefined,
        cellPhone: request.cellPhone ?? undefined,
        homePhone: request.homePhone ?? undefined,
        localAddress: request.localAddress ?? undefined,
        homeAddress: request.homeAddress ?? undefined,
        confirmDuplicateName: opts.confirmDuplicateName,
      });
      createdMemberId = created.id;
      keycloakLinked = created.keycloakLinked;
    }

    const updated = await this.prisma.accountRequest.update({
      where: { id },
      data: {
        status: approve ? 'APPROVED' : 'DECLINED',
        decidedAt: new Date(),
        decidedById: auth.kind === 'member' ? auth.memberId : null,
        decisionNote: opts.note?.trim() || null,
        memberId: createdMemberId,
      },
    });
    await this.audit.log(
      auth,
      'account-requests.decide',
      'AccountRequest',
      id,
      {
        approve,
        memberId: createdMemberId,
        created: !opts.memberId && !!createdMemberId,
      },
    );
    // Whether they can actually sign in is the officer's next question, so it
    // is answered here rather than left to be discovered.
    return { ...updated, keycloakLinked };
  }
}
