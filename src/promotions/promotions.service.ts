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
import { CredentialsService } from '../credentials/credentials.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { isDateOnly, nyNow, nyToday, toDbDate } from '../common/dates';
import { displayName } from '../common/name';

/**
 * Promotion workflow (spec §4.3): request → TC review → unanimous vote
 * (no abstentions; conflicted TC members appoint a proxy) → captain approval
 * → automatic grant. The Training Committee = members currently holding a
 * role that carries the promotions:vote permission.
 */
@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly graph: CredentialGraphService,
    private readonly credentials: CredentialsService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Members currently holding a promotions:vote role. */
  async trainingCommittee(): Promise<number[]> {
    const today = nyToday();
    const assignments = await this.prisma.memberRole.findMany({
      where: {
        startDate: { lte: today },
        OR: [{ endDate: null }, { endDate: { gte: today } }],
        member: { active: true },
        role: {
          permissions: { some: { permission: PERMISSIONS.PROMOTIONS_VOTE } },
        },
      },
      select: { memberId: true },
    });
    return [...new Set(assignments.map((a) => a.memberId))];
  }

  /** Credential types the member can currently request. */
  async eligibleRequests(memberId: number) {
    const types = await this.prisma.credentialType.findMany({
      where: { active: true, grantMethod: 'PROMOTION' },
      include: { prerequisites: { include: { requiresType: true } } },
    });
    const held = await this.graph.heldKeys(memberId);
    const open = await this.prisma.promotionRequest.findMany({
      where: {
        memberId,
        status: { in: ['PENDING', 'IN_VOTE', 'TC_APPROVED'] },
      },
      select: { credentialTypeId: true },
    });
    const openIds = new Set(open.map((r) => r.credentialTypeId));

    const out: Array<{
      credentialTypeId: number;
      key: string;
      name: string;
      checklist: Awaited<ReturnType<CredentialsService['checklist']>>;
      requestable: boolean;
    }> = [];
    for (const type of types) {
      // "or above": someone who already satisfies a credential (by holding it
      // or something above it) is not offered it again.
      if (
        (await this.graph.satisfies(held, type.key)) ||
        openIds.has(type.id)
      ) {
        continue;
      }
      let prereqsMet = true;
      for (const p of type.prerequisites) {
        if (!(await this.graph.satisfies(held, p.requiresType.key))) {
          prereqsMet = false;
          break;
        }
      }
      if (!prereqsMet) continue;
      const checklist = await this.credentials.checklist(memberId, type.id);
      out.push({
        credentialTypeId: type.id,
        key: type.key,
        name: type.name,
        checklist,
        requestable: checklist.every((i) => i.satisfied),
      });
    }
    return out;
  }

  async createRequest(memberId: number, credentialTypeId: number) {
    const eligible = await this.eligibleRequests(memberId);
    const match = eligible.find((e) => e.credentialTypeId === credentialTypeId);
    if (!match) {
      throw new BadRequestException(
        'You cannot request that credential (already held, open request, or missing prerequisites)',
      );
    }
    if (!match.requestable) {
      throw new BadRequestException('Requirement checklist is not complete');
    }
    const request = await this.prisma.promotionRequest.create({
      data: { memberId, credentialTypeId, status: 'IN_VOTE' },
    });
    // By name: an officer reading this should not have to look up an id to
    // find out who it is about.
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { firstName: true, preferredFirstName: true, lastName: true },
    });
    const who = member ? displayName(member) : `Member ${memberId}`;
    await this.notifications.notifyOfficerInboxes({
      type: 'promotion.requested',
      subject: `Promotion request: ${who} — ${match.name}`,
      body: `${who} has requested ${match.name}.`,
      task: {
        actionLabel: 'Review the request',
        actionUrl: `/promotions/${request.id}`,
      },
    });
    return request;
  }

  listRequests(status?: string) {
    return this.prisma.promotionRequest.findMany({
      where: status ? { status: status as never } : {},
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
        credentialType: true,
        votes: { where: { rescindedAt: null } },
        proxies: true,
        captainApproval: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReview(requestId: number, auth: AuthContext) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
        credentialType: true,
        meetingVote: {
          include: {
            recordedBy: {
              select: {
                id: true,
                firstName: true,
                preferredFirstName: true,
                lastName: true,
              },
            },
          },
        },
        votes: {
          orderBy: { castAt: 'asc' },
          include: {
            voter: {
              select: {
                id: true,
                firstName: true,
                preferredFirstName: true,
                lastName: true,
              },
            },
            proxyFor: {
              select: {
                id: true,
                firstName: true,
                preferredFirstName: true,
                lastName: true,
              },
            },
          },
        },
        proxies: {
          include: {
            principal: {
              select: {
                id: true,
                firstName: true,
                preferredFirstName: true,
                lastName: true,
              },
            },
            proxy: {
              select: {
                id: true,
                firstName: true,
                preferredFirstName: true,
                lastName: true,
              },
            },
          },
        },
        captainApproval: true,
      },
    });
    if (!request) throw new NotFoundException('Request not found');

    // A proxy is by definition not on the committee, so they hold none of
    // the reviewing permissions — and were refused the page they had just
    // been asked to act on. Being named on this request is the warrant.
    const mayReview = auth.permissions.has(PERMISSIONS.PROMOTIONS_REVIEW);
    const isProxy =
      auth.kind === 'member' &&
      request.proxies.some((p) => p.proxy.id === auth.memberId);
    if (!mayReview && !isProxy) {
      throw new ForbiddenException('Not yours to review');
    }

    const checklist = await this.credentials.checklist(
      request.memberId,
      request.credentialTypeId,
    );
    const evaluations = await this.prisma.evaluation.findMany({
      where: { subjectId: request.memberId, status: 'SIGNED' },
      include: {
        template: { select: { id: true, name: true } },
        evaluator: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const committee = await this.trainingCommittee();
    return { ...request, checklist, evaluations, committee };
  }

  /** A conflicted TC member appoints a proxy for one request. */
  async appointProxy(principalId: number, requestId: number, proxyId: number) {
    const committee = await this.trainingCommittee();
    if (!committee.includes(principalId)) {
      throw new ForbiddenException(
        'Only Training Committee members appoint proxies',
      );
    }
    if (committee.includes(proxyId)) {
      throw new BadRequestException(
        'The proxy must not already be a Training Committee member',
      );
    }
    if (proxyId === principalId) {
      throw new BadRequestException('You cannot proxy yourself');
    }
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.status !== 'IN_VOTE') {
      throw new BadRequestException('Request is not open for voting');
    }
    if (request.memberId === proxyId) {
      throw new BadRequestException('The requester cannot be a proxy');
    }
    // Once the seat has been voted, who holds it is settled. Changing the
    // appointment afterwards would say somebody is to vote on something
    // already decided in their name.
    if (await this.seatIsVoted(requestId, principalId)) {
      throw new BadRequestException(
        'A vote has already been cast for your seat on this request',
      );
    }

    const existing = await this.prisma.promotionProxy.findUnique({
      where: { requestId_principalId: { requestId, principalId } },
    });
    const appointment = await this.prisma.promotionProxy.upsert({
      where: { requestId_principalId: { requestId, principalId } },
      create: { requestId, principalId, proxyId },
      update: { proxyId },
    });

    if (existing && existing.proxyId !== proxyId) {
      await this.tellProxy(
        existing.proxyId,
        requestId,
        principalId,
        'stood-down',
      );
    }
    if (!existing || existing.proxyId !== proxyId) {
      await this.tellProxy(proxyId, requestId, principalId, 'appointed');
    }
    return appointment;
  }

  /**
   * Taking the appointment back.
   *
   * A conflict that turns out not to be one, or a proxy who cannot do it
   * after all: the seat returns to its own member, who can vote it or
   * appoint somebody else.
   */
  async withdrawProxy(principalId: number, requestId: number) {
    const existing = await this.prisma.promotionProxy.findUnique({
      where: { requestId_principalId: { requestId, principalId } },
    });
    if (!existing) {
      throw new NotFoundException('You have no proxy on this request');
    }
    if (await this.seatIsVoted(requestId, principalId)) {
      throw new BadRequestException(
        'A vote has already been cast for your seat on this request',
      );
    }
    await this.prisma.promotionProxy.delete({
      where: { requestId_principalId: { requestId, principalId } },
    });
    await this.tellProxy(
      existing.proxyId,
      requestId,
      principalId,
      'stood-down',
    );
    return { ok: true };
  }

  /** Has this committee seat already been voted, by anybody? */
  private async seatIsVoted(
    requestId: number,
    principalId: number,
  ): Promise<boolean> {
    const vote = await this.prisma.promotionVote.findFirst({
      where: {
        requestId,
        rescindedAt: null,
        OR: [
          { proxyForId: principalId },
          { voterId: principalId, proxyForId: null },
        ],
      },
      select: { id: true },
    });
    return !!vote;
  }

  /**
   * Telling somebody they have been asked to vote, or need not after all.
   *
   * Being appointed is the whole of what a proxy knows about it: they are
   * not on the committee, nothing in their inbox mentions promotions, and
   * the request does not appear on any list they can see. Without this they
   * would have to be told in a corridor.
   */
  private async tellProxy(
    proxyId: number,
    requestId: number,
    principalId: number,
    what: 'appointed' | 'stood-down',
  ): Promise<void> {
    const [principal, request] = await Promise.all([
      this.prisma.member.findUnique({
        where: { id: principalId },
        select: { firstName: true, preferredFirstName: true, lastName: true },
      }),
      this.prisma.promotionRequest.findUnique({
        where: { id: requestId },
        include: { credentialType: { select: { name: true } } },
      }),
    ]);
    if (!principal || !request) return;
    const who = displayName(principal);
    const credential = request.credentialType.name;

    await this.notifications.notify(proxyId, {
      type: 'promotion.proxy',
      subject:
        what === 'appointed'
          ? `${who} asked you to vote on a ${credential} promotion`
          : `No longer voting for ${who}`,
      body:
        what === 'appointed'
          ? `${who} has a conflict on this ${credential} request and appointed you to vote in their place. The committee must be unanimous, so the request waits on your vote.`
          : `${who} has taken back the proxy on the ${credential} request. There is nothing for you to do.`,
      ...(what === 'appointed'
        ? {
            task: {
              actionLabel: 'Cast the vote',
              actionUrl: `/promotions/${requestId}`,
            },
          }
        : {}),
    });
  }

  /** Cast a vote — as a TC member, or as an appointed proxy. No abstentions. */
  async vote(
    voterId: number,
    requestId: number,
    choice: 'APPROVE' | 'DENY',
    notes?: string,
  ) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
      include: {
        votes: { where: { rescindedAt: null } },
        proxies: true,
        credentialType: true,
      },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== 'IN_VOTE') {
      throw new BadRequestException('Request is not open for voting');
    }
    if (request.memberId === voterId) {
      throw new ForbiddenException('You cannot vote on your own promotion');
    }

    const committee = await this.trainingCommittee();
    const proxyFor = request.proxies.find((p) => p.proxyId === voterId);
    let principalId: number | null = null;

    if (proxyFor) {
      principalId = proxyFor.principalId;
    } else if (committee.includes(voterId)) {
      const delegated = request.proxies.find((p) => p.principalId === voterId);
      if (delegated) {
        throw new ForbiddenException(
          'You appointed a proxy for this request; the proxy votes in your place',
        );
      }
    } else {
      throw new ForbiddenException(
        'You are not eligible to vote on this request',
      );
    }

    const memberOfRecord = principalId ?? voterId;
    const already = request.votes.find(
      (v) => (v.proxyForId ?? v.voterId) === memberOfRecord,
    );
    if (already) throw new ConflictException('Vote already cast');

    await this.prisma.promotionVote.create({
      data: {
        requestId,
        voterId,
        proxyForId: principalId,
        vote: choice,
        notes,
      },
    });

    return this.tally(requestId);
  }

  /**
   * Taking a vote back, so it can be cast again.
   *
   * Only by whoever cast it — a proxy takes back the vote they cast, not the
   * member who appointed them. The vote is kept, marked as withdrawn and
   * when, so the record shows what happened rather than a seat that seems
   * to have changed its mind silently.
   *
   * Open until the captain has ruled. That includes a request a single
   * denial has already ended, because one mistaken press is all it takes to
   * end one, and that is exactly the vote somebody needs to take back. Once
   * the captain has decided, the committee's vote is history.
   */
  async rescindVote(
    voterId: number,
    requestId: number,
    voteId: number,
    note?: string,
  ) {
    const vote = await this.prisma.promotionVote.findUnique({
      where: { id: voteId },
      include: {
        request: { include: { captainApproval: true, meetingVote: true } },
      },
    });
    if (!vote || vote.requestId !== requestId) {
      throw new NotFoundException('No such vote on this request');
    }
    if (vote.voterId !== voterId) {
      throw new ForbiddenException('Only whoever cast a vote can take it back');
    }
    if (vote.rescindedAt) {
      throw new ConflictException('That vote has already been taken back');
    }

    const request = vote.request;
    // Decided in the room, the online votes are history: taking one back
    // would reopen a request the committee settled in person.
    if (request.meetingVote) {
      throw new BadRequestException(
        'The committee decided this request in person, so its online votes can no longer be taken back',
      );
    }
    const endedByTheCommittee =
      request.status === 'DENIED' && !request.captainApproval;
    if (
      request.status !== 'IN_VOTE' &&
      request.status !== 'TC_APPROVED' &&
      !endedByTheCommittee
    ) {
      throw new BadRequestException(
        'This request has been decided, so its votes can no longer be taken back',
      );
    }
    if (endedByTheCommittee) {
      // Reopening this one beside a newer request for the same credential
      // would leave the member with two being voted on at once.
      const newer = await this.prisma.promotionRequest.findFirst({
        where: {
          memberId: request.memberId,
          credentialTypeId: request.credentialTypeId,
          id: { not: request.id },
          status: { in: ['PENDING', 'IN_VOTE', 'TC_APPROVED'] },
        },
        select: { id: true },
      });
      if (newer) {
        throw new ConflictException(
          'A newer request for this credential is open; vote on that one instead',
        );
      }
    }

    await this.prisma.promotionVote.update({
      where: { id: voteId },
      data: { rescindedAt: new Date(), rescindNote: note?.trim() || null },
    });
    return this.reconsider(requestId, request.status);
  }

  /**
   * Where a request stands once a vote has been taken back.
   *
   * Taking a vote back can only undo: it cannot add a denial or fill a seat.
   * So the request returns to being voted on, unless somebody else's denial
   * still stands. A member who was told their request was denied is told it
   * is back in front of the committee — leaving them believing it is over
   * would be the one outcome worse than not reopening it.
   */
  private async reconsider(requestId: number, was: string) {
    const request = await this.prisma.promotionRequest.findUniqueOrThrow({
      where: { id: requestId },
      include: {
        votes: { where: { rescindedAt: null } },
        credentialType: true,
      },
    });
    if (request.votes.some((v) => v.vote === 'DENY')) {
      return { status: request.status };
    }

    const committee = await this.trainingCommittee();
    const covered = new Set(
      request.votes.map((v) => v.proxyForId ?? v.voterId),
    );
    const unanimous =
      committee.length > 0 && committee.every((id) => covered.has(id));
    const status = unanimous ? 'TC_APPROVED' : 'IN_VOTE';
    if (status !== request.status) {
      await this.prisma.promotionRequest.update({
        where: { id: requestId },
        data: { status, resolvedAt: null },
      });
    }
    if (was === 'DENIED') {
      await this.notifications.notify(request.memberId, {
        type: 'promotion.decided',
        subject: `${request.credentialType.name} request is back under review`,
        body: `A vote on your request for ${request.credentialType.name} was taken back, so it is no longer denied and is in front of the Training Committee again.`,
      });
    }
    return {
      status,
      votesRemaining: committee.length - covered.size,
    };
  }

  /** Recompute status after a vote: any DENY → DENIED; all covered APPROVE → TC_APPROVED. */
  private async tally(requestId: number) {
    const request = await this.prisma.promotionRequest.findUniqueOrThrow({
      where: { id: requestId },
      include: {
        votes: { where: { rescindedAt: null } },
        credentialType: true,
      },
    });
    const committee = await this.trainingCommittee();

    if (request.votes.some((v) => v.vote === 'DENY')) {
      await this.prisma.promotionRequest.update({
        where: { id: requestId },
        data: { status: 'DENIED', resolvedAt: new Date() },
      });
      await this.notifications.notify(request.memberId, {
        type: 'promotion.decided',
        subject: `${request.credentialType.name} request denied`,
        body: `Your request for ${request.credentialType.name} was denied. You may submit a new request when ready.`,
      });
      return { status: 'DENIED' };
    }

    const covered = new Set(
      request.votes.map((v) => v.proxyForId ?? v.voterId),
    );
    const unanimous =
      committee.length > 0 && committee.every((id) => covered.has(id));
    if (unanimous) {
      await this.prisma.promotionRequest.update({
        where: { id: requestId },
        data: { status: 'TC_APPROVED' },
      });
      await this.notifications.notifyOfficerInboxes({
        type: 'promotion.vote',
        subject: `${request.credentialType.name} awaiting captain approval`,
        body: `${request.credentialType.name} passed the Training Committee unanimously.`,
        task: {
          actionLabel: 'Give a decision',
          actionUrl: `/promotions/${requestId}`,
        },
      });
      return { status: 'TC_APPROVED' };
    }
    return {
      status: 'IN_VOTE',
      votesRemaining: committee.length - covered.size,
    };
  }

  /**
   * A Training Committee vote taken in person, at a meeting.
   *
   * Stands in for the committee's online vote: the request leaves the
   * committee from here exactly as it would from the last online vote. The
   * same rule decides it — unanimity, so a single denial in the room fails
   * it — and the counts are kept as they were taken.
   *
   * It does not stand in for the captain. Passing takes the request to the
   * captain like any other, unless whoever is recording it can give the
   * captain's approval and does so in the same breath; the captain's assent
   * is a separate key and stays one.
   */
  async recordMeetingVote(
    auth: AuthContext & { kind: 'member' },
    requestId: number,
    input: {
      meetingDate: string;
      approve: number;
      deny: number;
      abstain?: number;
      notes?: string;
      approveAsCaptain?: boolean;
    },
  ) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
      include: { credentialType: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== 'IN_VOTE') {
      throw new BadRequestException(
        'Only a request still in front of the committee can be decided at a meeting',
      );
    }
    if (!isDateOnly(input.meetingDate)) {
      throw new BadRequestException('The meeting date is not a date');
    }
    if (input.meetingDate > nyNow().dateStr) {
      throw new BadRequestException('The meeting has not happened yet');
    }
    const abstain = input.abstain ?? 0;
    if (input.approve + input.deny === 0) {
      throw new BadRequestException(
        'Nobody voted for or against it, so there is nothing to record',
      );
    }
    if (
      input.approveAsCaptain &&
      !auth.permissions.has(PERMISSIONS.PROMOTIONS_CAPTAIN_APPROVE)
    ) {
      throw new ForbiddenException(
        "Recording the meeting does not carry the captain's approval",
      );
    }
    const passed = input.deny === 0;
    await this.prisma.promotionMeetingVote.create({
      data: {
        requestId,
        meetingDate: toDbDate(input.meetingDate),
        approve: input.approve,
        deny: input.deny,
        abstain,
        notes: input.notes?.trim() || null,
        recordedById: auth.memberId,
      },
    });
    await this.audit.log(
      auth,
      'promotions.in-person-vote',
      'PromotionRequest',
      requestId,
      {
        meetingDate: input.meetingDate,
        approve: input.approve,
        deny: input.deny,
        abstain,
        passed,
      },
    );

    const tally = `${input.approve} for, ${input.deny} against${
      abstain ? `, ${abstain} abstaining` : ''
    }`;
    if (!passed) {
      await this.prisma.promotionRequest.update({
        where: { id: requestId },
        data: { status: 'DENIED', resolvedAt: new Date() },
      });
      await this.notifications.notify(request.memberId, {
        type: 'promotion.decided',
        subject: `${request.credentialType.name} request denied`,
        body: `The Training Committee voted on your request for ${request.credentialType.name} at its meeting (${tally}) and did not pass it. You may submit a new request when ready.`,
      });
      return { status: 'DENIED' };
    }

    await this.prisma.promotionRequest.update({
      where: { id: requestId },
      data: { status: 'TC_APPROVED' },
    });
    // Conditional by nature: asked for "if it passes", and only reached
    // when it did.
    if (input.approveAsCaptain) {
      return this.captainDecision(auth, requestId, true, input.notes);
    }
    await this.notifications.notifyOfficerInboxes({
      type: 'promotion.vote',
      subject: `${request.credentialType.name} awaiting captain approval`,
      body: `${request.credentialType.name} passed the Training Committee at its meeting (${tally}).`,
      task: {
        actionLabel: 'Give a decision',
        actionUrl: `/promotions/${requestId}`,
      },
    });
    return { status: 'TC_APPROVED' };
  }

  /** Captain's final approval — grants the credential automatically. */
  async captainDecision(
    auth: AuthContext & { kind: 'member' },
    requestId: number,
    approved: boolean,
    notes?: string,
  ) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
      include: { credentialType: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== 'TC_APPROVED') {
      throw new BadRequestException(
        'Request has not passed the Training Committee',
      );
    }

    await this.prisma.promotionApproval.create({
      data: {
        requestId,
        approvedById: auth.memberId,
        approved,
        notes,
      },
    });
    await this.prisma.promotionRequest.update({
      where: { id: requestId },
      data: {
        status: approved ? 'APPROVED' : 'DENIED',
        resolvedAt: new Date(),
      },
    });
    await this.audit.log(
      auth,
      'promotions.captain-decision',
      'PromotionRequest',
      requestId,
      {
        approved,
      },
    );

    if (approved) {
      await this.credentials.grant(
        auth,
        request.memberId,
        request.credentialTypeId,
        { grantedViaId: requestId },
      );
      await this.notifications.notify(request.memberId, {
        type: 'promotion.decided',
        subject: `Promotion approved: ${request.credentialType.name}`,
        body: `Congratulations — you are now a ${request.credentialType.name}.`,
      });
    } else {
      await this.notifications.notify(request.memberId, {
        type: 'promotion.decided',
        subject: `${request.credentialType.name} request denied`,
        body: `Your request for ${request.credentialType.name} was denied at captain review. You may submit a new request when ready.`,
      });
    }
    return { ok: true, status: approved ? 'APPROVED' : 'DENIED' };
  }

  // ---------------------------------------------- requirement adjustments

  listAdjustments(memberId: number, credentialTypeId: number) {
    return this.prisma.promotionRequirementAdjustment.findMany({
      where: { memberId, credentialTypeId },
      include: {
        requirement: {
          include: { certificationType: true, evalTemplate: true, class: true },
        },
        certificationType: true,
        evalTemplate: true,
        class: true,
        createdBy: {
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

  async createAdjustment(
    auth: AuthContext & { kind: 'member' },
    input: {
      memberId: number;
      credentialTypeId: number;
      kind: 'WAIVER' | 'ADDITIONAL';
      requirementId?: number;
      reqKind?: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS';
      certificationTypeId?: number;
      evalTemplateId?: number;
      count?: number;
      classId?: number;
      note?: string;
    },
  ) {
    if (input.kind === 'WAIVER') {
      if (!input.requirementId) {
        throw new BadRequestException('requirementId required for a waiver');
      }
      const requirement = await this.prisma.credentialRequirement.findUnique({
        where: { id: input.requirementId },
      });
      if (
        !requirement ||
        requirement.credentialTypeId !== input.credentialTypeId
      ) {
        throw new BadRequestException(
          'Requirement does not belong to that credential',
        );
      }
    } else if (input.reqKind) {
      if (input.reqKind === 'CERTIFICATION' && !input.certificationTypeId) {
        throw new BadRequestException('certificationTypeId required');
      }
      if (
        input.reqKind === 'EVALUATION_COUNT' &&
        (!input.evalTemplateId || !input.count)
      ) {
        throw new BadRequestException('evalTemplateId and count required');
      }
      if (input.reqKind === 'CLASS' && !input.classId) {
        throw new BadRequestException('classId required');
      }
    } else if (!input.note?.trim()) {
      throw new BadRequestException(
        'A free-text additional requirement needs a note',
      );
    }

    const adjustment = await this.prisma.promotionRequirementAdjustment.create({
      data: {
        memberId: input.memberId,
        credentialTypeId: input.credentialTypeId,
        kind: input.kind,
        requirementId: input.requirementId,
        reqKind: input.reqKind,
        certificationTypeId: input.certificationTypeId,
        evalTemplateId: input.evalTemplateId,
        count: input.count,
        classId: input.classId,
        note: input.note,
        createdById: auth.memberId,
      },
    });
    await this.audit.log(
      auth,
      'promotions.adjustment.create',
      'PromotionRequirementAdjustment',
      adjustment.id,
      input,
    );
    return adjustment;
  }

  async setAdjustmentSatisfied(
    auth: AuthContext,
    adjustmentId: number,
    satisfied: boolean,
  ) {
    const adjustment = await this.prisma.promotionRequirementAdjustment.update({
      where: { id: adjustmentId },
      data: { satisfiedAt: satisfied ? new Date() : null },
    });
    await this.audit.log(
      auth,
      'promotions.adjustment.satisfy',
      'PromotionRequirementAdjustment',
      adjustmentId,
      { satisfied },
    );
    return adjustment;
  }

  async removeAdjustment(auth: AuthContext, adjustmentId: number) {
    await this.prisma.promotionRequirementAdjustment.delete({
      where: { id: adjustmentId },
    });
    await this.audit.log(
      auth,
      'promotions.adjustment.remove',
      'PromotionRequirementAdjustment',
      adjustmentId,
    );
    return { ok: true };
  }

  async withdraw(memberId: number, requestId: number) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.memberId !== memberId) {
      throw new ForbiddenException('Not your request');
    }
    if (!['PENDING', 'IN_VOTE'].includes(request.status)) {
      throw new BadRequestException('Request can no longer be withdrawn');
    }
    await this.prisma.promotionRequest.update({
      where: { id: requestId },
      data: { status: 'WITHDRAWN', resolvedAt: new Date() },
    });
    return { ok: true };
  }
}
