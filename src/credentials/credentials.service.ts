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
import { WebhooksService } from '../webhooks/webhooks.service';
import { CredentialGraphService } from './credential-graph.service';
import { displayName } from '../common/name';

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
  /** Set on a collapsed group of alternatives; see `alternatives`. */
  alternativeGroup?: string;
  /** The options within a group, each with whether it is met on its own. */
  alternatives?: Array<{
    label: string;
    satisfied: boolean;
    requirementId?: number;
  }>;
}

/**
 * Folds requirements that share an alternative group into one item.
 *
 * The group is satisfied when any one of its options is, which is the whole
 * point of grouping them — "EVOC or a clean three-year abstract" is one
 * requirement with two ways to meet it, not two requirements. The options are
 * kept on the item so a checklist can show which routes are open rather than
 * only the verdict.
 */
function collapseAlternatives(items: ChecklistItem[]): ChecklistItem[] {
  const out: ChecklistItem[] = [];
  const groups = new Map<string, number>();

  for (const item of items) {
    const group = item.alternativeGroup;
    if (!group) {
      out.push(item);
      continue;
    }
    const at = groups.get(group);
    const option = {
      label: item.label,
      satisfied: item.satisfied,
      requirementId: item.requirementId,
    };
    if (at === undefined) {
      groups.set(group, out.length);
      out.push({
        kind: item.kind,
        label: group,
        satisfied: item.satisfied,
        alternativeGroup: group,
        alternatives: [option],
      });
      continue;
    }
    const existing = out[at];
    existing.alternatives!.push(option);
    existing.satisfied ||= item.satisfied;
  }

  for (const index of groups.values()) {
    const item = out[index];
    const met = item.alternatives!.filter((a) => a.satisfied).length;
    item.detail = item.satisfied
      ? `${met} of ${item.alternatives!.length} met`
      : `any one of ${item.alternatives!.length}`;
  }
  return out;
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
    private readonly webhooks: WebhooksService,
  ) {}

  listTypes() {
    return this.prisma.credentialType.findMany({
      where: { active: true },
      include: {
        prerequisites: { include: { requiresType: { select: { key: true } } } },
        linkedRoles: {
          include: { role: { select: { id: true, name: true } } },
        },
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
        data: [...new Set(roleIds)].map((roleId) => ({
          credentialTypeId,
          roleId,
        })),
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
      alternativeGroup?: string;
      scope?: 'PROMOTION' | 'ONGOING' | 'BOTH';
      effectiveFrom?: string;
      certificationTypeId?: number;
      evalTemplateId?: number;
      count?: number;
      classId?: number;
    },
  ) {
    if (data.kind === 'CERTIFICATION' && !data.certificationTypeId) {
      throw new BadRequestException('certificationTypeId required');
    }
    if (
      data.kind === 'EVALUATION_COUNT' &&
      (!data.evalTemplateId || !data.count)
    ) {
      throw new BadRequestException('evalTemplateId and count required');
    }
    if (data.kind === 'CHECKLIST' && !data.evalTemplateId) {
      throw new BadRequestException('evalTemplateId required');
    }
    if (data.kind === 'CLASS' && !data.classId) {
      throw new BadRequestException('classId required');
    }
    // Only a certification lapses on its own. An "ongoing" evaluation or class
    // requirement would never be re-checked, so it would quietly mean nothing.
    if (
      data.scope &&
      data.scope !== 'PROMOTION' &&
      data.kind !== 'CERTIFICATION'
    ) {
      throw new BadRequestException(
        'Only certification requirements can be checked on an ongoing basis',
      );
    }
    return this.prisma.credentialRequirement.create({
      data: {
        credentialTypeId,
        ...data,
        alternativeGroup: data.alternativeGroup?.trim() || null,
        scope: data.scope ?? 'PROMOTION',
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : null,
      },
    });
  }

  async removeRequirement(requirementId: number) {
    await this.prisma.credentialRequirement.delete({
      where: { id: requirementId },
    });
    return { ok: true };
  }

  /**
   * Who an ongoing requirement would suspend if it were switched on right now.
   *
   * Turning a requirement ongoing is the one edit here that can reach back and
   * take a credential off somebody — usually somebody migrated in, or promoted
   * before the rule existed, who never had to meet it. So it is previewable
   * before it is real.
   */
  async requirementImpact(requirementId: number) {
    const req = await this.prisma.credentialRequirement.findUnique({
      where: { id: requirementId },
      include: { certificationType: { select: { name: true } } },
    });
    if (!req) throw new NotFoundException('No such requirement');
    if (req.kind !== 'CERTIFICATION') {
      // Only certifications expire on their own, so only they can put a
      // credential out from under somebody without anyone doing anything.
      return {
        requirementId,
        kind: req.kind,
        enforceable: false,
        certificationType: null,
        members: [] as Array<{ id: number; name: string; reason: string }>,
      };
    }

    const now = nyToday();
    const holders = await this.prisma.memberCredential.findMany({
      where: {
        typeId: req.credentialTypeId,
        status: { in: ['ACTIVE', 'SUSPENDED'] },
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
    });
    const waived = new Set(
      (
        await this.prisma.promotionRequirementAdjustment.findMany({
          where: {
            credentialTypeId: req.credentialTypeId,
            kind: 'WAIVER',
            requirementId,
          },
          select: { memberId: true },
        })
      ).map((row) => row.memberId),
    );

    const accepted = await this.certGraph.satisfying(req.certificationTypeId!);
    const members: Array<{ id: number; name: string; reason: string }> = [];
    for (const holder of holders) {
      if (waived.has(holder.memberId)) continue;
      // Anything that outranks it counts, exactly as the nightly check and
      // the promotion checklist count it — otherwise this previews a
      // different rule from the one that would actually be applied, and
      // grandfathers the wrong people.
      const held = await this.prisma.memberCertification.findFirst({
        where: {
          memberId: holder.memberId,
          typeId: { in: accepted },
          status: 'VERIFIED',
          OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
        },
        select: { id: true },
      });
      if (held) continue;
      const lapsed = await this.prisma.memberCertification.findFirst({
        where: { memberId: holder.memberId, typeId: { in: accepted } },
        orderBy: { expiresAt: 'desc' },
        select: { status: true, expiresAt: true },
      });
      members.push({
        id: holder.memberId,
        name: displayName(holder.member),
        reason: !lapsed
          ? 'never held it'
          : lapsed.status !== 'VERIFIED'
            ? `on file but ${lapsed.status.toLowerCase()}`
            : `expired ${lapsed.expiresAt?.toISOString().slice(0, 10) ?? 'unknown'}`,
      });
    }
    return {
      requirementId,
      kind: req.kind,
      enforceable: true,
      certificationType: req.certificationType?.name ?? null,
      members,
    };
  }

  /**
   * Excuse everybody the requirement would currently catch.
   *
   * The point is to be able to say "from here on" without punishing the people
   * who got here under the old rules. Each waiver is an ordinary per-member
   * adjustment, so it shows up in their promotion record and can be lifted one
   * at a time.
   */
  async grandfatherRequirement(auth: AuthContext, requirementId: number) {
    const impact = await this.requirementImpact(requirementId);
    if (!impact.enforceable) {
      throw new BadRequestException(
        'Only certification requirements can suspend, so there is nobody to excuse',
      );
    }
    const req = await this.prisma.credentialRequirement.findUniqueOrThrow({
      where: { id: requirementId },
      select: { credentialTypeId: true },
    });
    const by = auth.kind === 'member' ? auth.memberId : null;
    if (!by)
      throw new BadRequestException('This action requires a member session');

    for (const member of impact.members) {
      await this.prisma.promotionRequirementAdjustment.create({
        data: {
          memberId: member.id,
          credentialTypeId: req.credentialTypeId,
          kind: 'WAIVER',
          requirementId,
          note: `Grandfathered when this requirement was made ongoing (${member.reason})`,
          createdById: by,
        },
      });
    }
    await this.audit.log(
      auth,
      'credentials.requirement.grandfather',
      'CredentialRequirement',
      requirementId,
      { waived: impact.members.map((m) => m.id) },
    );
    return { waived: impact.members.length };
  }

  /**
   * Change when a requirement applies, without losing the requirement itself
   * — the alternative being delete-and-re-add, which drops any waivers hung
   * off it.
   */
  async updateRequirement(
    auth: AuthContext,
    requirementId: number,
    data: {
      scope?: 'PROMOTION' | 'ONGOING' | 'BOTH';
      effectiveFrom?: string | null;
    },
  ) {
    const req = await this.prisma.credentialRequirement.findUnique({
      where: { id: requirementId },
      select: { kind: true },
    });
    if (!req) throw new NotFoundException('No such requirement');
    if (
      data.scope &&
      data.scope !== 'PROMOTION' &&
      req.kind !== 'CERTIFICATION'
    ) {
      throw new BadRequestException(
        'Only certification requirements can be checked on an ongoing basis',
      );
    }
    const updated = await this.prisma.credentialRequirement.update({
      where: { id: requirementId },
      data: {
        ...(data.scope ? { scope: data.scope } : {}),
        ...(data.effectiveFrom === undefined
          ? {}
          : {
              effectiveFrom: data.effectiveFrom
                ? new Date(data.effectiveFrom)
                : null,
            }),
      },
    });
    await this.audit.log(
      auth,
      'credentials.requirement.update',
      'CredentialRequirement',
      requirementId,
      data,
    );
    return updated;
  }

  /** Requirement checklist for member × credential type (for My Training + promotion review). */
  /**
   * Certification requirements written against the rungs below this one.
   *
   * Anything already required by this credential directly is left out, so a
   * requirement repeated on two rungs is still one line on the checklist.
   */
  private async inheritedCertRequirements(
    credentialTypeId: number,
    scopes: Array<'PROMOTION' | 'ONGOING' | 'BOTH'>,
    alreadyRequired: Array<number | null> = [],
  ) {
    const belowIds = await this.graph.idsBelow(credentialTypeId);
    if (!belowIds.length) return [];
    const rows = await this.prisma.credentialRequirement.findMany({
      where: {
        credentialTypeId: { in: belowIds },
        kind: 'CERTIFICATION',
        scope: { in: scopes },
      },
      include: { certificationType: true, evalTemplate: true, class: true },
    });
    // One line per certification, however many rungs below ask for it — and
    // none at all for one this credential already asks for itself.
    const seen = new Set<number>(
      alreadyRequired.filter((id): id is number => id !== null),
    );
    return rows.filter((row) => {
      const key = row.certificationTypeId;
      if (key === null || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async checklist(
    memberId: number,
    credentialTypeId: number,
  ): Promise<ChecklistItem[]> {
    const type = await this.prisma.credentialType.findUnique({
      where: { id: credentialTypeId },
      include: {
        prerequisites: { include: { requiresType: true } },
        // What earns the credential. An ongoing-only requirement is a
        // condition of keeping it, not of getting it, so listing it here
        // would ask somebody to prove something that is not yet theirs to
        // maintain.
        requirements: {
          where: { scope: { in: ['PROMOTION', 'BOTH'] } },
          include: {
            certificationType: true,
            evalTemplate: true,
            class: true,
          },
        },
      },
    });
    if (!type) throw new NotFoundException('Credential type not found');

    // Certifications demanded by the rungs below are demanded here too: a
    // Crew Chief still needs the card an Attendant needed, and writing it out
    // again on every rung means the day somebody adds one to Attendant is the
    // day every credential above it quietly stops requiring it.
    //
    // Only certifications inherit. An evaluation or a class is a thing you
    // did to earn a particular rung, not a state you have to stay in, and
    // inheriting those would ask people to sit the same class twice.
    const inherited = await this.inheritedCertRequirements(
      credentialTypeId,
      ['PROMOTION', 'BOTH'],
      type.requirements.map((req) => req.certificationTypeId),
    );
    type.requirements = [...type.requirements, ...inherited];

    const held = await this.graph.heldKeys(memberId);
    const adjustments =
      await this.prisma.promotionRequirementAdjustment.findMany({
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
      // Anything this requirement adds is tagged afterwards, so each branch
      // stays about the requirement rather than about grouping.
      const before = items.length;
      const tag = () => {
        if (!req.alternativeGroup) return;
        for (let i = before; i < items.length; i++) {
          items[i].alternativeGroup = req.alternativeGroup;
        }
      };
      const waiver = waivers.get(req.id);
      if (waiver) {
        items.push({
          kind: req.kind,
          label: `${requirementLabelFor(req)} — waived`,
          satisfied: true,
          waived: true,
          detail: waiver.note ?? undefined,
          adjustmentId: waiver.id,
          requirementId: req.id,
        });
        tag();
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
        const done = await this.checklists.isComplete(
          req.evalTemplateId!,
          memberId,
        );
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
      tag();
    }

    // Member-specific additional requirements
    for (const adjustment of adjustments.filter(
      (a) => a.kind === 'ADDITIONAL',
    )) {
      if (
        adjustment.reqKind === 'CERTIFICATION' &&
        adjustment.certificationType
      ) {
        // Ladder-aware like every other certification check.
        const cert = await this.prisma.memberCertification.findFirst({
          where: {
            memberId,
            typeId: {
              in: await this.certGraph.satisfying(
                adjustment.certificationTypeId!,
              ),
            },
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
      } else if (
        adjustment.reqKind === 'EVALUATION_COUNT' &&
        adjustment.evalTemplate
      ) {
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
    return collapseAlternatives(items);
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
    await this.audit.log(
      auth,
      'credentials.grant',
      'MemberCredential',
      credential.id,
      {
        memberId,
        credentialTypeId,
        ...opts,
      },
    );
    const granted = await this.prisma.credentialType.findUnique({
      where: { id: credentialTypeId },
      select: { key: true, name: true },
    });
    this.webhooks.emit('credential.granted', {
      memberId,
      credentialTypeId,
      credentialKey: granted?.key ?? null,
      credentialName: granted?.name ?? null,
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
        preferredFirstName: true,
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
  async trainerGrant(
    auth: AuthContext,
    memberId: number,
    credentialKey: string,
  ) {
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
      select: {
        id: true,
        firstName: true,
        preferredFirstName: true,
        lastName: true,
        nineHundredNumber: true,
      },
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
          subject: `900 number needed: ${displayName(member)}`,
          body:
            `${displayName(member)} was cleared as ` +
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
    await this.audit.log(
      auth,
      'credentials.appoint',
      'MemberCredential',
      credential.id,
      {
        memberId,
        credentialKey,
        senior: !!opts.senior,
      },
    );
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
    await this.audit.log(
      auth,
      'credentials.revoke',
      'MemberCredential',
      credential.id,
    );
    return { ok: true };
  }
}
