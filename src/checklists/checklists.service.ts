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

const TEMPLATE_INCLUDE = {
  signoffCredentialType: { select: { id: true, key: true, name: true } },
  // Loose items only; grouped ones come through their group.
  items: {
    where: { groupId: null },
    orderBy: { order: 'asc' },
    include: {
      signoffCredentialType: { select: { id: true, key: true, name: true } },
    },
  },
  groups: {
    orderBy: { order: 'asc' },
    include: {
      items: {
        orderBy: { order: 'asc' },
        include: {
          signoffCredentialType: { select: { id: true, key: true, name: true } },
        },
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
      include: { credentialType: { select: { id: true, key: true, name: true } } },
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
   * Who this checklist is currently for: active members who do not yet hold
   * the credential it leads to. A checklist attached to no credential applies
   * to everyone, since nothing says who has finished with it.
   */
  async subjects(templateId: number) {
    const template = await this.templateOrThrow(templateId);
    const credential = await this.leadsTo(templateId);
    const lineIds = this.lines(template);

    const members = await this.prisma.member.findMany({
      where: {
        active: true,
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
      return {
        member,
        signed: mine.length,
        total: lineIds.length,
        complete: lineIds.length > 0 && mine.length === lineIds.length,
        lastSignedAt: lastAt,
      };
    });
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
      signoffCredentialType: { id: number; key: string; name: string } | null;
    }) => ({
      ...item,
      signoff: byItem.get(item.id) ?? null,
      // What this line needs, resolved: the item's own bar if it raises one,
      // otherwise the checklist's.
      requires: item.signoffCredentialType ?? template.signoffCredentialType,
    });

    const lineIds = this.lines(template);
    return {
      template: {
        id: template.id,
        name: template.name,
        version: template.version,
        signoffCredentialType: template.signoffCredentialType,
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

  /** Checklists that apply to this member, with their own progress. */
  async mine(memberId: number) {
    const templates = await this.listTemplates();
    const held = await this.graph.heldKeys(memberId);
    const out: Array<Awaited<ReturnType<ChecklistsService['progress']>>> = [];
    for (const template of templates) {
      // Finished with it once they hold what it leads to.
      const done = await Promise.all(
        template.leadsTo.map((credential) =>
          this.graph.satisfies(held, credential.key),
        ),
      );
      if (template.leadsTo.length && done.every(Boolean)) continue;
      out.push(await this.progress(template.id, memberId));
    }
    return out;
  }

  /** The credential a signer needs for one line, item override included. */
  private async requiredFor(itemId: number) {
    const item = await this.prisma.evalFormItem.findUnique({
      where: { id: itemId },
      include: {
        signoffCredentialType: true,
        template: { include: { signoffCredentialType: true } },
      },
    });
    if (!item) throw new NotFoundException('Checklist item not found');
    if (item.template.kind !== 'CHECKLIST') {
      throw new BadRequestException('That item is not on a checklist');
    }
    if (item.scoreType === 'HEADING') {
      throw new BadRequestException('A heading is not signed off');
    }
    const required =
      item.signoffCredentialType ?? item.template.signoffCredentialType;
    if (!required) {
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

    const held = await this.graph.heldKeys(signerId);
    if (!(await this.graph.satisfies(held, required.key))) {
      throw new ForbiddenException(
        `Signing this line needs ${required.name} or above`,
      );
    }

    const already = await this.prisma.checklistSignoff.findFirst({
      where: { ...LIVE, itemId, memberId },
    });
    if (already) {
      throw new ConflictException('That line is already signed off');
    }

    const signoff = await this.prisma.checklistSignoff.create({
      data: { itemId, memberId, signedById: signerId, note: note?.trim() || null },
    });
    await this.audit.log(auth, 'checklist.sign', 'ChecklistSignoff', signoff.id, {
      itemId,
      memberId,
      prompt: item.prompt,
    });

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
    await this.audit.log(auth, 'checklist.revoke', 'ChecklistSignoff', signoffId, {
      itemId: signoff.itemId,
      memberId: signoff.memberId,
      reason: reason ?? null,
    });
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
          (credential ? `, which is a requirement for ${credential.name}.` : '.'),
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
        groups: { include: { items: { select: { id: true, scoreType: true } } } },
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
