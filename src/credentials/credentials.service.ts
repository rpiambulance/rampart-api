import {
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { nyToday } from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { CertificationGraphService } from '../certifications/certification-graph.service';
import { ChecklistsService } from '../checklists/checklists.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialGraphService } from './credential-graph.service';

export const SDS_TITLE = 'Senior Duty Supervisor';

function requirementLabelFor(req: {
  kind: string;
  count: number | null;
  certificationType: { name: string } | null;
  evalTemplate: { name: string } | null;
  class: { name: string } | null;
}): string {
  if (req.kind === 'CERTIFICATION' && req.certificationType) {
    return `Verified ${req.certificationType.name}`;
  }
  if (req.kind === 'EVALUATION_COUNT' && req.evalTemplate) {
    return `${req.count} signed “${req.evalTemplate.name}” evaluations`;
  }
  if (req.kind === 'CLASS' && req.class) {
    return `Complete ${req.class.name}`;
  }
  return 'Requirement';
}

export interface ChecklistItem {
  kind:
    | 'CERTIFICATION'
    | 'EVALUATION_COUNT'
    | 'CLASS'
    | 'CHECKLIST'
    | 'PREREQUISITE'
    | 'CUSTOM';
  label: string;
  satisfied: boolean;
  detail?: string;
  waived?: boolean;
  adjustmentId?: number; // present for waived/additional items
  requirementId?: number; // present for base requirements (waive target)
}

@Injectable()
export class CredentialsService {
  constructor(
    private readonly certGraph: CertificationGraphService,
    private readonly checklists: ChecklistsService,
    private readonly prisma: PrismaService,
    private readonly graph: CredentialGraphService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  listTypes() {
    return this.prisma.credentialType.findMany({
      where: { active: true },
      include: {
        prerequisites: { include: { requiresType: { select: { key: true } } } },
        linkedRoles: { include: { role: { select: { id: true, name: true } } } },
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

  async setLinkedRoles(credentialTypeId: number, roleIds: number[]) {
    await this.prisma.credentialTypeRole.deleteMany({
      where: { credentialTypeId },
    });
    if (roleIds.length) {
      await this.prisma.credentialTypeRole.createMany({
        data: [...new Set(roleIds)].map((roleId) => ({ credentialTypeId, roleId })),
      });
    }
    return this.prisma.credentialType.findUnique({
      where: { id: credentialTypeId },
      include: { linkedRoles: { include: { role: true } } },
    });
  }

  addRequirement(
    credentialTypeId: number,
    data: {
      kind: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS' | 'CHECKLIST';
      certificationTypeId?: number;
      evalTemplateId?: number;
      count?: number;
      classId?: number;
    },
  ) {
    if (data.kind === 'CERTIFICATION' && !data.certificationTypeId) {
      throw new BadRequestException('certificationTypeId required');
    }
    if (data.kind === 'EVALUATION_COUNT' && (!data.evalTemplateId || !data.count)) {
      throw new BadRequestException('evalTemplateId and count required');
    }
    if (data.kind === 'CHECKLIST' && !data.evalTemplateId) {
      throw new BadRequestException('evalTemplateId required');
    }
    if (data.kind === 'CLASS' && !data.classId) {
      throw new BadRequestException('classId required');
    }
    return this.prisma.credentialRequirement.create({
      data: { credentialTypeId, ...data },
    });
  }

  async removeRequirement(requirementId: number) {
    await this.prisma.credentialRequirement.delete({
      where: { id: requirementId },
    });
    return { ok: true };
  }

  /** Requirement checklist for member × credential type (for My Training + promotion review). */
  async checklist(memberId: number, credentialTypeId: number): Promise<ChecklistItem[]> {
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
    if (!type) throw new NotFoundException('Credential type not found');

    const held = await this.graph.heldKeys(memberId);
    const adjustments = await this.prisma.promotionRequirementAdjustment.findMany({
      where: { memberId, credentialTypeId },
      include: {
        certificationType: true,
        evalTemplate: true,
        class: true,
      },
    });
    const waivers = new Map(
      adjustments
        .filter((a) => a.kind === 'WAIVER' && a.requirementId != null)
        .map((a) => [a.requirementId!, a]),
    );
    const items: ChecklistItem[] = [];

    for (const prereq of type.prerequisites) {
      items.push({
        kind: 'PREREQUISITE',
        label: `Hold ${prereq.requiresType.name}`,
        // "or above" — holding a credential further up the chain counts.
        satisfied: await this.graph.satisfies(held, prereq.requiresType.key),
      });
    }

    const today = nyToday();
    for (const req of type.requirements) {
      const waiver = waivers.get(req.id);
      if (waiver) {
        items.push({
          kind: req.kind as ChecklistItem['kind'],
          label: `${requirementLabelFor(req)} — waived`,
          satisfied: true,
          waived: true,
          detail: waiver.note ?? undefined,
          adjustmentId: waiver.id,
          requirementId: req.id,
        });
        continue;
      }
      if (req.kind === 'CERTIFICATION' && req.certificationType) {
        // A higher certification answers the requirement: a Paramedic meets a
        // requirement for EMT.
        const accepted = await this.certGraph.satisfying(
          req.certificationTypeId!,
        );
        const cert = await this.prisma.memberCertification.findFirst({
          where: {
            memberId,
            typeId: { in: accepted },
            status: 'VERIFIED',
            OR: [{ expiresAt: null }, { expiresAt: { gte: today } }],
          },
        });
        items.push({
          kind: 'CERTIFICATION',
          label: `Verified ${req.certificationType.name}`,
          satisfied: !!cert,
          requirementId: req.id,
        });
      } else if (req.kind === 'EVALUATION_COUNT' && req.evalTemplate) {
        const count = await this.prisma.evaluation.count({
          where: {
            subjectId: memberId,
            templateId: req.evalTemplateId!,
            status: 'SIGNED',
          },
        });
        items.push({
          kind: 'EVALUATION_COUNT',
          label: `${req.count} signed “${req.evalTemplate.name}” evaluations`,
          satisfied: count >= (req.count ?? 1),
          detail: `${count}/${req.count}`,
          requirementId: req.id,
        });
      } else if (req.kind === 'CHECKLIST' && req.evalTemplate) {
        // Every line signed off, by whoever each line calls for.
        const done = await this.checklists.isComplete(req.evalTemplateId!, memberId);
        items.push({
          kind: 'CHECKLIST',
          label: `Complete the “${req.evalTemplate.name}” checklist`,
          satisfied: done,
          requirementId: req.id,
        });
      } else if (req.kind === 'CLASS' && req.class) {
        const attendance = await this.prisma.classAttendance.findUnique({
          where: { classId_memberId: { classId: req.classId!, memberId } },
        });
        items.push({
          kind: 'CLASS',
          label: `Complete ${req.class.name}`,
          satisfied: attendance?.status === 'COMPLETED',
          requirementId: req.id,
        });
      }
    }

    // Member-specific additional requirements
    for (const adjustment of adjustments.filter((a) => a.kind === 'ADDITIONAL')) {
      if (adjustment.reqKind === 'CERTIFICATION' && adjustment.certificationType) {
        const cert = await this.prisma.memberCertification.findFirst({
          where: {
            memberId,
            typeId: adjustment.certificationTypeId!,
            status: 'VERIFIED',
            OR: [{ expiresAt: null }, { expiresAt: { gte: today } }],
          },
        });
        items.push({
          kind: 'CERTIFICATION',
          label: `Additional: verified ${adjustment.certificationType.name}`,
          satisfied: !!cert,
          adjustmentId: adjustment.id,
        });
      } else if (adjustment.reqKind === 'EVALUATION_COUNT' && adjustment.evalTemplate) {
        const count = await this.prisma.evaluation.count({
          where: {
            subjectId: memberId,
            templateId: adjustment.evalTemplateId!,
            status: 'SIGNED',
          },
        });
        items.push({
          kind: 'EVALUATION_COUNT',
          label: `Additional: ${adjustment.count} signed “${adjustment.evalTemplate.name}” evaluations`,
          satisfied: count >= (adjustment.count ?? 1),
          detail: `${count}/${adjustment.count}`,
          adjustmentId: adjustment.id,
        });
      } else if (adjustment.reqKind === 'CLASS' && adjustment.class) {
        const attendance = await this.prisma.classAttendance.findUnique({
          where: {
            classId_memberId: { classId: adjustment.classId!, memberId },
          },
        });
        items.push({
          kind: 'CLASS',
          label: `Additional: complete ${adjustment.class.name}`,
          satisfied: attendance?.status === 'COMPLETED',
          adjustmentId: adjustment.id,
        });
      } else {
        // free-text requirement, checked off manually
        items.push({
          kind: 'CUSTOM',
          label: adjustment.note ?? 'Additional requirement',
          satisfied: adjustment.satisfiedAt != null,
          adjustmentId: adjustment.id,
        });
      }
    }
    return items;
  }

  /** Direct grant (corrections/migration) — permission credentials:grant. */
  async grant(
    auth: AuthContext,
    memberId: number,
    credentialTypeId: number,
    opts: {
      title?: string;
      grantedViaId?: number;
      /** When the member actually earned it; omit if not yet known. */
      effectiveAt?: Date | null;
    } = {},
  ) {
    const existing = await this.prisma.memberCredential.findUnique({
      where: { memberId_typeId: { memberId, typeId: credentialTypeId } },
    });
    if (existing && existing.status === 'ACTIVE') {
      throw new ConflictException('Member already holds this credential');
    }
    const credential = existing
      ? await this.prisma.memberCredential.update({
          where: { id: existing.id },
          data: {
            status: 'ACTIVE',
            title: opts.title ?? null,
            grantedAt: new Date(),
            effectiveAt: opts.effectiveAt ?? null,
            grantedViaId: opts.grantedViaId ?? null,
            revokedAt: null,
          },
        })
      : await this.prisma.memberCredential.create({
          data: {
            memberId,
            typeId: credentialTypeId,
            title: opts.title ?? null,
            effectiveAt: opts.effectiveAt ?? null,
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

  /**
   * Records (or corrects) the date a member actually earned a credential.
   * Backfilled credentials are commonly granted before anyone has dug the
   * real promotion date out of the old records, so this can be filled in
   * long after the fact. Passing null clears it back to unknown.
   */
  /**
   * What a trainer may clear a member for. Authority comes from the trainer's
   * own credential rather than a permission: a crew chief trainer clears the
   * entry rung of the crew chief track, a driver trainer the driver one.
   */
  private static readonly TRAINER_GRANTS: Array<{
    trainer: string;
    grants: string;
  }> = [
    { trainer: 'CC_T', grants: 'A_CC' },
    { trainer: 'D_T', grants: 'A_D' },
  ];

  /** Credentials this member may clear others for, by their own training. */
  async trainerGrants(memberId: number): Promise<string[]> {
    const held = await this.graph.heldKeys(memberId);
    const out: string[] = [];
    for (const rule of CredentialsService.TRAINER_GRANTS) {
      // "or above" — a DS outranks the ladder and may clear either track.
      if (await this.graph.satisfies(held, rule.trainer)) out.push(rule.grants);
    }
    return out;
  }

  /**
   * Who this trainer could actually clear, per credential they may grant.
   *
   * Two exclusions, both of which the trainer would otherwise have to work
   * out by eye from a roster: anyone already at that level or above — a full
   * crew chief does not need clearing as a probationary one — and anyone who
   * has not finished what the credential asks for. The second reuses the
   * promotion checklist, so this page and the promotion path can never
   * disagree about who is ready.
   */
  async trainerCandidates(trainerId: number) {
    const grants = await this.trainerGrants(trainerId);
    if (!grants.length) return [];

    const types = await this.prisma.credentialType.findMany({
      where: { key: { in: grants } },
      include: { prerequisites: { include: { requiresType: true } } },
    });
    const members = await this.prisma.member.findMany({
      where: { active: true, id: { not: trainerId } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        credentials: {
          where: { status: 'ACTIVE' },
          select: { title: true, type: { select: { key: true, name: true } } },
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    const out: Array<{
      key: string;
      name: string;
      members: typeof members;
    }> = [];

    for (const type of types) {
      const eligible: typeof members = [];
      for (const member of members) {
        const held = new Set(member.credentials.map((c) => c.type.key));

        // Already there, or past it.
        if (await this.graph.satisfies(held, type.key)) continue;

        // The cheap half of the checklist first: without the prerequisite
        // there is no point pricing up the rest, and most of the roster is
        // excluded here.
        let prerequisitesMet = true;
        for (const prereq of type.prerequisites) {
          if (!(await this.graph.satisfies(held, prereq.requiresType.key))) {
            prerequisitesMet = false;
            break;
          }
        }
        if (!prerequisitesMet) continue;

        const checklist = await this.checklist(member.id, type.id);
        if (!checklist.every((item) => item.satisfied)) continue;

        eligible.push(member);
      }
      out.push({ key: type.key, name: type.name, members: eligible });
    }
    return out;
  }

  /**
   * A trainer clearing a member for calls. Separate from grant() because the
   * authority is the trainer's credential, not credentials:grant, and because
   * it raises the 900 number that has to follow.
   */
  async trainerGrant(auth: AuthContext, memberId: number, credentialKey: string) {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('This requires a member session');
    }
    const allowed = await this.trainerGrants(auth.memberId);
    if (!allowed.includes(credentialKey)) {
      throw new ForbiddenException(
        `Your training does not let you clear anyone for ${credentialKey.replace(/_/g, '-')}`,
      );
    }
    if (auth.memberId === memberId) {
      throw new ForbiddenException('You cannot clear yourself');
    }

    const type = await this.prisma.credentialType.findUnique({
      where: { key: credentialKey },
    });
    if (!type) throw new NotFoundException('Credential type not found');

    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, firstName: true, lastName: true, nineHundredNumber: true },
    });
    if (!member) throw new NotFoundException('Member not found');

    const credential = await this.grant(auth, memberId, type.id);

    await this.notifications.notify(memberId, {
      type: 'promotion.decided',
      subject: `You are cleared for calls as ${credentialKey.replace(/_/g, '-')}`,
      body: `${type.name} was granted by a trainer.`,
    });

    // The captain issues the number; only raise it if one is actually missing.
    if (!member.nineHundredNumber) {
      await this.notifications.notifyPermissionHolders(
        PERMISSIONS.MEMBERS_WRITE,
        {
          type: 'promotion.number',
          subject: `900 number needed: ${member.firstName} ${member.lastName}`,
          body:
            `${member.firstName} ${member.lastName} was cleared as ` +
            `${credentialKey.replace(/_/g, '-')} and has no 900 number yet.`,
          task: {
            actionLabel: 'Issue the number',
            actionUrl: `/admin/members/${member.id}`,
          },
        },
      );
    }
    return credential;
  }

  async setEffectiveDate(
    auth: AuthContext,
    memberId: number,
    credentialTypeId: number,
    effectiveAt: Date | null,
  ) {
    const existing = await this.prisma.memberCredential.findUnique({
      where: { memberId_typeId: { memberId, typeId: credentialTypeId } },
    });
    if (!existing) {
      throw new NotFoundException('Member does not hold this credential');
    }
    const credential = await this.prisma.memberCredential.update({
      where: { id: existing.id },
      data: { effectiveAt },
    });
    await this.audit.log(
      auth,
      'credentials.set-effective-date',
      'MemberCredential',
      credential.id,
      {
        memberId,
        credentialTypeId,
        from: existing.effectiveAt?.toISOString().slice(0, 10) ?? null,
        to: effectiveAt?.toISOString().slice(0, 10) ?? null,
      },
    );
    return credential;
  }

  /**
   * Captain appointment for APPOINTMENT-granted credentials (DS). Enforces
   * prerequisites (CC-T + D-T + EES for DS). `senior` grants the SDS title —
   * identical credential, different display title (spec §4.2).
   */
  async appoint(
    auth: AuthContext,
    memberId: number,
    credentialKey: string,
    opts: { senior?: boolean } = {},
  ) {
    const typeId = await this.graph.typeIdForKey(credentialKey);
    if (!typeId) throw new NotFoundException('Unknown credential');
    const type = await this.prisma.credentialType.findUniqueOrThrow({
      where: { id: typeId },
      include: { prerequisites: { include: { requiresType: true } } },
    });
    if (type.grantMethod !== 'APPOINTMENT') {
      throw new BadRequestException(
        `${type.name} is granted by promotion, not appointment`,
      );
    }
    const held = await this.graph.heldKeys(memberId);
    const missing: string[] = [];
    for (const p of type.prerequisites) {
      if (!(await this.graph.satisfies(held, p.requiresType.key))) {
        missing.push(p.requiresType.name);
      }
    }
    if (missing.length) {
      throw new BadRequestException(
        `Member is missing prerequisites: ${missing.join(', ')}`,
      );
    }
    const credential = await this.grant(auth, memberId, typeId, {
      title: opts.senior ? SDS_TITLE : undefined,
    });
    await this.audit.log(auth, 'credentials.appoint', 'MemberCredential', credential.id, {
      memberId,
      credentialKey,
      senior: !!opts.senior,
    });
    await this.notifications.notify(memberId, {
      type: 'promotion.decided',
      subject: `Appointed ${opts.senior ? SDS_TITLE : type.name}`,
      body: `You have been appointed ${opts.senior ? SDS_TITLE : type.name}.`,
    });
    return credential;
  }

  async revoke(auth: AuthContext, memberId: number, credentialTypeId: number) {
    const credential = await this.prisma.memberCredential.findUnique({
      where: { memberId_typeId: { memberId, typeId: credentialTypeId } },
    });
    if (!credential) throw new NotFoundException('Credential not held');
    await this.prisma.memberCredential.update({
      where: { id: credential.id },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });
    await this.audit.log(auth, 'credentials.revoke', 'MemberCredential', credential.id);
    return { ok: true };
  }
}
