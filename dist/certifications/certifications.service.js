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
exports.CertificationsService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let CertificationsService = class CertificationsService {
    prisma;
    storage;
    audit;
    notifications;
    constructor(prisma, storage, audit, notifications) {
        this.prisma = prisma;
        this.storage = storage;
        this.audit = audit;
        this.notifications = notifications;
    }
    listTypes() {
        return this.prisma.certificationType.findMany({ where: { active: true } });
    }
    listForMember(memberId) {
        return this.prisma.memberCertification.findMany({
            where: { memberId },
            include: { type: true, documents: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    listPending() {
        return this.prisma.memberCertification.findMany({
            where: { status: 'PENDING_VERIFICATION' },
            include: {
                type: true,
                documents: true,
                member: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async expiring(withinDays = 30) {
        const now = new Date();
        const horizon = new Date(now.getTime() + withinDays * 86_400_000);
        return this.prisma.memberCertification.findMany({
            where: {
                status: 'VERIFIED',
                expiresAt: { not: null, lte: horizon },
                member: { active: true },
            },
            include: {
                type: true,
                member: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
            orderBy: { expiresAt: 'asc' },
        });
    }
    async submit(memberId, input) {
        const type = await this.prisma.certificationType.findUnique({
            where: { id: input.typeId },
        });
        if (!type)
            throw new common_1.NotFoundException('Unknown certification type');
        let expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
        if (!expiresAt && input.issuedAt && type.defaultValidityMonths) {
            const d = new Date(input.issuedAt);
            d.setMonth(d.getMonth() + type.defaultValidityMonths);
            expiresAt = d;
        }
        return this.prisma.memberCertification.create({
            data: {
                memberId,
                typeId: input.typeId,
                identifier: input.identifier,
                issuedAt: input.issuedAt ? new Date(input.issuedAt) : null,
                expiresAt,
            },
            include: { type: true },
        });
    }
    async attachDocument(memberId, certificationId, file, opts = {}) {
        const cert = await this.prisma.memberCertification.findUnique({
            where: { id: certificationId },
        });
        if (!cert)
            throw new common_1.NotFoundException('Certification not found');
        if (cert.memberId !== memberId && !opts.asOfficer) {
            throw new common_1.ForbiddenException('Not your certification');
        }
        const storageKey = this.storage.newKey(`certs/${cert.memberId}`, file.originalname);
        await this.storage.put(storageKey, file.buffer, file.mimetype);
        return this.prisma.certificationDocument.create({
            data: {
                certificationId,
                storageKey,
                fileName: file.originalname,
                contentType: file.mimetype,
                sizeBytes: file.buffer.length,
            },
        });
    }
    async getDocument(documentId) {
        const doc = await this.prisma.certificationDocument.findUnique({
            where: { id: documentId },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        const object = await this.storage.get(doc.storageKey);
        return { doc, object };
    }
    async verify(auth, certificationId, decision) {
        if (auth.kind !== 'member') {
            throw new common_1.ForbiddenException('Verification requires a member session');
        }
        const cert = await this.prisma.memberCertification.findUnique({
            where: { id: certificationId },
        });
        if (!cert)
            throw new common_1.NotFoundException('Certification not found');
        const updated = await this.prisma.memberCertification.update({
            where: { id: certificationId },
            data: decision.approve
                ? {
                    status: 'VERIFIED',
                    verifiedById: auth.memberId,
                    verifiedAt: new Date(),
                    rejectionReason: null,
                }
                : {
                    status: 'REJECTED',
                    verifiedById: auth.memberId,
                    verifiedAt: new Date(),
                    rejectionReason: decision.reason ?? null,
                },
        });
        await this.audit.log(auth, 'certs.verify', 'MemberCertification', certificationId, decision);
        await this.notifications.notifyMember(cert.memberId, `Certification ${decision.approve ? 'verified' : 'rejected'}`, decision.approve
            ? 'Your certification was verified.'
            : `Your certification was rejected${decision.reason ? `: ${decision.reason}` : ''}.`);
        if (decision.approve) {
            await this.recomputeSuspensions(cert.memberId);
        }
        return updated;
    }
    async recomputeSuspensions(memberId) {
        const now = new Date();
        const credentials = await this.prisma.memberCredential.findMany({
            where: {
                ...(memberId ? { memberId } : {}),
                status: { in: ['ACTIVE', 'SUSPENDED'] },
            },
            include: {
                type: {
                    include: {
                        requirements: { where: { kind: 'CERTIFICATION' } },
                    },
                },
            },
        });
        const changes = [];
        for (const cred of credentials) {
            const certReqs = cred.type.requirements;
            if (!certReqs.length)
                continue;
            let allSatisfied = true;
            for (const req of certReqs) {
                const ok = await this.prisma.memberCertification.findFirst({
                    where: {
                        memberId: cred.memberId,
                        typeId: req.certificationTypeId,
                        status: 'VERIFIED',
                        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
                    },
                    select: { id: true },
                });
                if (!ok) {
                    allSatisfied = false;
                    break;
                }
            }
            const target = allSatisfied ? 'ACTIVE' : 'SUSPENDED';
            if (cred.status !== target)
                changes.push({ id: cred.id, to: target });
        }
        for (const change of changes) {
            await this.prisma.memberCredential.update({
                where: { id: change.id },
                data: { status: change.to },
            });
            await this.audit.log('system', change.to === 'SUSPENDED'
                ? 'credentials.auto-suspend'
                : 'credentials.auto-reactivate', 'MemberCredential', change.id);
        }
        return { changed: changes.length };
    }
};
exports.CertificationsService = CertificationsService;
exports.CertificationsService = CertificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        audit_service_1.AuditService,
        notifications_service_1.NotificationsService])
], CertificationsService);
//# sourceMappingURL=certifications.service.js.map