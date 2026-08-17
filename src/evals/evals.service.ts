import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { ScoreType, TemplateKind } from '../generated/prisma/enums';

export interface TemplateItemInput {
  order?: number;
  prompt: string;
  scoreType: ScoreType;
  /** For OPTIONS and MULTI_SELECT: the choices, in the order they are offered. */
  options?: Array<{ value: string; label: string }>;
  /** NUMBER only. */
  minValue?: number | null;
  maxValue?: number | null;
  unit?: string | null;
  /** Checklists only: raises the signing bar above the checklist's own. */
  signoffCredentialTypeId?: number | null;
}

export interface TemplateGroupInput {
  heading: string;
  description?: string | null;
  items: TemplateItemInput[];
}

/**
 * A form is an ordered run of nodes, each either a loose item or a group of
 * them. One list rather than two, because a group and a single item share a
 * position: moving either one has to move it past the other.
 */
export type TemplateNodeInput =
  | ({ kind: 'ITEM' } & TemplateItemInput)
  | ({ kind: 'GROUP' } & TemplateGroupInput);

/** Choices belong only to the item types that offer them. */
const HAS_OPTIONS: ScoreType[] = ['OPTIONS', 'MULTI_SELECT'];

function toItemData(item: TemplateItemInput, order: number) {
  const numeric = item.scoreType === 'NUMBER';
  return {
    order,
    prompt: item.prompt,
    scoreType: item.scoreType,
    options:
      HAS_OPTIONS.includes(item.scoreType) && item.options?.length
        ? (item.options as object)
        : undefined,
    minValue: numeric ? (item.minValue ?? null) : null,
    maxValue: numeric ? (item.maxValue ?? null) : null,
    unit: numeric ? (item.unit?.trim() || null) : null,
    signoffCredentialTypeId:
      item.scoreType === 'SIGNOFF' ? (item.signoffCredentialTypeId ?? null) : null,
  };
}

/**
 * Writes a template's nodes: loose items and groups interleaved, each keeping
 * the position it was given. Callers that still send a flat item list get the
 * old behaviour — every item loose, in the order supplied.
 */
function toNodes(
  nodes: TemplateNodeInput[] | undefined,
  items: TemplateItemInput[] | undefined,
): TemplateNodeInput[] {
  if (nodes?.length) return nodes;
  return (items ?? []).map((item) => ({ kind: 'ITEM' as const, ...item }));
}

export interface ScoreInput {
  itemId: number;
  scaleValue?: number | null;
  passed?: boolean | null;
  textValue?: string | null;
  optionValue?: string | null;
  optionValues?: string[] | null;
  numberValue?: number | null;
}

@Injectable()
export class EvalsService {
  constructor(
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  // ---- templates ----

  /** Everything a caller needs to render a form, groups included. */
  private static readonly TEMPLATE_INCLUDE = {
    items: { orderBy: { order: 'asc' } },
    groups: {
      orderBy: { order: 'asc' },
      include: { items: { orderBy: { order: 'asc' } } },
    },
    signoffCredentialType: { select: { id: true, key: true, name: true } },
  } as const;

  listTemplates(opts: { includeInactive?: boolean; kind?: TemplateKind } = {}) {
    return this.prisma.evalFormTemplate.findMany({
      where: {
        ...(opts.includeInactive ? {} : { active: true }),
        ...(opts.kind ? { kind: opts.kind } : {}),
      },
      include: EvalsService.TEMPLATE_INCLUDE,
      orderBy: [{ name: 'asc' }, { version: 'desc' }],
    });
  }

  /**
   * Writes the nodes of a template that already exists and has none.
   *
   * Groups are created one at a time because their items need the group's id,
   * which a single nested create cannot give while also keeping loose items
   * and groups in one ordering space.
   */
  private async writeNodes(templateId: number, nodes: TemplateNodeInput[]) {
    for (const [index, node] of nodes.entries()) {
      if (node.kind === 'GROUP') {
        await this.prisma.evalFormGroup.create({
          data: {
            templateId,
            order: index,
            heading: node.heading,
            description: node.description?.trim() || null,
            items: {
              create: node.items.map((item, i) => ({
                templateId,
                ...toItemData(item, i),
              })),
            },
          },
        });
      } else {
        await this.prisma.evalFormItem.create({
          data: { templateId, ...toItemData(node, index) },
        });
      }
    }
  }

  private assertChecklist(
    kind: TemplateKind | undefined,
    signoffCredentialTypeId: number | null | undefined,
  ) {
    if (kind === 'CHECKLIST' && !signoffCredentialTypeId) {
      throw new BadRequestException(
        'A checklist must say which credential a signer needs',
      );
    }
  }

  async createTemplate(opts: {
    name: string;
    kind?: TemplateKind;
    signoffCredentialTypeId?: number | null;
    nodes?: TemplateNodeInput[];
    items?: TemplateItemInput[];
  }) {
    this.assertChecklist(opts.kind, opts.signoffCredentialTypeId);
    const template = await this.prisma.evalFormTemplate.create({
      data: {
        name: opts.name,
        kind: opts.kind ?? 'EVALUATION',
        signoffCredentialTypeId: opts.signoffCredentialTypeId ?? null,
      },
    });
    await this.writeNodes(template.id, toNodes(opts.nodes, opts.items));
    return this.prisma.evalFormTemplate.findUniqueOrThrow({
      where: { id: template.id },
      include: EvalsService.TEMPLATE_INCLUDE,
    });
  }

  /** Editing an in-use template creates a new version (submitted evals pin the old one). */
  async reviseTemplate(
    templateId: number,
    opts: {
      signoffCredentialTypeId?: number | null;
      nodes?: TemplateNodeInput[];
      items?: TemplateItemInput[];
    },
  ) {
    const existing = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: { _count: { select: { evaluations: true } } },
    });
    if (!existing) throw new NotFoundException('Template not found');

    const signoffCredentialTypeId =
      opts.signoffCredentialTypeId !== undefined
        ? opts.signoffCredentialTypeId
        : existing.signoffCredentialTypeId;
    this.assertChecklist(existing.kind, signoffCredentialTypeId);
    const nodes = toNodes(opts.nodes, opts.items);

    // A checklist is never re-versioned: sign-offs point at item rows, and
    // moving a trainee's half-finished checklist onto fresh rows would erase
    // work that was already witnessed. Editing one in place is deliberate.
    const inUse = existing.kind === 'CHECKLIST' ? false : existing._count.evaluations > 0;

    if (!inUse) {
      await this.prisma.evalFormGroup.deleteMany({ where: { templateId } });
      await this.prisma.evalFormItem.deleteMany({ where: { templateId } });
      await this.prisma.evalFormTemplate.update({
        where: { id: templateId },
        data: { signoffCredentialTypeId },
      });
      await this.writeNodes(templateId, nodes);
      return this.prisma.evalFormTemplate.findUniqueOrThrow({
        where: { id: templateId },
        include: EvalsService.TEMPLATE_INCLUDE,
      });
    }

    await this.prisma.evalFormTemplate.update({
      where: { id: templateId },
      data: { active: false },
    });
    const created = await this.prisma.evalFormTemplate.create({
      data: {
        name: existing.name,
        kind: existing.kind,
        signoffCredentialTypeId,
        version: existing.version + 1,
      },
    });
    await this.writeNodes(created.id, nodes);
    return this.prisma.evalFormTemplate.findUniqueOrThrow({
      where: { id: created.id },
      include: EvalsService.TEMPLATE_INCLUDE,
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
      // Written the same way on both paths: an answer cleared on a later save
      // has to become null rather than keep the value it used to have.
      const value = {
        scaleValue: score.scaleValue ?? null,
        passed: score.passed ?? null,
        textValue: score.textValue ?? null,
        optionValue: score.optionValue ?? null,
        optionValues: score.optionValues ?? [],
        numberValue: score.numberValue ?? null,
      };
      await this.prisma.evalScore.upsert({
        where: {
          evaluationId_itemId: { evaluationId, itemId: score.itemId },
        },
        create: { evaluationId, itemId: score.itemId, ...value },
        update: value,
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

  /**
   * Erase an evaluation.
   *
   * A draft has been shown to nobody, so discarding one is housekeeping; a
   * submitted or signed evaluation is part of a member's record and someone
   * has already been asked to act on it. They are separate permissions so the
   * second can be held by far fewer people than the first.
   */
  async remove(auth: AuthContext, evaluationId: number) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: { template: { select: { name: true } } },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');

    const draft = evaluation.status === 'DRAFT';
    const needed = draft
      ? PERMISSIONS.EVALS_DELETE_DRAFT
      : PERMISSIONS.EVALS_DELETE_COMPLETED;
    if (!auth.permissions.has(needed)) {
      throw new ForbiddenException(
        draft
          ? 'You may not delete draft evaluations'
          : 'Deleting a submitted or signed evaluation is a separate permission',
      );
    }

    // Whatever was asked of the trainee is moot once the evaluation is gone.
    await this.prisma.inboxMessage.deleteMany({
      where: { actionUrl: `/evals/${evaluationId}` },
    });
    await this.prisma.evaluation.delete({ where: { id: evaluationId } });

    await this.audit.log(auth, 'eval.delete', 'Evaluation', evaluationId, {
      status: evaluation.status,
      template: evaluation.template.name,
      subjectId: evaluation.subjectId,
      evaluatorId: evaluation.evaluatorId,
    });
    return { deleted: true };
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
