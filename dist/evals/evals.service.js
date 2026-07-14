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
exports.EvalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvalsService = class EvalsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listTemplates(includeInactive = false) {
        return this.prisma.evalFormTemplate.findMany({
            where: includeInactive ? {} : { active: true },
            include: { items: { orderBy: { order: 'asc' } } },
            orderBy: [{ name: 'asc' }, { version: 'desc' }],
        });
    }
    createTemplate(name, items) {
        return this.prisma.evalFormTemplate.create({
            data: { name, items: { create: items } },
            include: { items: true },
        });
    }
    async reviseTemplate(templateId, items) {
        const existing = await this.prisma.evalFormTemplate.findUnique({
            where: { id: templateId },
            include: { _count: { select: { evaluations: true } } },
        });
        if (!existing)
            throw new common_1.NotFoundException('Template not found');
        if (existing._count.evaluations === 0) {
            await this.prisma.evalFormItem.deleteMany({ where: { templateId } });
            return this.prisma.evalFormTemplate.update({
                where: { id: templateId },
                data: { items: { create: items } },
                include: { items: true },
            });
        }
        await this.prisma.evalFormTemplate.update({
            where: { id: templateId },
            data: { active: false },
        });
        return this.prisma.evalFormTemplate.create({
            data: {
                name: existing.name,
                version: existing.version + 1,
                items: { create: items },
            },
            include: { items: true },
        });
    }
    async create(evaluatorId, subjectId, templateId, shiftDate) {
        if (evaluatorId === subjectId) {
            throw new common_1.BadRequestException('You cannot evaluate yourself');
        }
        const template = await this.prisma.evalFormTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template?.active) {
            throw new common_1.BadRequestException('Template not found or inactive');
        }
        return this.prisma.evaluation.create({
            data: {
                templateId,
                evaluatorId,
                subjectId,
                shiftDate: shiftDate ? new Date(shiftDate) : null,
            },
        });
    }
    async saveScores(evaluatorId, evaluationId, scores, opts = {}) {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { id: evaluationId },
        });
        if (!evaluation)
            throw new common_1.NotFoundException('Evaluation not found');
        if (evaluation.evaluatorId !== evaluatorId) {
            throw new common_1.ForbiddenException('Only the evaluator can edit this evaluation');
        }
        if (evaluation.status === 'SIGNED') {
            throw new common_1.BadRequestException('Signed evaluations are immutable');
        }
        for (const score of scores) {
            await this.prisma.evalScore.upsert({
                where: {
                    evaluationId_itemId: { evaluationId, itemId: score.itemId },
                },
                create: { evaluationId, ...score },
                update: {
                    scaleValue: score.scaleValue ?? null,
                    passed: score.passed ?? null,
                    textValue: score.textValue ?? null,
                },
            });
        }
        return this.prisma.evaluation.update({
            where: { id: evaluationId },
            data: {
                ...(opts.notes !== undefined ? { notes: opts.notes } : {}),
                ...(opts.submit ? { status: 'SUBMITTED' } : {}),
            },
            include: { scores: true },
        });
    }
    async sign(memberId, evaluationId) {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { id: evaluationId },
        });
        if (!evaluation)
            throw new common_1.NotFoundException('Evaluation not found');
        if (evaluation.status === 'DRAFT') {
            throw new common_1.BadRequestException('Evaluation has not been submitted');
        }
        const data = {};
        if (memberId === evaluation.evaluatorId && !evaluation.signedByEvaluator) {
            data.signedByEvaluator = new Date();
        }
        else if (memberId === evaluation.subjectId && !evaluation.signedBySubject) {
            data.signedBySubject = new Date();
        }
        else {
            throw new common_1.ForbiddenException('You are not a party to this evaluation, or you already signed');
        }
        const updated = await this.prisma.evaluation.update({
            where: { id: evaluationId },
            data,
        });
        if (updated.signedByEvaluator && updated.signedBySubject) {
            return this.prisma.evaluation.update({
                where: { id: evaluationId },
                data: { status: 'SIGNED' },
            });
        }
        return updated;
    }
    async get(evaluationId, viewerId, canReadAll) {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { id: evaluationId },
            include: {
                template: { include: { items: { orderBy: { order: 'asc' } } } },
                scores: true,
                evaluator: { select: { id: true, firstName: true, lastName: true } },
                subject: { select: { id: true, firstName: true, lastName: true } },
            },
        });
        if (!evaluation)
            throw new common_1.NotFoundException('Evaluation not found');
        const party = evaluation.evaluatorId === viewerId || evaluation.subjectId === viewerId;
        if (!party && !canReadAll) {
            throw new common_1.ForbiddenException('Not your evaluation');
        }
        return evaluation;
    }
    listFor(memberId) {
        return this.prisma.evaluation.findMany({
            where: { OR: [{ subjectId: memberId }, { evaluatorId: memberId }] },
            include: {
                template: { select: { id: true, name: true } },
                evaluator: { select: { id: true, firstName: true, lastName: true } },
                subject: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    listAbout(subjectId) {
        return this.prisma.evaluation.findMany({
            where: { subjectId },
            include: {
                template: { select: { id: true, name: true } },
                evaluator: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.EvalsService = EvalsService;
exports.EvalsService = EvalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvalsService);
//# sourceMappingURL=evals.service.js.map