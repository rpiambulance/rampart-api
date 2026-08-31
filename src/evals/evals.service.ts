import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { PERMISSIONS } from '../permissions/catalog';
import type { AttachmentRequirement } from '../generated/prisma/enums';
import { StorageService } from '../storage/storage.service';
import { PermissionHoldersService } from '../permissions/permission-holders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ScoreType, TemplateKind } from '../generated/prisma/enums';
import { displayName } from '../common/name';

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
  /**
   * Checklists only: who may sign this line, instead of the checklist's own
   * set. Empty or absent means the checklist's set applies.
   */
  signoffCredentialTypeIds?: number[];
  /** Whether the trainee fills this in when requesting the evaluation. */
  traineeInput?: 'NONE' | 'OPTIONAL' | 'REQUIRED';
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
    unit: numeric ? item.unit?.trim() || null : null,
    // Headings ask nothing, so nobody fills them in.
    traineeInput:
      item.scoreType === 'HEADING' ? 'NONE' : (item.traineeInput ?? 'NONE'),
    signoffCredentialTypes:
      item.scoreType === 'SIGNOFF' && item.signoffCredentialTypeIds?.length
        ? { connect: item.signoffCredentialTypeIds.map((id) => ({ id })) }
        : undefined,
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

/** Whether a submitted score carries an answer at all. */
function hasAnswer(score?: ScoreInput): boolean {
  if (!score) return false;
  return (
    score.scaleValue != null ||
    score.passed != null ||
    (score.textValue?.trim().length ?? 0) > 0 ||
    (score.optionValue?.trim().length ?? 0) > 0 ||
    (score.optionValues?.length ?? 0) > 0 ||
    score.numberValue != null
  );
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
    private readonly graph: CredentialGraphService,
    private readonly permissionHolders: PermissionHoldersService,
    private readonly notifications: NotificationsService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  /** Attaching and removing are acts of a person, never of an API token. */
  private static memberOf(auth: AuthContext): number {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
  }

  // ---- templates ----

  /** Everything a caller needs to render a form, groups included. */
  private static readonly CREDENTIAL_SELECT = {
    select: { id: true, key: true, name: true },
  } as const;

  private static readonly TEMPLATE_INCLUDE = {
    // Loose items only: a grouped item is reached through its group, and
    // listing it in both places would show it twice on every form.
    items: {
      where: { groupId: null },
      orderBy: { order: 'asc' },
      include: { signoffCredentialTypes: EvalsService.CREDENTIAL_SELECT },
    },
    groups: {
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: { signoffCredentialTypes: EvalsService.CREDENTIAL_SELECT },
        },
      },
    },
    signoffCredentialTypes: EvalsService.CREDENTIAL_SELECT,
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
    signoffCredentialTypeIds: number[] | undefined,
  ) {
    if (kind === 'CHECKLIST' && !signoffCredentialTypeIds?.length) {
      throw new BadRequestException(
        'A checklist must say which credentials let someone sign it',
      );
    }
  }

  async createTemplate(opts: {
    name: string;
    kind?: TemplateKind;
    signoffCredentialTypeIds?: number[];
    nodes?: TemplateNodeInput[];
    items?: TemplateItemInput[];
    attachments?: AttachmentRequirement;
    phiWarning?: boolean;
  }) {
    this.assertChecklist(opts.kind, opts.signoffCredentialTypeIds);
    const template = await this.prisma.evalFormTemplate.create({
      data: {
        name: opts.name,
        kind: opts.kind ?? 'EVALUATION',
        attachments: opts.attachments ?? 'NONE',
        phiWarning: opts.phiWarning ?? false,
        ...(opts.signoffCredentialTypeIds?.length
          ? {
              signoffCredentialTypes: {
                connect: opts.signoffCredentialTypeIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });
    await this.writeNodes(template.id, toNodes(opts.nodes, opts.items));
    return this.prisma.evalFormTemplate.findUniqueOrThrow({
      where: { id: template.id },
      include: EvalsService.TEMPLATE_INCLUDE,
    });
  }

  // ---- attachments ----

  /**
   * Files hung off a completed evaluation, each with a title.
   *
   * Attached by the evaluator while the evaluation is theirs to write. Once
   * submitted it is a record, and a record that can still gain pages is not
   * one — so the same rule as the scores applies.
   */
  async attach(
    auth: AuthContext,
    evaluationId: number,
    title: string,
    file: { originalname: string; mimetype: string; buffer: Buffer },
  ) {
    const memberId = EvalsService.memberOf(auth);
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: { template: { select: { attachments: true, name: true } } },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    if (evaluation.evaluatorId !== memberId) {
      throw new ForbiddenException('Not your evaluation to attach to');
    }
    if (evaluation.status !== 'DRAFT') {
      throw new BadRequestException(
        'This evaluation has been submitted; its attachments are part of the record now.',
      );
    }
    if (evaluation.template.attachments === 'NONE') {
      throw new BadRequestException(
        `${evaluation.template.name} does not take attachments.`,
      );
    }
    if (!title.trim()) {
      throw new BadRequestException('Give the file a title — what is it?');
    }

    const last = await this.prisma.evalAttachment.findFirst({
      where: { evaluationId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const storageKey = this.storage.newKey(
      `evals/${evaluationId}`,
      file.originalname,
    );
    await this.storage.put(storageKey, file.buffer, file.mimetype);
    const attachment = await this.prisma.evalAttachment.create({
      data: {
        evaluationId,
        title: title.trim(),
        position: last ? last.position + 1 : 0,
        storageKey,
        fileName: file.originalname,
        contentType: file.mimetype,
        sizeBytes: file.buffer.length,
        uploadedById: memberId,
      },
    });
    await this.audit.log(auth, 'evals.attach', 'Evaluation', evaluationId, {
      attachmentId: attachment.id,
      title: attachment.title,
    });
    return attachment;
  }

  /** Removing one, on the same terms it could be added. */
  async removeAttachment(auth: AuthContext, attachmentId: string) {
    const memberId = EvalsService.memberOf(auth);
    const attachment = await this.prisma.evalAttachment.findUnique({
      where: { id: attachmentId },
      include: { evaluation: { select: { evaluatorId: true, status: true } } },
    });
    if (!attachment) throw new NotFoundException('Attachment not found');
    if (attachment.evaluation.evaluatorId !== memberId) {
      throw new ForbiddenException('Not yours to remove');
    }
    if (attachment.evaluation.status !== 'DRAFT') {
      throw new BadRequestException(
        'This evaluation has been submitted; its attachments are part of the record now.',
      );
    }
    await this.prisma.evalAttachment.delete({ where: { id: attachmentId } });
    await this.audit.log(
      auth,
      'evals.attach.remove',
      'Evaluation',
      attachment.evaluationId,
      {
        attachmentId,
      },
    );
    return { ok: true };
  }

  /**
   * The file itself, for whoever may read the evaluation it hangs off.
   *
   * The permission question is the evaluation's, not the file's: anything
   * else would let a link outlive the reason somebody could see it.
   */
  async attachment(auth: AuthContext, attachmentId: string) {
    const attachment = await this.prisma.evalAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        evaluation: {
          select: { id: true, evaluatorId: true, subjectId: true },
        },
      },
    });
    if (!attachment) throw new NotFoundException('Attachment not found');
    const memberId = auth.kind === 'member' ? auth.memberId : null;
    const party =
      memberId !== null &&
      (attachment.evaluation.evaluatorId === memberId ||
        attachment.evaluation.subjectId === memberId);
    if (!party && !auth.permissions.has(PERMISSIONS.EVALS_READ_ALL)) {
      throw new ForbiddenException('Not your evaluation');
    }
    return {
      attachment,
      object: await this.storage.get(attachment.storageKey),
    };
  }

  /** Editing an in-use template creates a new version (submitted evals pin the old one). */
  async reviseTemplate(
    templateId: number,
    opts: {
      signoffCredentialTypeIds?: number[];
      nodes?: TemplateNodeInput[];
      items?: TemplateItemInput[];
      attachments?: AttachmentRequirement;
      phiWarning?: boolean;
    },
  ) {
    const existing = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: {
        _count: { select: { evaluations: true } },
        signoffCredentialTypes: { select: { id: true } },
      },
    });
    if (!existing) throw new NotFoundException('Template not found');

    const signoffCredentialTypeIds =
      opts.signoffCredentialTypeIds ??
      existing.signoffCredentialTypes.map((type) => type.id);
    this.assertChecklist(existing.kind, signoffCredentialTypeIds);
    const nodes = toNodes(opts.nodes, opts.items);

    // A checklist is never re-versioned: sign-offs point at item rows, and
    // moving a trainee's half-finished checklist onto fresh rows would erase
    // work that was already witnessed. Editing one in place is deliberate.
    const inUse =
      existing.kind === 'CHECKLIST' ? false : existing._count.evaluations > 0;

    // The next free number for this name, rather than existing + 1: name and
    // version are unique together, and an archived version further along
    // would turn an edit into a constraint violation.
    const highest = await this.prisma.evalFormTemplate.aggregate({
      where: { name: existing.name },
      _max: { version: true },
    });
    const nextVersion = (highest._max.version ?? existing.version) + 1;

    if (!inUse) {
      await this.prisma.evalFormGroup.deleteMany({ where: { templateId } });
      await this.prisma.evalFormItem.deleteMany({ where: { templateId } });
      await this.prisma.evalFormTemplate.update({
        where: { id: templateId },
        // `set` rather than `connect`: removing a credential from the list has
        // to actually remove it.
        data: {
          // The number goes up on every edit, including the ones made in
          // place. A form nobody has filled in yet is still a different form
          // afterwards, and "v3" is how somebody holding a printout knows
          // theirs is stale.
          version: nextVersion,
          signoffCredentialTypes: {
            set: signoffCredentialTypeIds.map((id) => ({ id })),
          },
          ...(opts.attachments === undefined
            ? {}
            : { attachments: opts.attachments }),
          ...(opts.phiWarning === undefined
            ? {}
            : { phiWarning: opts.phiWarning }),
        },
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
        version: nextVersion,
        attachments: opts.attachments ?? existing.attachments,
        phiWarning: opts.phiWarning ?? existing.phiWarning,
        ...(signoffCredentialTypeIds.length
          ? {
              signoffCredentialTypes: {
                connect: signoffCredentialTypeIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });
    await this.writeNodes(created.id, nodes);
    return this.prisma.evalFormTemplate.findUniqueOrThrow({
      where: { id: created.id },
      include: EvalsService.TEMPLATE_INCLUDE,
    });
  }

  // ---- evaluations ----

  async create(
    evaluatorId: number,
    subjectId: number,
    templateId: number,
    evalDate?: string,
  ) {
    if (evaluatorId === subjectId) {
      throw new BadRequestException('You cannot evaluate yourself');
    }
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template?.active) {
      throw new BadRequestException('Template not found or inactive');
    }
    if (template.kind !== 'EVALUATION') {
      throw new BadRequestException(
        'That form is a checklist, not an evaluation',
      );
    }
    // Refused here rather than at the first save: starting an evaluation you
    // cannot finish wastes the trainee's time as well as your own.
    await this.assertQualified(evaluatorId, templateId);

    return this.prisma.evaluation.create({
      data: {
        templateId,
        evaluatorId,
        subjectId,
        evalDate: evalDate ? new Date(evalDate) : null,
      },
    });
  }

  /**
   * Every item on a template, wherever it sits, for checking what the trainee
   * may and must fill in.
   */
  private async templateItems(templateId: number) {
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: {
        items: { where: { groupId: null } },
        groups: { include: { items: true } },
      },
    });
    if (!template?.active) {
      throw new BadRequestException('Template not found or inactive');
    }
    return {
      template,
      items: [...template.items, ...template.groups.flatMap((g) => g.items)],
    };
  }

  /**
   * Who may complete a given form: holders of evals:write who also hold one
   * of the credentials it calls for, or anything above one on the ladder.
   *
   * A form naming no credential is open to anyone who may write evaluations,
   * which is the ordinary case — the requirement is for the forms where it
   * matters that a crew chief, not merely a trainer, signs it off.
   */
  async eligibleEvaluators(templateId: number) {
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: {
        signoffCredentialTypes: { select: { key: true, name: true } },
      },
    });
    if (!template) throw new NotFoundException('Template not found');

    const writers = await this.permissionHolders.membersWith(
      PERMISSIONS.EVALS_WRITE,
    );
    const required = template.signoffCredentialTypes;
    if (!required.length) return { required, members: writers };

    const members: typeof writers = [];
    for (const member of writers) {
      if (
        await this.holdsOneOf(
          member.id,
          required.map((r) => r.key),
        )
      ) {
        members.push(member);
      }
    }
    return { required, members };
  }

  /** Whether this member may complete a given form. */
  async canComplete(memberId: number, templateId: number): Promise<boolean> {
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      select: { signoffCredentialTypes: { select: { key: true } } },
    });
    return this.holdsOneOf(
      memberId,
      (template?.signoffCredentialTypes ?? []).map(
        (credential) => credential.key,
      ),
    );
  }

  /** Whether a member holds any of these credentials, or anything above one. */
  private async holdsOneOf(memberId: number, keys: string[]): Promise<boolean> {
    if (!keys.length) return true;
    const held = await this.graph.heldKeys(memberId);
    for (const key of keys) {
      if (await this.graph.satisfies(held, key)) return true;
    }
    return false;
  }

  /**
   * Refuses an evaluator the form does not qualify.
   *
   * Checked when the evaluation is asked for and again when it is filled in:
   * a credential can be revoked between the two, and the second check is the
   * one that decides whose assessment this is.
   */
  private async assertQualified(evaluatorId: number, templateId: number) {
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: {
        signoffCredentialTypes: { select: { key: true, name: true } },
      },
    });
    const required = template?.signoffCredentialTypes ?? [];
    if (!required.length) return;
    if (
      await this.holdsOneOf(
        evaluatorId,
        required.map((r) => r.key),
      )
    )
      return;
    throw new ForbiddenException(
      `This evaluation is completed by ${required
        .map((credential) => credential.name)
        .join(' or ')}, or above.`,
    );
  }

  /**
   * A trainee asking to be evaluated.
   *
   * The evaluation is created already carrying whatever the trainee filled
   * in, and lands in the trainer's inbox as something to do. Required
   * trainee fields are checked here rather than left for the trainer to chase
   * — the point of asking for them is that the trainer should not have to.
   */
  async request(
    traineeId: number,
    input: {
      templateId: number;
      evaluatorId: number;
      evalDate?: string;
      scores?: ScoreInput[];
    },
  ) {
    if (traineeId === input.evaluatorId) {
      throw new BadRequestException(
        'You cannot ask yourself for an evaluation',
      );
    }
    const { template, items } = await this.templateItems(input.templateId);
    if (template.kind !== 'EVALUATION') {
      throw new BadRequestException(
        'That form is a checklist, not an evaluation',
      );
    }

    const evaluator = await this.prisma.member.findUnique({
      where: { id: input.evaluatorId },
      select: {
        id: true,
        active: true,
        firstName: true,
        preferredFirstName: true,
        lastName: true,
      },
    });
    if (!evaluator?.active) throw new NotFoundException('Trainer not found');
    await this.assertQualified(input.evaluatorId, input.templateId);

    const byItem = new Map(
      (input.scores ?? []).map((score) => [score.itemId, score]),
    );
    const traineeItems = items.filter((item) => item.traineeInput !== 'NONE');
    const missing = traineeItems
      .filter((item) => item.traineeInput === 'REQUIRED')
      .filter((item) => !hasAnswer(byItem.get(item.id)));
    if (missing.length) {
      throw new BadRequestException(
        `Fill in ${missing.map((item) => `“${item.prompt}”`).join(', ')} before sending this.`,
      );
    }

    const trainee = await this.prisma.member.findUniqueOrThrow({
      where: { id: traineeId },
      select: { firstName: true, preferredFirstName: true, lastName: true },
    });

    const evaluation = await this.prisma.evaluation.create({
      data: {
        templateId: input.templateId,
        evaluatorId: input.evaluatorId,
        subjectId: traineeId,
        requestedById: traineeId,
        requestedAt: new Date(),
        evalDate: input.evalDate ? new Date(input.evalDate) : null,
        // Only what the trainee was invited to answer: anything else arriving
        // in the request is not theirs to set.
        scores: {
          create: traineeItems
            .map((item) => byItem.get(item.id))
            .filter((score): score is ScoreInput => !!score)
            .map((score) => ({
              itemId: score.itemId,
              scaleValue: score.scaleValue ?? null,
              passed: score.passed ?? null,
              textValue: score.textValue ?? null,
              optionValue: score.optionValue ?? null,
              optionValues: score.optionValues ?? [],
              numberValue: score.numberValue ?? null,
            })),
        },
      },
    });

    await this.notifications.notify(input.evaluatorId, {
      type: 'eval.requested',
      subject: `Evaluation to fill in: ${displayName(trainee)}`,
      body:
        `${displayName(trainee)} has asked you for a ` +
        `${template.name}${input.evalDate ? ` for ${input.evalDate}` : ''}.`,
      task: {
        actionLabel: 'Fill in the evaluation',
        actionUrl: `/evals/${evaluation.id}`,
      },
    });
    return evaluation;
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
      throw new ForbiddenException(
        'Only the evaluator can edit this evaluation',
      );
    }
    if (evaluation.status === 'SIGNED') {
      throw new BadRequestException('Signed evaluations are immutable');
    }
    await this.assertQualified(evaluatorId, evaluation.templateId);

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
    // A form that insists on documentation is not finished without it, and
    // the moment to say so is before it becomes a record rather than after.
    if (opts.submit) {
      const form = await this.prisma.evaluation.findUniqueOrThrow({
        where: { id: evaluationId },
        select: {
          template: { select: { attachments: true, name: true } },
          _count: { select: { attachments: true } },
        },
      });
      if (
        form.template.attachments === 'REQUIRED' &&
        form._count.attachments === 0
      ) {
        throw new BadRequestException(
          `${form.template.name} needs at least one attachment before it can be submitted.`,
        );
      }
    }

    const updated = await this.prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        ...(opts.notes !== undefined ? { notes: opts.notes } : {}),
        ...(opts.outcome !== undefined ? { outcome: opts.outcome } : {}),
        ...(opts.readyForPromotion !== undefined
          ? { readyForPromotion: opts.readyForPromotion }
          : {}),
        ...(opts.submit
          ? { status: 'SUBMITTED', signedByEvaluator: new Date() }
          : {}),
      },
      include: {
        scores: true,
        subject: { select: { id: true } },
        template: true,
      },
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

  /**
   * The trainee correcting their own answers on a request they made.
   *
   * Confined to the items marked for trainee input, and only while the
   * evaluation is still a draft: once the trainer has submitted it, it is
   * their assessment and not something the subject may edit.
   */
  async saveTraineeScores(
    traineeId: number,
    evaluationId: number,
    scores: ScoreInput[],
  ) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    if (evaluation.subjectId !== traineeId) {
      throw new ForbiddenException('Not your evaluation');
    }
    if (evaluation.status !== 'DRAFT') {
      throw new BadRequestException(
        'This evaluation has been submitted; ask the trainer to change it.',
      );
    }

    const { items } = await this.templateItems(evaluation.templateId);
    const mine = new Set(
      items
        .filter((item) => item.traineeInput !== 'NONE')
        .map((item) => item.id),
    );
    const allowed = scores.filter((score) => mine.has(score.itemId));
    if (allowed.length !== scores.length) {
      throw new ForbiddenException(
        'Some of those answers are the trainer’s to give',
      );
    }

    for (const score of allowed) {
      const value = {
        scaleValue: score.scaleValue ?? null,
        passed: score.passed ?? null,
        textValue: score.textValue ?? null,
        optionValue: score.optionValue ?? null,
        optionValues: score.optionValues ?? [],
        numberValue: score.numberValue ?? null,
      };
      await this.prisma.evalScore.upsert({
        where: { evaluationId_itemId: { evaluationId, itemId: score.itemId } },
        create: { evaluationId, itemId: score.itemId, ...value },
        update: value,
      });
    }
    return this.get(evaluationId, traineeId, false);
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
    } else if (
      memberId === evaluation.subjectId &&
      !evaluation.signedBySubject
    ) {
      data.signedBySubject = new Date();
    } else {
      throw new ForbiddenException(
        'You are not a party to this evaluation, or you already signed',
      );
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

  /**
   * One evaluation, with whether this viewer may actually complete it.
   *
   * The flag is returned rather than the record being refused: an evaluator
   * whose credential lapsed should see what they were asked for and why they
   * can no longer fill it in, not a page that looks broken.
   */
  async get(evaluationId: number, viewerId: number, canReadAll: boolean) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        // The same shape the editor writes: loose items and groups, each
        // holding its position. A flat list of every item cannot be rendered
        // in order, because a grouped item's `order` counts within its group.
        template: { include: EvalsService.TEMPLATE_INCLUDE },
        scores: true,
        attachments: { orderBy: { position: 'asc' } },
        evaluator: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
        subject: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    const party =
      evaluation.evaluatorId === viewerId || evaluation.subjectId === viewerId;
    if (!party && !canReadAll) {
      throw new ForbiddenException('Not your evaluation');
    }

    const required = await this.prisma.evalFormTemplate.findUnique({
      where: { id: evaluation.templateId },
      select: { signoffCredentialTypes: { select: { key: true, name: true } } },
    });
    const requires = required?.signoffCredentialTypes ?? [];
    const mayComplete =
      evaluation.evaluatorId === viewerId &&
      (await this.holdsOneOf(
        viewerId,
        requires.map((r) => r.key),
      ));

    return { ...evaluation, requires, mayComplete };
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
        evaluator: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
        subject: {
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
  }

  listAbout(subjectId: number) {
    return this.prisma.evaluation.findMany({
      where: { subjectId },
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
  }
}
