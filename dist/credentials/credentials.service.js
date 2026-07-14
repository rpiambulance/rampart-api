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
exports.CredentialsService = exports.SDS_TITLE = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const credential_graph_service_1 = require("./credential-graph.service");
exports.SDS_TITLE = 'Senior Duty Supervisor';
let CredentialsService = class CredentialsService {
    prisma;
    graph;
    audit;
    notifications;
    constructor(prisma, graph, audit, notifications) {
        this.prisma = prisma;
        this.graph = graph;
        this.audit = audit;
        this.notifications = notifications;
    }
    listTypes() {
        return this.prisma.credentialType.findMany({
            where: { active: true },
            include: {
                prerequisites: { include: { requiresType: { select: { key: true } } } },
                requirements: {
                    include: {
                        certificationType: true,
                        evalTemplate: { select: { id: true, name: true } },
                        class: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { id: 'asc' },
        });
    }
    async checklist(memberId, credentialTypeId) {
        const type = await this.prisma.credentialType.findUnique({
            where: { id: credentialTypeId },
            include: {
                prerequisites: { include: { requiresType: true } },
                requirements: {
                    include: {
                        certificationType: true,
                        evalTemplate: true,
                        class: true,
                    },
                },
            },
        });
        if (!type)
            throw new common_1.NotFoundException('Credential type not found');
        const held = await this.graph.heldKeys(memberId);
        const items = [];
        for (const prereq of type.prerequisites) {
            items.push({
                kind: 'PREREQUISITE',
                label: `Hold ${prereq.requiresType.name}`,
                satisfied: held.has(prereq.requiresType.key),
            });
        }
        const today = new Date();
        for (const req of type.requirements) {
            if (req.kind === 'CERTIFICATION' && req.certificationType) {
                const cert = await this.prisma.memberCertification.findFirst({
                    where: {
                        memberId,
                        typeId: req.certificationTypeId,
                        status: 'VERIFIED',
                        OR: [{ expiresAt: null }, { expiresAt: { gte: today } }],
                    },
                });
                items.push({
                    kind: 'CERTIFICATION',
                    label: `Verified ${req.certificationType.name}`,
                    satisfied: !!cert,
                });
            }
            else if (req.kind === 'EVALUATION_COUNT' && req.evalTemplate) {
                const count = await this.prisma.evaluation.count({
                    where: {
                        subjectId: memberId,
                        templateId: req.evalTemplateId,
                        status: 'SIGNED',
                    },
                });
                items.push({
                    kind: 'EVALUATION_COUNT',
                    label: `${req.count} signed “${req.evalTemplate.name}” evaluations`,
                    satisfied: count >= (req.count ?? 1),
                    detail: `${count}/${req.count}`,
                });
            }
            else if (req.kind === 'CLASS' && req.class) {
                const attendance = await this.prisma.classAttendance.findUnique({
                    where: { classId_memberId: { classId: req.classId, memberId } },
                });
                items.push({
                    kind: 'CLASS',
                    label: `Complete ${req.class.name}`,
                    satisfied: attendance?.status === 'COMPLETED',
                });
            }
        }
        return items;
    }
    async grant(auth, memberId, credentialTypeId, opts = {}) {
        const existing = await this.prisma.memberCredential.findUnique({
            where: { memberId_typeId: { memberId, typeId: credentialTypeId } },
        });
        if (existing && existing.status === 'ACTIVE') {
            throw new common_1.ConflictException('Member already holds this credential');
        }
        const credential = existing
            ? await this.prisma.memberCredential.update({
                where: { id: existing.id },
                data: {
                    status: 'ACTIVE',
                    title: opts.title ?? null,
                    grantedAt: new Date(),
                    grantedViaId: opts.grantedViaId ?? null,
                    revokedAt: null,
                },
            })
            : await this.prisma.memberCredential.create({
                data: {
                    memberId,
                    typeId: credentialTypeId,
                    title: opts.title ?? null,
                    grantedViaId: opts.grantedViaId ?? null,
                },
            });
        await this.audit.log(auth, 'credentials.grant', 'MemberCredential', credential.id, {
            memberId,
            credentialTypeId,
            ...opts,
        });
        return credential;
    }
    async appoint(auth, memberId, credentialKey, opts = {}) {
        const typeId = await this.graph.typeIdForKey(credentialKey);
        if (!typeId)
            throw new common_1.NotFoundException('Unknown credential');
        const type = await this.prisma.credentialType.findUniqueOrThrow({
            where: { id: typeId },
            include: { prerequisites: { include: { requiresType: true } } },
        });
        if (type.grantMethod !== 'APPOINTMENT') {
            throw new common_1.BadRequestException(`${type.name} is granted by promotion, not appointment`);
        }
        const held = await this.graph.heldKeys(memberId);
        const missing = type.prerequisites
            .filter((p) => !held.has(p.requiresType.key))
            .map((p) => p.requiresType.name);
        if (missing.length) {
            throw new common_1.BadRequestException(`Member is missing prerequisites: ${missing.join(', ')}`);
        }
        const credential = await this.grant(auth, memberId, typeId, {
            title: opts.senior ? exports.SDS_TITLE : undefined,
        });
        await this.audit.log(auth, 'credentials.appoint', 'MemberCredential', credential.id, {
            memberId,
            credentialKey,
            senior: !!opts.senior,
        });
        await this.notifications.notifyMember(memberId, 'Credential appointed', `You have been appointed ${opts.senior ? exports.SDS_TITLE : type.name}.`);
        return credential;
    }
    async revoke(auth, memberId, credentialTypeId) {
        const credential = await this.prisma.memberCredential.findUnique({
            where: { memberId_typeId: { memberId, typeId: credentialTypeId } },
        });
        if (!credential)
            throw new common_1.NotFoundException('Credential not held');
        await this.prisma.memberCredential.update({
            where: { id: credential.id },
            data: { status: 'REVOKED', revokedAt: new Date() },
        });
        await this.audit.log(auth, 'credentials.revoke', 'MemberCredential', credential.id);
        return { ok: true };
    }
};
exports.CredentialsService = CredentialsService;
exports.CredentialsService = CredentialsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        credential_graph_service_1.CredentialGraphService,
        audit_service_1.AuditService,
        notifications_service_1.NotificationsService])
], CredentialsService);
//# sourceMappingURL=credentials.service.js.map