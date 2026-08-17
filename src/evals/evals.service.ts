import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { ScoreType } from '../generated/prisma/enums';

export interface TemplateItemInput {
  order: number;
  prompt: string;
  scoreType: ScoreType;
  /** For OPTIONS items: the choices, in the order they are offered. */
  options?: Array<{ value: string; label: string }>;
}

/** Only OPTIONS items carry choices; the column stays null otherwise. */
function toItemData(item: TemplateItemInput) {
  return {
    order: item.order,
    prompt: item.prompt,
    scoreType: item.scoreType,
    options:
      item.scoreType === 'OPTIONS' && item.options?.length
        ? (item.options as object)
        : undefined,
  };
}

export interface ScoreInput {
  itemId: number;
  scaleValue?: number | null;
  passed?: boolean | null;
  textValue?: string | null;
  optionValue?: string | null;
}

@Injectable()
export class EvalsService {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  // ---- templates ----

  listTemplates(includeInactive = false) {
    return this.prisma.evalFormTemplate.findMany({
      where: includeInactive ? {} : { active: true },
      include: { items: { orderBy: { order: 'asc' } } },
      orderBy: [{ name: 'asc' }, { version: 'desc' }],
    });
  }

  createTemplate(name: string, items: TemplateItemInput[]) {
    return this.prisma.evalFormTemplate.create({
      data: { name, items: { create: items.map(toItemData) } },
      include: { items: true },
    });
  }

  /** Editing an in-use template creates a new version (submitted evals pin the old one). */
  async reviseTemplate(templateId: number, items: TemplateItemInput[]) {
    const existing = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: { _count: { select: { evaluations: true } } },
    });
    if (!existing) throw new NotFoundException('Template not found');

    if (existing._count.evaluations === 0) {
      await this.prisma.evalFormItem.deleteMany({ where: { templateId } });
      return this.prisma.evalFormTemplate.update({
        where: { id: templateId },
        data: { items: { create: items.map(toItemData) } },
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
        items: { create: items.map(toItemData) },
      },
      include: { items: true },
    });
  }

  // ---- evaluations ----

  async create(evaluatorId: number, subjectId: number, templateId: number, shiftDate?: string) {
    if (evaluatorId === subjectId) {
      throw new BadRequestException('You cannot evaluate yourself');
    }
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template?.active) {
      throw new BadRequestException('Template not found or inactive');
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

  async saveScores(
    evaluatorId: number,
    evaluationId: number,
    scores: ScoreInput[],
    opts: {
      submit?: boolean;
      notes?: string;
      outcome?: 'NEEDS_IMPROVEMENT' | 'PASSED';
      readyForPromotion?: boolean;
    } = {},
  ) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    if (evaluation.evaluatorId !== evaluatorId) {
      throw new ForbiddenException('Only the evaluator can edit this evaluation');
    }
    if (evaluation.status === 'SIGNED') {
      throw new BadRequestException('Signed evaluations are immutable');
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
          optionValue: score.optionValue ?? null,
        },
      });
    }
    const updated = await this.prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        ...(opts.notes !== undefined ? { notes: opts.notes } : {}),
        ...(opts.outcome !== undefined ? { outcome: opts.outcome } : {}),
        ...(opts.readyForPromotion !== undefined
          ? { readyForPromotion: opts.readyForPromotion }
          : {}),
        ...(opts.submit ? { status: 'SUBMITTED', signedByEvaluator: new Date() } : {}),
      },
      include: { scores: true, subject: { select: { id: true } }, template: true },
    });

    // Submitting hands it to the trainee to acknowledge.
    if (opts.submit) {
      await this.notifications.notify(updated.subjectId, {
        type: 'eval.received',
        subject: `Evaluation to acknowledge: ${updated.template.name}`,
        body:
          `An evaluation has been written about you` +
          `${updated.outcome ? ` — ${updated.outcome === 'PASSED' ? 'Passed' : 'Needs improvement'}` : ''}.` +
          ' Read it and sign to confirm you have seen it.',
        task: {
          actionLabel: 'Read and sign',
          actionUrl: `/evals/${evaluationId}`,
        },
      });
    }
    return updated;
  }

  /** Both parties sign; when both have signed the eval becomes SIGNED (counts toward checklists). */
  async sign(memberId: number, evaluationId: number) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    if (evaluation.status === 'DRAFT') {
      throw new BadRequestException('Evaluation has not been submitted');
    }

    const data: Record<string, unknown> = {};
    if (memberId === evaluation.evaluatorId && !evaluation.signedByEvaluator) {
      data.signedByEvaluator = new Date();
    } else if (memberId === evaluation.subjectId && !evaluation.signedBySubject) {
      data.signedBySubject = new Date();
    } else {
      throw new ForbiddenException('You are not a party to this evaluation, or you already signed');
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

  async get(evaluationId: number, viewerId: number, canReadAll: boolean) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        template: { include: { items: { orderBy: { order: 'asc' } } } },
        scores: true,
        evaluator: { select: { id: true, firstName: true, lastName: true } },
        subject: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    const party =
      evaluation.evaluatorId === viewerId || evaluation.subjectId === viewerId;
    if (!party && !canReadAll) {
      throw new ForbiddenException('Not your evaluation');
    }
    return evaluation;
  }

  listFor(memberId: number) {
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

  listAbout(subjectId: number) {
    return this.prisma.evaluation.findMany({
      where: { subjectId },
      include: {
        template: { select: { id: true, name: true } },
        evaluator: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
