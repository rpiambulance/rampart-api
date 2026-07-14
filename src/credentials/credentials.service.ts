import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialGraphService } from './credential-graph.service';

export const SDS_TITLE = 'Senior Duty Supervisor';

export interface ChecklistItem {
  kind: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS' | 'PREREQUISITE';
  label: string;
  satisfied: boolean;
  detail?: string;
}

@Injectable()
export class CredentialsService {
  constructor(
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

  addRequirement(
    credentialTypeId: number,
    data: {
      kind: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS';
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
    const items: ChecklistItem[] = [];

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
            typeId: req.certificationTypeId!,
            status: 'VERIFIED',
            OR: [{ expiresAt: null }, { expiresAt: { gte: today } }],
          },
        });
        items.push({
          kind: 'CERTIFICATION',
          label: `Verified ${req.certificationType.name}`,
          satisfied: !!cert,
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
        });
      } else if (req.kind === 'CLASS' && req.class) {
        const attendance = await this.prisma.classAttendance.findUnique({
          where: { classId_memberId: { classId: req.classId!, memberId } },
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

  /** Direct grant (corrections/migration) — permission credentials:grant. */
  async grant(
    auth: AuthContext,
    memberId: number,
    credentialTypeId: number,
    opts: { title?: string; grantedViaId?: number } = {},
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
    const missing = type.prerequisites
      .filter((p) => !held.has(p.requiresType.key))
      .map((p) => p.requiresType.name);
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
    await this.notifications.notifyMember(
      memberId,
      'Credential appointed',
      `You have been appointed ${opts.senior ? SDS_TITLE : type.name}.`,
    );
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
