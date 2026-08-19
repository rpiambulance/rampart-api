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
import { NotificationsService } from '../notifications/notifications.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

/** The live sign-off for an item is the newest one nobody has taken back. */
const LIVE = { revokedAt: null } as const;

const SIGNOFF_SELECT = {
  id: true,
  signedAt: true,
  note: true,
  signedBy: { select: { id: true, firstName: true, lastName: true } },
} as const;

const CREDENTIALS = {
  select: { id: true, key: true, name: true },
} as const;

const TEMPLATE_INCLUDE = {
  signoffCredentialTypes: CREDENTIALS,
  // Loose items only; grouped ones come through their group.
  items: {
    where: { groupId: null },
    orderBy: { order: 'asc' },
    include: { signoffCredentialTypes: CREDENTIALS },
  },
  groups: {
    orderBy: { order: 'asc' },
    include: {
      items: {
        orderBy: { order: 'asc' },
        include: { signoffCredentialTypes: CREDENTIALS },
      },
    },
  },
} as const;

@Injectable()
export class ChecklistsService {
  constructor(
    private readonly audit: AuditService,
    private readonly graph: CredentialGraphService,
    private readonly notifications: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Checklists and the credential each one leads to.
   *
   * A checklist reaches a trainee by being a requirement of a credential, so
   * there is nothing to assign: everyone working toward that credential has
   * it, and everyone who already holds it is done with it.
   */
  async listTemplates() {
    const templates = await this.prisma.evalFormTemplate.findMany({
      where: { kind: 'CHECKLIST', active: true },
      include: TEMPLATE_INCLUDE,
      orderBy: [{ name: 'asc' }, { version: 'desc' }],
    });
    const requirements = await this.prisma.credentialRequirement.findMany({
      where: {
        kind: 'CHECKLIST',
        evalTemplateId: { in: templates.map((t) => t.id) },
      },
      include: {
        credentialType: { select: { id: true, key: true, name: true } },
      },
    });
    return templates.map((template) => ({
      ...template,
      leadsTo: requirements
        .filter((r) => r.evalTemplateId === template.id)
        .map((r) => r.credentialType),
    }));
  }

  /** Every question on the checklist, in order, groups flattened. */
  private lines(template: {
    items: Array<{ id: number; scoreType: string }>;
    groups: Array<{ items: Array<{ id: number; scoreType: string }> }>;
  }): number[] {
    const ids = [
      ...template.items.map((i) => ({ id: i.id, scoreType: i.scoreType })),
      ...template.groups.flatMap((g) =>
        g.items.map((i) => ({ id: i.id, scoreType: i.scoreType })),
      ),
    ];
    return ids.filter((i) => i.scoreType !== 'HEADING').map((i) => i.id);
  }

  private async templateOrThrow(templateId: number) {
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: TEMPLATE_INCLUDE,
    });
    if (!template || template.kind !== 'CHECKLIST') {
      throw new NotFoundException('Checklist not found');
    }
    return template;
  }

  /** The credential this checklist leads to, if it is a requirement of one. */
  private async leadsTo(templateId: number) {
    const requirement = await this.prisma.credentialRequirement.findFirst({
      where: { kind: 'CHECKLIST', evalTemplateId: templateId },
      include: { credentialType: true },
    });
    return requirement?.credentialType ?? null;
  }

  /**
   * Who is working through this checklist: the members started on it, and
   * nobody else. Somebody who has not been started on one has not been asked
   * to do it, and a trainer's list should say who is actually waiting.
   */
  async subjects(templateId: number) {
    const template = await this.templateOrThrow(templateId);
    const lineIds = this.lines(template);

    const enrollments = await this.prisma.checklistEnrollment.findMany({
      where: { templateId, member: { active: true } },
      include: {
        member: { select: { id: true, firstName: true, lastName: true } },
        startedBy: { select: { firstName: true, lastName: true } },
      },
    });
    const members = enrollments
      .map((enrollment) => enrollment.member)
      .sort(
        (a, b) =>
          a.lastName.localeCompare(b.lastName) ||
          a.firstName.localeCompare(b.firstName),
      );

    const signoffs = await this.prisma.checklistSignoff.findMany({
      where: {
        ...LIVE,
        itemId: { in: lineIds },
        memberId: { in: members.map((m) => m.id) },
      },
      select: { memberId: true, itemId: true, signedAt: true },
    });

    return members.map((member) => {
      const mine = signoffs.filter((s) => s.memberId === member.id);
      const lastAt = mine.reduce<Date | null>(
        (latest, s) => (!latest || s.signedAt > latest ? s.signedAt : latest),
        null,
      );
      const enrollment = enrollments.find((e) => e.memberId === member.id);
      return {
        member,
        signed: mine.length,
        total: lineIds.length,
        complete: lineIds.length > 0 && mine.length === lineIds.length,
        lastSignedAt: lastAt,
        startedAt: enrollment?.startedAt ?? null,
        startedBy: enrollment?.startedBy
          ? `${enrollment.startedBy.firstName} ${enrollment.startedBy.lastName}`
          : null,
      };
    });
  }

  /** Active members not yet started on this checklist, for a trainer to add. */
  async notStarted(templateId: number) {
    const credential = await this.leadsTo(templateId);
    const started = new Set(
      (
        await this.prisma.checklistEnrollment.findMany({
          where: { templateId },
          select: { memberId: true },
        })
      ).map((row) => row.memberId),
    );
    const members = await this.prisma.member.findMany({
      where: {
        active: true,
        // Somebody already holding what it leads to has nothing to gain.
        ...(credential
          ? {
              credentials: {
                none: { typeId: credential.id, status: 'ACTIVE' },
              },
            }
          : {}),
      },
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
    return members.filter((member) => !started.has(member.id));
  }

  /**
   * One trainee's checklist: every line, and for the ones already done, who
   * signed and when. Previous work is visible to whoever picks the checklist
   * up next — that is the point of keeping it in one place.
   */
  async progress(templateId: number, memberId: number) {
    const template = await this.templateOrThrow(templateId);
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, firstName: true, lastName: true },
    });
    if (!member) throw new NotFoundException('Member not found');

    const signoffs = await this.prisma.checklistSignoff.findMany({
      where: { ...LIVE, memberId, itemId: { in: this.lines(template) } },
      select: { ...SIGNOFF_SELECT, itemId: true },
      orderBy: { signedAt: 'desc' },
    });
    const byItem = new Map(signoffs.map((s) => [s.itemId, s]));

    const decorate = (item: {
      id: number;
      order: number;
      prompt: string;
      scoreType: string;
      signoffCredentialTypes: Array<{ id: number; key: string; name: string }>;
    }) => ({
      ...item,
      signoff: byItem.get(item.id) ?? null,
      // Who this line needs, resolved: the item's own set if it names one,
      // otherwise the checklist's. Any one of them is enough.
      requires: item.signoffCredentialTypes.length
        ? item.signoffCredentialTypes
        : template.signoffCredentialTypes,
    });

    const lineIds = this.lines(template);
    return {
      template: {
        id: template.id,
        name: template.name,
        version: template.version,
        signoffCredentialTypes: template.signoffCredentialTypes,
      },
      member,
      leadsTo: await this.leadsTo(templateId),
      // Loose items and groups each carry their position: they share one
      // ordering space, so the caller interleaves them rather than showing
      // every group after every loose item.
      items: template.items.map(decorate),
      groups: template.groups.map((group) => ({
        id: group.id,
        order: group.order,
        heading: group.heading,
        description: group.description,
        items: group.items.map(decorate),
      })),
      signed: signoffs.length,
      total: lineIds.length,
      complete: lineIds.length > 0 && signoffs.length === lineIds.length,
    };
  }

  /** Checklists this member has started, with their progress. */
  async mine(memberId: number) {
    const enrollments = await this.prisma.checklistEnrollment.findMany({
      where: { memberId, template: { kind: 'CHECKLIST', active: true } },
      orderBy: { startedAt: 'asc' },
    });
    const out: Array<Awaited<ReturnType<ChecklistsService['progress']>>> = [];
    for (const enrollment of enrollments) {
      out.push(await this.progress(enrollment.templateId, memberId));
    }
    return out;
  }

  /**
   * Checklists this member could start but has not.
   *
   * Filtered to what is still ahead of them: a checklist leading to a
   * credential they already hold has nothing left to offer, and listing it
   * would be inviting somebody to redo qualifying work.
   */
  async availableTo(memberId: number) {
    const templates = await this.listTemplates();
    const started = new Set(
      (
        await this.prisma.checklistEnrollment.findMany({
          where: { memberId },
          select: { templateId: true },
        })
      ).map((row) => row.templateId),
    );
    const held = await this.graph.heldKeys(memberId);

    const out: typeof templates = [];
    for (const template of templates) {
      if (started.has(template.id)) continue;
      const done = await Promise.all(
        template.leadsTo.map((credential) =>
          this.graph.satisfies(held, credential.key),
        ),
      );
      if (template.leadsTo.length && done.every(Boolean)) continue;
      out.push(template);
    }
    return out;
  }

  /**
   * Starts a checklist for somebody.
   *
   * Your own is always yours to start. Starting one for another member is a
   * trainer's job, so it asks for the same credential signing a line does —
   * the person who would be signing it is the person who should be putting
   * them on it.
   */
  async start(auth: AuthContext, templateId: number, memberId: number) {
    const actorId = auth.kind === 'member' ? auth.memberId : null;
    const template = await this.templateOrThrow(templateId);

    if (actorId !== memberId) {
      const required = template.signoffCredentialTypes;
      const held = actorId
        ? await this.graph.heldKeys(actorId)
        : new Set<string>();
      const qualifies = await Promise.all(
        required.map((credential) =>
          this.graph.satisfies(held, credential.key),
        ),
      );
      if (!qualifies.some(Boolean)) {
        throw new ForbiddenException(
          `Starting this for somebody else needs ${required
            .map((credential) => credential.name)
            .join(' or ')}, or above.`,
        );
      }
    }

    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { active: true, firstName: true, lastName: true },
    });
    if (!member?.active) throw new NotFoundException('Member not found');

    // Idempotent: starting one that is already going is not an error, it is
    // the same state somebody expected to arrive at.
    const enrollment = await this.prisma.checklistEnrollment.upsert({
      where: { templateId_memberId: { templateId, memberId } },
      create: { templateId, memberId, startedById: actorId },
      update: {},
    });

    await this.audit.log(
      auth,
      'checklist.start',
      'ChecklistEnrollment',
      enrollment.id,
      {
        templateId,
        memberId,
        checklist: template.name,
      },
    );

    // Told only when somebody else put them on it; starting your own needs no
    // announcement.
    if (actorId !== memberId) {
      await this.notifications.notify(memberId, {
        type: 'checklist.started',
        subject: `Checklist to work through: ${template.name}`,
        body: `You have been started on ${template.name}. Trainers sign each line as they see it done.`,
        task: {
          actionLabel: 'See what it asks for',
          actionUrl: `/checklists/${templateId}/${memberId}`,
        },
      });
    }
    return enrollment;
  }

  /**
   * Takes somebody off a checklist they should not have been started on.
   *
   * Refused once anything has been signed: that is a record of work somebody
   * witnessed, and dropping the enrolment would orphan it.
   */
  async unstart(auth: AuthContext, templateId: number, memberId: number) {
    const template = await this.templateOrThrow(templateId);
    const signed = await this.prisma.checklistSignoff.count({
      where: { ...LIVE, memberId, itemId: { in: this.lines(template) } },
    });
    if (signed) {
      throw new BadRequestException(
        'Lines have already been signed off; withdraw those first.',
      );
    }
    await this.prisma.checklistEnrollment.deleteMany({
      where: { templateId, memberId },
    });
    await this.audit.log(
      auth,
      'checklist.unstart',
      'ChecklistEnrollment',
      undefined,
      {
        templateId,
        memberId,
      },
    );
    return { ok: true };
  }

  /** Who may sign one line: the item's own set, or the checklist's. */
  private async requiredFor(itemId: number) {
    const item = await this.prisma.evalFormItem.findUnique({
      where: { id: itemId },
      include: {
        signoffCredentialTypes: true,
        template: { include: { signoffCredentialTypes: true } },
      },
    });
    if (!item) throw new NotFoundException('Checklist item not found');
    if (item.template.kind !== 'CHECKLIST') {
      throw new BadRequestException('That item is not on a checklist');
    }
    if (item.scoreType === 'HEADING') {
      throw new BadRequestException('A heading is not signed off');
    }
    const required = item.signoffCredentialTypes.length
      ? item.signoffCredentialTypes
      : item.template.signoffCredentialTypes;
    if (!required.length) {
      throw new BadRequestException(
        'This checklist does not say who may sign it',
      );
    }
    return { item, required };
  }

  async sign(
    auth: AuthContext,
    signerId: number,
    itemId: number,
    memberId: number,
    note?: string,
  ) {
    if (signerId === memberId) {
      throw new BadRequestException('You cannot sign off your own checklist');
    }
    const { item, required } = await this.requiredFor(itemId);

    // Any one of them qualifies, each satisfied by itself or anything above
    // it on the ladder.
    const held = await this.graph.heldKeys(signerId);
    const qualifies = await Promise.all(
      required.map((credential) => this.graph.satisfies(held, credential.key)),
    );
    if (!qualifies.some(Boolean)) {
      const names = required.map((credential) => credential.name);
      throw new ForbiddenException(
        names.length === 1
          ? `Signing this line needs ${names[0]} or above`
          : `Signing this line needs ${names.slice(0, -1).join(', ')} or ${
              names[names.length - 1]
            }, or above`,
      );
    }

    const already = await this.prisma.checklistSignoff.findFirst({
      where: { ...LIVE, itemId, memberId },
    });
    if (already) {
      throw new ConflictException('That line is already signed off');
    }

    const signoff = await this.prisma.checklistSignoff.create({
      data: {
        itemId,
        memberId,
        signedById: signerId,
        note: note?.trim() || null,
      },
    });
    await this.audit.log(
      auth,
      'checklist.sign',
      'ChecklistSignoff',
      signoff.id,
      {
        itemId,
        memberId,
        prompt: item.prompt,
      },
    );

    await this.announceIfComplete(item.templateId, memberId);
    return signoff;
  }

  /**
   * Revocation keeps the row and stamps it, so the record still shows that a
   * line was signed and then taken back rather than quietly reverting to
   * never-signed.
   */
  async revoke(
    auth: AuthContext,
    actorId: number,
    signoffId: number,
    reason?: string,
  ) {
    const signoff = await this.prisma.checklistSignoff.findUnique({
      where: { id: signoffId },
      include: { item: { select: { prompt: true } } },
    });
    if (!signoff) throw new NotFoundException('Sign-off not found');
    if (signoff.revokedAt) {
      throw new ConflictException('That sign-off has already been revoked');
    }
    const own = signoff.signedById === actorId;
    if (!own && !auth.permissions.has(PERMISSIONS.CHECKLISTS_REVOKE)) {
      throw new ForbiddenException(
        'Only the trainer who signed this may take it back',
      );
    }

    const updated = await this.prisma.checklistSignoff.update({
      where: { id: signoffId },
      data: {
        revokedAt: new Date(),
        revokedById: actorId,
        revokeReason: reason?.trim() || null,
      },
    });
    await this.audit.log(
      auth,
      'checklist.revoke',
      'ChecklistSignoff',
      signoffId,
      {
        itemId: signoff.itemId,
        memberId: signoff.memberId,
        reason: reason ?? null,
      },
    );
    await this.notifications.notify(signoff.memberId, {
      type: 'checklist.revoked',
      subject: `A checklist sign-off was withdrawn: ${signoff.item.prompt}`,
      body:
        `"${signoff.item.prompt}" has been un-signed and needs doing again.` +
        (reason?.trim() ? ` Reason given: ${reason.trim()}` : ''),
    });
    return updated;
  }

  /** Tells the trainee and the people who can act on it once nothing is left. */
  private async announceIfComplete(templateId: number, memberId: number) {
    const template = await this.templateOrThrow(templateId);
    const lineIds = this.lines(template);
    if (!lineIds.length) return;

    const signed = await this.prisma.checklistSignoff.count({
      where: { ...LIVE, memberId, itemId: { in: lineIds } },
    });
    if (signed !== lineIds.length) return;

    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { firstName: true, lastName: true },
    });
    const who = `${member?.firstName ?? ''} ${member?.lastName ?? ''}`.trim();
    const credential = await this.leadsTo(templateId);

    await this.notifications.notify(memberId, {
      type: 'checklist.complete',
      subject: `Checklist finished: ${template.name}`,
      body:
        `Every line of ${template.name} has been signed off.` +
        (credential ? ` It counts toward ${credential.name}.` : ''),
    });
    await this.notifications.notifyPermissionHolders(
      PERMISSIONS.CREDENTIALS_GRANT,
      {
        type: 'checklist.complete.officers',
        subject: `${who} finished ${template.name}`,
        body:
          `${who} has every line of ${template.name} signed off` +
          (credential
            ? `, which is a requirement for ${credential.name}.`
            : '.'),
        task: {
          actionLabel: 'Review the checklist',
          actionUrl: `/checklists/${templateId}/${memberId}`,
        },
      },
    );
  }

  /** Whether a member has finished a checklist — for credential requirements. */
  async isComplete(templateId: number, memberId: number): Promise<boolean> {
    const template = await this.prisma.evalFormTemplate.findUnique({
      where: { id: templateId },
      include: {
        items: {
          where: { groupId: null },
          select: { id: true, scoreType: true },
        },
        groups: {
          include: { items: { select: { id: true, scoreType: true } } },
        },
      },
    });
    if (!template) return false;
    const lineIds = this.lines(template);
    if (!lineIds.length) return false;
    const signed = await this.prisma.checklistSignoff.count({
      where: { ...LIVE, memberId, itemId: { in: lineIds } },
    });
    return signed === lineIds.length;
  }
}
