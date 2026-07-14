"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const credential_graph_service_1 = require("../credentials/credential-graph.service");
const credentials_service_1 = require("../credentials/credentials.service");
const notifications_service_1 = require("../notifications/notifications.service");
const catalog_1 = require("../permissions/catalog");
const prisma_service_1 = require("../prisma/prisma.service");
let PromotionsService = class PromotionsService {
    prisma;
    graph;
    credentials;
    audit;
    notifications;
    constructor(prisma, graph, credentials, audit, notifications) {
        this.prisma = prisma;
        this.graph = graph;
        this.credentials = credentials;
        this.audit = audit;
        this.notifications = notifications;
    }
    async trainingCommittee() {
        const today = new Date();
        const assignments = await this.prisma.memberRole.findMany({
            where: {
                startDate: { lte: today },
                OR: [{ endDate: null }, { endDate: { gte: today } }],
                member: { active: true },
                role: {
                    permissions: { some: { permission: catalog_1.PERMISSIONS.PROMOTIONS_VOTE } },
                },
            },
            select: { memberId: true },
        });
        return [...new Set(assignments.map((a) => a.memberId))];
    }
    async eligibleRequests(memberId) {
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
        const out = [];
        for (const type of types) {
            if (held.has(type.key) || openIds.has(type.id))
                continue;
            const prereqsMet = type.prerequisites.every((p) => held.has(p.requiresType.key));
            if (!prereqsMet)
                continue;
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
    async createRequest(memberId, credentialTypeId) {
        const eligible = await this.eligibleRequests(memberId);
        const match = eligible.find((e) => e.credentialTypeId === credentialTypeId);
        if (!match) {
            throw new common_1.BadRequestException('You cannot request that credential (already held, open request, or missing prerequisites)');
        }
        if (!match.requestable) {
            throw new common_1.BadRequestException('Requirement checklist is not complete');
        }
        const request = await this.prisma.promotionRequest.create({
            data: { memberId, credentialTypeId, status: 'IN_VOTE' },
        });
        await this.notifications.notifyOfficers('New promotion request', `Member ${memberId} requested ${match.name} (request #${request.id}).`);
        return request;
    }
    listRequests(status) {
        return this.prisma.promotionRequest.findMany({
            where: status ? { status: status } : {},
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
    async getReview(requestId) {
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
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        const checklist = await this.credentials.checklist(request.memberId, request.credentialTypeId);
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
    async appointProxy(principalId, requestId, proxyId) {
        const committee = await this.trainingCommittee();
        if (!committee.includes(principalId)) {
            throw new common_1.ForbiddenException('Only Training Committee members appoint proxies');
        }
        if (committee.includes(proxyId)) {
            throw new common_1.BadRequestException('The proxy must not already be a Training Committee member');
        }
        if (proxyId === principalId) {
            throw new common_1.BadRequestException('You cannot proxy yourself');
        }
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id: requestId },
        });
        if (!request || request.status !== 'IN_VOTE') {
            throw new common_1.BadRequestException('Request is not open for voting');
        }
        if (request.memberId === proxyId) {
            throw new common_1.BadRequestException('The requester cannot be a proxy');
        }
        return this.prisma.promotionProxy.upsert({
            where: { requestId_principalId: { requestId, principalId } },
            create: { requestId, principalId, proxyId },
            update: { proxyId },
        });
    }
    async vote(voterId, requestId, choice, notes) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id: requestId },
            include: { votes: true, proxies: true, credentialType: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (request.status !== 'IN_VOTE') {
            throw new common_1.BadRequestException('Request is not open for voting');
        }
        if (request.memberId === voterId) {
            throw new common_1.ForbiddenException('You cannot vote on your own promotion');
        }
        const committee = await this.trainingCommittee();
        const proxyFor = request.proxies.find((p) => p.proxyId === voterId);
        let principalId = null;
        if (proxyFor) {
            principalId = proxyFor.principalId;
        }
        else if (committee.includes(voterId)) {
            const delegated = request.proxies.find((p) => p.principalId === voterId);
            if (delegated) {
                throw new common_1.ForbiddenException('You appointed a proxy for this request; the proxy votes in your place');
            }
        }
        else {
            throw new common_1.ForbiddenException('You are not eligible to vote on this request');
        }
        const memberOfRecord = principalId ?? voterId;
        const already = request.votes.find((v) => (v.proxyForId ?? v.voterId) === memberOfRecord);
        if (already)
            throw new common_1.ConflictException('Vote already cast');
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
    async tally(requestId) {
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
            await this.notifications.notifyMember(request.memberId, 'Promotion request denied', `Your request for ${request.credentialType.name} was denied. You may submit a new request when ready.`);
            return { status: 'DENIED' };
        }
        const covered = new Set(request.votes.map((v) => v.proxyForId ?? v.voterId));
        const unanimous = committee.length > 0 && committee.every((id) => covered.has(id));
        if (unanimous) {
            await this.prisma.promotionRequest.update({
                where: { id: requestId },
                data: { status: 'TC_APPROVED' },
            });
            await this.notifications.notifyOfficers('Promotion awaiting captain approval', `Request #${requestId} (${request.credentialType.name}) passed the TC unanimously.`);
            return { status: 'TC_APPROVED' };
        }
        return { status: 'IN_VOTE', votesRemaining: committee.length - covered.size };
    }
    async captainDecision(auth, requestId, approved, notes) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id: requestId },
            include: { credentialType: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (request.status !== 'TC_APPROVED') {
            throw new common_1.BadRequestException('Request has not passed the Training Committee');
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
            await this.credentials.grant(auth, request.memberId, request.credentialTypeId, { grantedViaId: requestId });
            await this.notifications.notifyMember(request.memberId, 'Promotion approved', `Congratulations — you are now a ${request.credentialType.name}.`);
        }
        else {
            await this.notifications.notifyMember(request.memberId, 'Promotion request denied', `Your request for ${request.credentialType.name} was denied at captain review. You may submit a new request when ready.`);
        }
        return { ok: true, status: approved ? 'APPROVED' : 'DENIED' };
    }
    async withdraw(memberId, requestId) {
        const request = await this.prisma.promotionRequest.findUnique({
            where: { id: requestId },
        });
        if (!request || request.memberId !== memberId) {
            throw new common_1.ForbiddenException('Not your request');
        }
        if (!['PENDING', 'IN_VOTE'].includes(request.status)) {
            throw new common_1.BadRequestException('Request can no longer be withdrawn');
        }
        await this.prisma.promotionRequest.update({
            where: { id: requestId },
            data: { status: 'WITHDRAWN', resolvedAt: new Date() },
        });
        return { ok: true };
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        credential_graph_service_1.CredentialGraphService,
        credentials_service_1.CredentialsService,
        audit_service_1.AuditService,
        notifications_service_1.NotificationsService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map