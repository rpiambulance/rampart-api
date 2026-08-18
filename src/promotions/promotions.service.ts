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
import { nyToday } from '../common/dates';

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
      where: { memberId, status: { in: ['PENDING', 'IN_VOTE', 'TC_APPROVED'] } },
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
      select: { firstName: true, lastName: true },
    });
    const who = member ? `${member.firstName} ${member.lastName}` : `Member ${memberId}`;
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
        member: { select: { id: true, firstName: true, lastName: true } },
        credentialType: true,
        votes: true,
        proxies: true,
        captainApproval: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReview(requestId: number) {
    const request = await this.prisma.promotionRequest.findUnique({
      where: { id: requestId },
      include: {
        member: { select: { id: true, firstName: true, lastName: true } },
        credentialType: true,
        votes: {
          include: {
            voter: { select: { id: true, firstName: true, lastName: true } },
            proxyFor: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        proxies: {
          include: {
            principal: { select: { id: true, firstName: true, lastName: true } },
            proxy: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        captainApproval: true,
      },
    });
    if (!request) throw new NotFoundException('Request not found');

    const checklist = await this.credentials.checklist(
      request.memberId,
      request.credentialTypeId,
    );
    const evaluations = await this.prisma.evaluation.findMany({
      where: { subjectId: request.memberId, status: 'SIGNED' },
      include: {
        template: { select: { id: true, name: true } },
        evaluator: { select: { id: true, firstName: true, lastName: true } },
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
      throw new ForbiddenException('Only Training Committee members appoint proxies');
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
    return this.prisma.promotionProxy.upsert({
      where: { requestId_principalId: { requestId, principalId } },
      create: { requestId, principalId, proxyId },
      update: { proxyId },
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
      include: { votes: true, proxies: true, credentialType: true },
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
      throw new ForbiddenException('You are not eligible to vote on this request');
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

  /** Recompute status after a vote: any DENY → DENIED; all covered APPROVE → TC_APPROVED. */
  private async tally(requestId: number) {
    const request = await this.prisma.promotionRequest.findUniqueOrThrow({
      where: { id: requestId },
      include: { votes: true, credentialType: true },
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

    const covered = new Set(request.votes.map((v) => v.proxyForId ?? v.voterId));
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
    return { status: 'IN_VOTE', votesRemaining: committee.length - covered.size };
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
      throw new BadRequestException('Request has not passed the Training Committee');
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
    await this.audit.log(auth, 'promotions.captain-decision', 'PromotionRequest', requestId, {
      approved,
    });

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
        createdBy: { select: { id: true, firstName: true, lastName: true } },
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
      if (!requirement || requirement.credentialTypeId !== input.credentialTypeId) {
        throw new BadRequestException(
          'Requirement does not belong to that credential',
        );
      }
    } else if (input.reqKind) {
      if (input.reqKind === 'CERTIFICATION' && !input.certificationTypeId) {
        throw new BadRequestException('certificationTypeId required');
      }
      if (input.reqKind === 'EVALUATION_COUNT' && (!input.evalTemplateId || !input.count)) {
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
    await this.audit.log(auth, 'promotions.adjustment.create', 'PromotionRequirementAdjustment', adjustment.id, input);
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
    await this.audit.log(auth, 'promotions.adjustment.satisfy', 'PromotionRequirementAdjustment', adjustmentId, { satisfied });
    return adjustment;
  }

  async removeAdjustment(auth: AuthContext, adjustmentId: number) {
    await this.prisma.promotionRequirementAdjustment.delete({
      where: { id: adjustmentId },
    });
    await this.audit.log(auth, 'promotions.adjustment.remove', 'PromotionRequirementAdjustment', adjustmentId);
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
