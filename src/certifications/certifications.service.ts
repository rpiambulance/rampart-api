import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { addDays, nyNow, nyToday, toDbDate } from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { CertificationGraphService } from './certification-graph.service';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import type { FieldRequirement } from '../generated/prisma/enums';
import type { Prisma } from '../generated/prisma/client';

/**
 * What a verification task is about, so that one officer's decision closes
 * the copy sitting in every other officer's inbox.
 */
const CERT_TASK_SUBJECT = 'MemberCertification';

/**
 * One credential the nightly check would change, and why.
 *
 * Carries names as well as ids because this is read by a person deciding
 * whether the rule is right, not only by the code that applies it.
 */
export interface SuspensionChange {
  id: number;
  to: 'ACTIVE' | 'SUSPENDED';
  memberId: number;
  memberName: string;
  credential: string;
  /** Certifications not held, current and unwaived. Empty on a reinstatement. */
  missing: string[];
}

/**
 * Remembers which blocked sweep has already been reported.
 *
 * Without it the same warning goes out every morning for as long as the
 * misconfiguration lasts, which teaches everybody to filter the one message
 * that most needs reading.
 */
const MASS_SUSPENSION_KEY = 'credentials.massSuspensionReported';

/** The fields a certification type can ask for, and what each is called. */
const CERT_FIELDS = [
  {
    key: 'identifier',
    column: 'identifierField',
    label: 'a certificate number',
  },
  { key: 'issuedAt', column: 'issuedAtField', label: 'an issue date' },
  { key: 'expiresAt', column: 'expiresAtField', label: 'an expiry date' },
] as const;

@Injectable()
export class CertificationsService {
  private readonly logger = new Logger(CertificationsService.name);

  constructor(
    private readonly graph: CertificationGraphService,
    private readonly credentialGraph: CredentialGraphService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  listTypes() {
    return this.prisma.certificationType.findMany({
      where: { active: true },
      // The ranking travels with the type so callers can show and edit it.
      include: {
        supersedes: { select: { lowerTypeId: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  createType(data: {
    name: string;
    abbreviation: string;
    issuingOrg?: string;
    defaultValidityMonths?: number | null;
  }) {
    return this.prisma.certificationType.create({ data });
  }

  updateType(
    id: number,
    data: Partial<{
      name: string;
      abbreviation: string;
      issuingOrg: string;
      defaultValidityMonths: number | null;
      active: boolean;
      identifierField: FieldRequirement;
      issuedAtField: FieldRequirement;
      expiresAtField: FieldRequirement;
      documentField: FieldRequirement;
    }>,
  ) {
    return this.prisma.certificationType.update({ where: { id }, data });
  }

  listForMember(memberId: number) {
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

  async pendingCount() {
    const count = await this.prisma.memberCertification.count({
      where: { status: 'PENDING_VERIFICATION' },
    });
    return { count };
  }

  /** Expiring/expired report (replaces .expired_certs.php). */
  async expiring(withinDays = 30) {
    // expiresAt is a calendar date, so the horizon is one too — adding
    // milliseconds to an instant lands mid-day and drops the far edge.
    const horizon = toDbDate(addDays(nyNow().dateStr, withinDays));
    return this.prisma.memberCertification.findMany({
      where: {
        status: 'VERIFIED',
        expiresAt: { not: null, lte: horizon },
        member: { active: true },
      },
      include: {
        type: true,
        member: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  /**
   * Creates the type a member proposed, if the list did not have it.
   *
   * It is a real type from the moment it is made — the certification has to
   * point at something — but marked as proposed so nobody mistakes a guessed
   * abbreviation and validity period for the agency's considered answer. An
   * existing type with the same name is reused rather than duplicated.
   */
  private async typeForProposal(memberId: number, name: string) {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new BadRequestException('A certification needs a name');
    }
    const existing = await this.prisma.certificationType.findFirst({
      where: { name: { equals: trimmed, mode: 'insensitive' } },
    });
    if (existing) return existing;

    return this.prisma.certificationType.create({
      data: {
        name: trimmed,
        // Placeholders, deliberately obvious: whoever vets this is meant to
        // set them, and a blank tells them it has not been done.
        abbreviation: trimmed.slice(0, 8).toUpperCase(),
        defaultValidityMonths: null,
        proposed: true,
        proposedById: memberId,
        proposedAt: new Date(),
      },
    });
  }

  async submit(
    memberId: number,
    input: {
      typeId?: number;
      /** Used when the member could not find their certification on the list. */
      proposedTypeName?: string;
      identifier?: string;
      issuedAt?: string;
      expiresAt?: string;
    },
    /**
     * Set when an officer enters this on a member's behalf. It lands verified
     * rather than pending: the person entering it is the one who would have
     * approved it, and leaving it in the queue would ask them to verify their
     * own entry.
     */
    opts: { enteredBy?: AuthContext } = {},
  ) {
    const type = input.typeId
      ? await this.prisma.certificationType.findUnique({
          where: { id: input.typeId },
        })
      : await this.typeForProposal(memberId, input.proposedTypeName ?? '');
    if (!type) throw new NotFoundException('Unknown certification type');

    const expiresAtInput = input.expiresAt;
    let issuedAtValue = input.issuedAt;
    let expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
    if (!expiresAt && input.issuedAt && type.defaultValidityMonths) {
      const d = new Date(input.issuedAt);
      d.setMonth(d.getMonth() + type.defaultValidityMonths);
      expiresAt = d;
    }

    const enteredBy = opts.enteredBy;
    const byOfficer =
      enteredBy && enteredBy.kind === 'member' ? enteredBy.memberId : undefined;

    // What this type asks for. A required field left blank is refused here
    // rather than arriving as a record nobody can verify; a hidden one is
    // dropped rather than trusted, since the form that omitted it is not the
    // only way in.
    const missing: string[] = [];
    const kept: { identifier?: string; issuedAt?: string; expiresAt?: string } =
      {};
    for (const field of CERT_FIELDS) {
      const requirement = type[field.column];
      const value =
        field.key === 'expiresAt' ? expiresAtInput : input[field.key];
      if (requirement === 'HIDDEN') continue;
      if (requirement === 'REQUIRED' && !value) missing.push(field.label);
      if (value) kept[field.key] = value;
    }
    if (missing.length) {
      throw new BadRequestException(
        `${type.name} needs ${missing.join(' and ')}.`,
      );
    }
    if (type.expiresAtField === 'HIDDEN') expiresAt = null;
    if (type.issuedAtField === 'HIDDEN') issuedAtValue = undefined;

    const created = await this.prisma.memberCertification.create({
      data: {
        memberId,
        typeId: type.id,
        identifier: kept.identifier,
        issuedAt: issuedAtValue ? new Date(issuedAtValue) : null,
        expiresAt,
        ...(byOfficer
          ? {
              status: 'VERIFIED' as const,
              verifiedById: byOfficer,
              verifiedAt: new Date(),
            }
          : {}),
      },
      include: { type: true },
    });
    if (enteredBy) {
      await this.audit.log(
        enteredBy,
        'certs.record',
        'MemberCertification',
        created.id,
        { memberId, typeId: input.typeId },
      );
    }

    // Only a submission that is actually waiting on somebody. An officer
    // entering a certification has already verified it by doing so, and
    // asking the room to check their work would be noise.
    if (created.status === 'PENDING_VERIFICATION') {
      const member = await this.prisma.member.findUnique({
        where: { id: memberId },
        select: { firstName: true, lastName: true },
      });
      const who = member
        ? `${member.firstName} ${member.lastName}`
        : `Member ${memberId}`;
      await this.notifications.notifyPermissionHolders(
        PERMISSIONS.CERTS_VERIFY,
        {
          type: 'cert.submitted',
          subject: `${type.name} to verify for ${who}`,
          body:
            `${who} submitted ${type.name}` +
            `${created.identifier ? ` (${created.identifier})` : ''} for ` +
            'verification. Whoever gets to it first closes this for everyone.',
          task: {
            actionLabel: 'Review certifications',
            actionUrl: '/admin/certifications',
          },
          about: { type: CERT_TASK_SUBJECT, id: created.id },
        },
      );
    }
    return created;
  }

  async attachDocument(
    memberId: number,
    certificationId: number,
    file: { originalname: string; mimetype: string; buffer: Buffer },
    opts: { asOfficer?: boolean } = {},
  ) {
    const cert = await this.prisma.memberCertification.findUnique({
      where: { id: certificationId },
    });
    if (!cert) throw new NotFoundException('Certification not found');
    if (cert.memberId !== memberId && !opts.asOfficer) {
      throw new ForbiddenException('Not your certification');
    }
    const storageKey = this.storage.newKey(
      `certs/${cert.memberId}`,
      file.originalname,
    );
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

  /**
   * Removes a document from a certification.
   *
   * The member may remove their own while it is still pending — replacing a
   * blurred photo before anyone looks at it — and an officer who verifies
   * certifications may remove any, since they are the ones who have to work
   * out what a file actually shows. The stored object goes with the row: a
   * file nothing points at is just an orphan in the bucket.
   */
  async removeDocument(auth: AuthContext, documentId: string) {
    const doc = await this.prisma.certificationDocument.findUnique({
      where: { id: documentId },
      include: { certification: { select: { memberId: true, status: true } } },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const mine =
      auth.kind === 'member' && auth.memberId === doc.certification.memberId;
    const officer = auth.permissions.has(PERMISSIONS.CERTS_VERIFY);
    const pending = doc.certification.status === 'PENDING_VERIFICATION';
    if (!officer && !(mine && pending)) {
      throw new ForbiddenException(
        'Only an officer can remove a document once it has been checked',
      );
    }

    await this.prisma.certificationDocument.delete({
      where: { id: documentId },
    });
    await this.storage.delete(doc.storageKey).catch(() => {
      // The row is what matters; a stranded object is tidy-up, not an error.
    });
    await this.audit.log(
      auth,
      'certs.document.remove',
      'CertificationDocument',
      documentId,
      { certificationId: doc.certificationId, fileName: doc.fileName },
    );
    return { ok: true };
  }

  /**
   * A document, for someone entitled to see it: the member whose record it
   * belongs to, or anyone who reviews certifications.
   *
   * Members upload these themselves, so being unable to open one back is a
   * gap rather than a safeguard — and a verifier reaching a document has to
   * be reaching it as part of reviewing that member's record.
   */
  async getDocument(documentId: string, auth: AuthContext) {
    const doc = await this.prisma.certificationDocument.findUnique({
      where: { id: documentId },
      include: { certification: { select: { memberId: true } } },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const own =
      auth.kind === 'member' && auth.memberId === doc.certification.memberId;
    const mayReview =
      auth.permissions.has(PERMISSIONS.CERTS_VERIFY) ||
      auth.permissions.has(PERMISSIONS.CERTS_READ_ALL);
    if (!own && !mayReview) {
      throw new ForbiddenException('Not your document');
    }

    const object = await this.storage.get(doc.storageKey);
    return { doc, object };
  }

  /**
   * Amend a certification. A member may correct their own; anyone with
   * certs:verify may correct anyone's. Editing a verified record sends it
   * back for verification, since the details an officer checked have changed.
   */
  async amend(
    auth: AuthContext,
    certificationId: number,
    input: { identifier?: string; issuedAt?: string; expiresAt?: string },
  ) {
    const cert = await this.requireOwnOrVerifier(auth, certificationId);
    const isVerifier =
      auth.permissions.has(PERMISSIONS.CERTS_VERIFY) && auth.kind === 'member';

    const updated = await this.prisma.memberCertification.update({
      where: { id: certificationId },
      data: {
        identifier: input.identifier ?? null,
        issuedAt: input.issuedAt ? new Date(input.issuedAt) : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        // An officer editing is itself an act of verification; a member
        // editing invalidates the previous check.
        ...(isVerifier
          ? {
              status: 'VERIFIED' as const,
              verifiedById: auth.memberId,
              verifiedAt: new Date(),
              rejectionReason: null,
            }
          : cert.status === 'VERIFIED'
            ? {
                status: 'PENDING_VERIFICATION' as const,
                verifiedById: null,
                verifiedAt: null,
              }
            : {}),
      },
      include: { type: true },
    });
    await this.audit.log(
      auth,
      'certs.amend',
      'MemberCertification',
      certificationId,
      input,
    );
    if (isVerifier) {
      // Editing it as an officer is itself the check, so the queue's task is
      // finished — by them.
      await this.notifications.completeTasksAbout(
        { type: CERT_TASK_SUBJECT, id: certificationId },
        auth.memberId,
      );
    }
    return updated;
  }

  /** Withdraws a certification. Same ownership rule as amending. */
  async remove(auth: AuthContext, certificationId: number) {
    await this.requireOwnOrVerifier(auth, certificationId);
    // Before the row goes: a task pointing at a certification that no longer
    // exists is a job nobody can finish or dismiss.
    await this.notifications.completeTasksAbout(
      { type: CERT_TASK_SUBJECT, id: certificationId },
      auth.kind === 'member' ? auth.memberId : null,
    );
    await this.prisma.memberCertification.delete({
      where: { id: certificationId },
    });
    await this.audit.log(
      auth,
      'certs.delete',
      'MemberCertification',
      certificationId,
    );
    return { ok: true };
  }

  private async requireOwnOrVerifier(
    auth: AuthContext,
    certificationId: number,
  ) {
    const cert = await this.prisma.memberCertification.findUnique({
      where: { id: certificationId },
    });
    if (!cert) throw new NotFoundException('Certification not found');
    const isOwn = auth.kind === 'member' && cert.memberId === auth.memberId;
    if (!isOwn && !auth.permissions.has(PERMISSIONS.CERTS_VERIFY)) {
      throw new ForbiddenException(
        'That certification belongs to someone else',
      );
    }
    return cert;
  }

  /**
   * Replaces the set of certifications this one outranks. Rejects a link that
   * would make a type outrank itself, directly or through a chain — a cycle
   * would make "is this satisfied?" unanswerable.
   */
  async setSupersedes(
    auth: AuthContext,
    higherTypeId: number,
    lowerTypeIds: number[],
  ) {
    const wanted = [...new Set(lowerTypeIds)].filter(
      (id) => id !== higherTypeId,
    );

    const edges = await this.prisma.certificationSupersession.findMany();
    const outranks = new Map<number, number[]>();
    for (const edge of edges) {
      if (edge.higherTypeId === higherTypeId) continue; // being replaced
      outranks.set(edge.higherTypeId, [
        ...(outranks.get(edge.higherTypeId) ?? []),
        edge.lowerTypeId,
      ]);
    }
    outranks.set(higherTypeId, wanted);

    const seen = new Set<number>();
    const reaches = (from: number, target: number): boolean => {
      if (from === target) return true;
      if (seen.has(from)) return false;
      seen.add(from);
      return (outranks.get(from) ?? []).some((next) => reaches(next, target));
    };
    for (const lower of wanted) {
      seen.clear();
      if (reaches(lower, higherTypeId)) {
        throw new BadRequestException(
          'That would make a certification outrank itself',
        );
      }
    }

    await this.prisma.$transaction([
      this.prisma.certificationSupersession.deleteMany({
        where: { higherTypeId },
      }),
      this.prisma.certificationSupersession.createMany({
        data: wanted.map((lowerTypeId) => ({ higherTypeId, lowerTypeId })),
      }),
    ]);
    this.graph.invalidate();
    await this.audit.log(
      auth,
      'certs.hierarchy',
      'CertificationType',
      higherTypeId,
      { supersedes: wanted },
    );
    return { ok: true };
  }

  /**
   * Saves a ladder: an ordered chain from highest to lowest, where each rung
   * outranks the one below it. Only the neighbouring step is stored — the
   * graph resolves the rest — so a four-rung ladder is three links, not six.
   *
   * Saving replaces the entire chain the rungs belong to, not merely the links
   * they own. Dropping a rung from a ladder must take its links with it, or a
   * shortened ladder would keep ranking through a certification no longer on
   * it. Ladders that share no certification are untouched.
   */
  async saveLadder(
    auth: AuthContext,
    typeIds: number[],
    opts: { unlink?: boolean } = {},
  ) {
    const rungs = typeIds.filter((id, i) => typeIds.indexOf(id) === i);
    if (!rungs.length) {
      throw new BadRequestException(
        'A ladder needs at least one certification',
      );
    }

    // Everything transitively linked to any rung, in either direction.
    const edges = await this.prisma.certificationSupersession.findMany();
    const neighbours = new Map<number, Set<number>>();
    const link = (a: number, b: number) => {
      if (!neighbours.has(a)) neighbours.set(a, new Set());
      neighbours.get(a)!.add(b);
    };
    for (const edge of edges) {
      link(edge.higherTypeId, edge.lowerTypeId);
      link(edge.lowerTypeId, edge.higherTypeId);
    }
    const chain = new Set<number>(rungs);
    const queue = [...rungs];
    while (queue.length) {
      for (const next of neighbours.get(queue.pop()!) ?? []) {
        if (chain.has(next)) continue;
        chain.add(next);
        queue.push(next);
      }
    }

    const pairs = opts.unlink
      ? []
      : rungs.slice(0, -1).map((higherTypeId, i) => ({
          higherTypeId,
          lowerTypeId: rungs[i + 1],
        }));

    await this.prisma.$transaction([
      this.prisma.certificationSupersession.deleteMany({
        where: {
          OR: [
            { higherTypeId: { in: [...chain] } },
            { lowerTypeId: { in: [...chain] } },
          ],
        },
      }),
      this.prisma.certificationSupersession.createMany({ data: pairs }),
    ]);
    this.graph.invalidate();
    await this.audit.log(auth, 'certs.ladder', 'CertificationType', undefined, {
      rungs,
      replaced: [...chain],
      unlink: opts.unlink ?? false,
    });
    return { ok: true, rungs: rungs.length, links: pairs.length };
  }

  /**
   * Approves or rejects a submission.
   *
   * The approver may correct what was submitted in the same step. A pending
   * certification is somebody's best attempt at their own paperwork, and the
   * person checking it against the card in front of them is exactly the one
   * who should be able to fix a mistyped date rather than bouncing it back
   * and waiting for a second attempt.
   *
   * `typeConfig` vets a proposed type at the same time: an abbreviation and
   * validity guessed at submission become the agency's answer only when
   * somebody with settings permission says so.
   */
  async verify(
    auth: AuthContext,
    certificationId: number,
    decision: {
      approve: boolean;
      reason?: string;
      corrections?: {
        typeId?: number;
        identifier?: string | null;
        issuedAt?: string | null;
        expiresAt?: string | null;
      };
      typeConfig?: {
        name?: string;
        abbreviation?: string;
        issuingOrg?: string | null;
        defaultValidityMonths?: number | null;
      };
    },
  ) {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('Verification requires a member session');
    }
    const cert = await this.prisma.memberCertification.findUnique({
      where: { id: certificationId },
      include: { type: { select: { name: true } } },
    });
    if (!cert) throw new NotFoundException('Certification not found');

    const corrections = decision.corrections;
    if (corrections) {
      // Applied before the decision so the record that gets approved is the
      // corrected one, and an audit reader sees one coherent change.
      await this.prisma.memberCertification.update({
        where: { id: certificationId },
        data: {
          ...(corrections.typeId ? { typeId: corrections.typeId } : {}),
          ...(corrections.identifier === undefined
            ? {}
            : { identifier: corrections.identifier?.trim() || null }),
          ...(corrections.issuedAt === undefined
            ? {}
            : {
                issuedAt: corrections.issuedAt
                  ? new Date(corrections.issuedAt)
                  : null,
              }),
          ...(corrections.expiresAt === undefined
            ? {}
            : {
                expiresAt: corrections.expiresAt
                  ? new Date(corrections.expiresAt)
                  : null,
              }),
        },
      });
      await this.audit.log(
        auth,
        'certs.correct',
        'MemberCertification',
        certificationId,
        corrections,
      );
    }

    if (decision.typeConfig) {
      if (!auth.permissions.has(PERMISSIONS.SETTINGS_WRITE)) {
        throw new ForbiddenException(
          'Changing a certification type needs the settings permission',
        );
      }
      const typeId = corrections?.typeId ?? cert.typeId;
      const config = decision.typeConfig;
      await this.prisma.certificationType.update({
        where: { id: typeId },
        data: {
          ...(config.name?.trim() ? { name: config.name.trim() } : {}),
          ...(config.abbreviation?.trim()
            ? { abbreviation: config.abbreviation.trim().toUpperCase() }
            : {}),
          ...(config.issuingOrg === undefined
            ? {}
            : { issuingOrg: config.issuingOrg?.trim() || null }),
          ...(config.defaultValidityMonths === undefined
            ? {}
            : { defaultValidityMonths: config.defaultValidityMonths }),
          // Vetted: it is the agency's type now, not a guess.
          proposed: false,
        },
      });
      await this.audit.log(
        auth,
        'certs.type.vet',
        'CertificationType',
        typeId,
        config,
      );
    }

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
    await this.audit.log(
      auth,
      'certs.verify',
      'MemberCertification',
      certificationId,
      decision,
    );
    // Everyone who could have checked this was asked to; one of them has, so
    // the rest are told it is done and by whom rather than opening it to find
    // the work already gone.
    await this.notifications.completeTasksAbout(
      { type: CERT_TASK_SUBJECT, id: certificationId },
      auth.memberId,
    );
    // Named, so the member knows which of theirs this is about, and told why
    // when it was turned down — a rejection with no reason leaves them to
    // resubmit the same thing and hope.
    // The corrected type, if the approver changed it — the member should be
    // told the name of what was actually approved.
    const named = corrections?.typeId
      ? ((
          await this.prisma.certificationType.findUnique({
            where: { id: corrections.typeId },
            select: { name: true },
          })
        )?.name ?? cert.type.name)
      : cert.type.name;
    const reason = decision.reason?.trim();
    await this.notifications.notify(cert.memberId, {
      type: 'cert.decided',
      subject: `${named} ${decision.approve ? 'verified' : 'rejected'}`,
      body: decision.approve
        ? `Your ${named} has been verified.`
        : `Your ${named} was rejected.` +
          (reason
            ? ` Reason given: ${reason}`
            : ' No reason was given — ask a training officer what to change.'),
      ...(decision.approve
        ? {}
        : {
            task: {
              actionLabel: 'Correct and resubmit',
              actionUrl: '/training',
            },
          }),
    });
    if (decision.approve) {
      await this.recomputeSuspensions(cert.memberId);
    }
    return updated;
  }

  /**
   * Expiry consequences (spec §4.1): a credential whose CERTIFICATION
   * requirements aren't all satisfied by verified, unexpired certs flips to
   * SUSPENDED; it reactivates automatically once renewed and verified.
   */
  /**
   * Suspends credentials whose *ongoing* requirements are no longer met, and
   * reinstates them when they are again.
   *
   * Only ongoing requirements are consulted. A promotion requirement is a
   * condition of being granted the credential and is never revisited: adding
   * one today must not reach back and suspend somebody who earned theirs
   * years ago under different rules, which is precisely what happens if the
   * two kinds are kept in one undifferentiated list.
   */
  /**
   * What tonight's check would change, without changing anything.
   *
   * The same computation the sweep runs, so a review shows exactly what the
   * sweep would do rather than an approximation of it.
   */
  async previewSuspensions(): Promise<SuspensionChange[]> {
    return this.planSuspensions();
  }

  /**
   * The same plan, one entry per person.
   *
   * A single lapsed card can put four credentials at risk, and listing that
   * member four times reads as four problems. What they actually have to do
   * is renew one card, so that is what is listed once, with the credentials
   * riding on it underneath.
   */
  async previewSuspensionsByMember() {
    const changes = await this.planSuspensions();
    const byMember = new Map<
      number,
      {
        memberId: number;
        memberName: string;
        credentialIds: number[];
        credentials: string[];
        missing: string[];
      }
    >();
    for (const change of changes) {
      if (change.to !== 'SUSPENDED') continue;
      const held = byMember.get(change.memberId) ?? {
        memberId: change.memberId,
        memberName: change.memberName,
        credentialIds: [],
        credentials: [],
        missing: [],
      };
      held.credentialIds.push(change.id);
      held.credentials.push(change.credential);
      for (const name of change.missing) {
        if (!held.missing.includes(name)) held.missing.push(name);
      }
      byMember.set(change.memberId, held);
    }
    return [...byMember.values()].sort((a, b) =>
      a.memberName.localeCompare(b.memberName),
    );
  }

  /**
   * Tells the people on the list that their credentials are at risk, with a
   * link to put it right.
   *
   * The channels are chosen by whoever is sending rather than read from each
   * member's notification settings: this is somebody deciding to warn people
   * about something with a deadline, and it should not be quietly reduced to
   * an inbox entry nobody opens.
   */
  async warnPending(
    auth: AuthContext,
    opts: { memberIds?: number[]; email: boolean; slack: boolean },
  ) {
    if (!opts.email && !opts.slack) {
      throw new BadRequestException('Pick email, Slack, or both.');
    }
    const everybody = await this.previewSuspensionsByMember();
    const wanted = opts.memberIds?.length
      ? everybody.filter((row) => opts.memberIds!.includes(row.memberId))
      : everybody;
    if (!wanted.length) return { notified: 0 };

    for (const row of wanted) {
      const cards =
        row.missing.length === 1
          ? row.missing[0]
          : `${row.missing.slice(0, -1).join(', ')} and ${row.missing.at(-1)}`;
      await this.notifications.notify(
        row.memberId,
        {
          type: 'credential.suspension-warning',
          subject: `Your ${row.credentials.length > 1 ? 'credentials are' : 'credential is'} at risk`,
          body:
            `We do not have a current ${cards} on file for you. ` +
            `Until we do, ${row.credentials.join(', ')} ` +
            `${row.credentials.length > 1 ? 'are' : 'is'} at risk of being suspended. ` +
            'Upload a photo of the card and an officer will verify it.',
          task: {
            actionLabel: 'Upload your certification',
            actionUrl: '/training',
          },
          about: { type: 'CredentialSuspensionWarning', id: row.memberId },
        },
        { email: opts.email, slack: opts.slack },
      );
    }
    await this.audit.log(
      auth,
      'credentials.suspensions.warn',
      'Member',
      undefined,
      {
        members: wanted.map((row) => row.memberId),
        email: opts.email,
        slack: opts.slack,
      },
    );
    return { notified: wanted.length };
  }

  /**
   * Applies the plan in full, past the crowd guard, because somebody with
   * credentials:grant has looked at it and said so.
   *
   * Audited as one deliberate act: an automatic sweep and an officer
   * overruling a safety limit should not read the same afterwards.
   */
  async applySuspensions(auth: AuthContext) {
    const changes = await this.planSuspensions();
    await this.applyStatusChanges(changes);
    await this.clearMassSuspensionReport();
    await this.audit.log(
      auth,
      'credentials.suspensions.apply',
      'MemberCredential',
      undefined,
      {
        suspended: changes.filter((c) => c.to === 'SUSPENDED').length,
        reinstated: changes.filter((c) => c.to === 'ACTIVE').length,
        credentialIds: changes.map((c) => c.id),
      },
    );
    return {
      suspended: changes.filter((c) => c.to === 'SUSPENDED').length,
      reinstated: changes.filter((c) => c.to === 'ACTIVE').length,
    };
  }

  private async planSuspensions(
    memberId?: number,
  ): Promise<SuspensionChange[]> {
    // A certification is good through the whole of its expiry date, so this
    // compares against today's calendar day, not the current instant.
    const now = nyToday();
    const credentials = await this.prisma.memberCredential.findMany({
      where: {
        ...(memberId ? { memberId } : {}),
        status: { in: ['ACTIVE', 'SUSPENDED'] },
      },
      include: {
        type: {
          include: {
            requirements: {
              where: {
                kind: 'CERTIFICATION',
                scope: { in: ['ONGOING', 'BOTH'] },
                // Announced before it bites: a requirement dated ahead is a
                // warning, not yet a rule.
                OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: now } }],
              },
            },
          },
        },
        member: { select: { firstName: true, lastName: true } },
      },
    });

    // Ongoing requirements inherit downward as well: a Crew Chief whose
    // Attendant-level card has lapsed no longer meets what a Crew Chief must
    // keep meeting, even though the requirement is written a rung below.
    const inheritedByType = new Map<
      number,
      (typeof credentials)[number]['type']['requirements']
    >();
    for (const typeId of new Set(credentials.map((cred) => cred.typeId))) {
      const belowIds = await this.credentialGraph.idsBelow(typeId);
      inheritedByType.set(
        typeId,
        belowIds.length
          ? await this.prisma.credentialRequirement.findMany({
              where: {
                credentialTypeId: { in: belowIds },
                kind: 'CERTIFICATION',
                scope: { in: ['ONGOING', 'BOTH'] },
                OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: now } }],
              },
            })
          : [],
      );
    }

    const certNames = new Map(
      (
        await this.prisma.certificationType.findMany({
          select: { id: true, name: true },
        })
      ).map((type) => [type.id, type.name]),
    );

    const changes: SuspensionChange[] = [];
    for (const cred of credentials) {
      // Deduplicated on the certification, so a card demanded by two rungs is
      // checked once and waived once.
      const seen = new Set<number>();
      const certReqs = [
        ...cred.type.requirements,
        ...(inheritedByType.get(cred.typeId) ?? []),
      ].filter((req) => {
        if (req.certificationTypeId === null) return false;
        if (seen.has(req.certificationTypeId)) return false;
        seen.add(req.certificationTypeId);
        return true;
      });
      if (!certReqs.length) {
        // Nothing ongoing to fail. A credential suspended under an older rule
        // that has since been relaxed comes back rather than staying stuck.
        if (cred.status === 'SUSPENDED') {
          changes.push({
            id: cred.id,
            to: 'ACTIVE',
            memberId: cred.memberId,
            memberName: `${cred.member.firstName} ${cred.member.lastName}`,
            credential: cred.type.name,
            missing: [],
          });
        }
        continue;
      }

      // A waiver says this member was excused this requirement. It excused
      // them at promotion and it excuses them now — otherwise the waiver
      // quietly expires the moment it has served its purpose.
      const waived = new Set(
        (
          await this.prisma.promotionRequirementAdjustment.findMany({
            where: {
              memberId: cred.memberId,
              credentialTypeId: cred.typeId,
              kind: 'WAIVER',
            },
            select: { requirementId: true },
          })
        )
          .map((row) => row.requirementId)
          .filter((id): id is number => id !== null),
      );

      // Every unmet requirement, not merely the first: somebody reviewing a
      // proposed suspension needs to know what it would take to lift it, and
      // "renew this one card" is a different answer from "renew four".
      const missing: string[] = [];
      for (const req of certReqs) {
        if (waived.has(req.id)) continue;
        // A higher certification answers the requirement: a Paramedic meets a
        // requirement for EMT. Checked here as well as on the promotion
        // checklist — matching the exact type would suspend every medic on
        // the roster for not holding the card they outrank.
        const accepted = await this.graph.satisfying(req.certificationTypeId!);
        const ok = await this.prisma.memberCertification.findFirst({
          where: {
            memberId: cred.memberId,
            typeId: { in: accepted },
            status: 'VERIFIED',
            OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
          },
          select: { id: true },
        });
        if (!ok) {
          missing.push(
            certNames.get(req.certificationTypeId!) ??
              `certification ${req.certificationTypeId!}`,
          );
        }
      }
      const target = missing.length ? 'SUSPENDED' : 'ACTIVE';
      if (cred.status !== target) {
        changes.push({
          id: cred.id,
          to: target,
          memberId: cred.memberId,
          memberName: `${cred.member.firstName} ${cred.member.lastName}`,
          credential: cred.type.name,
          missing,
        });
      }
    }

    return changes;
  }

  /**
   * The nightly sweep: plan, then apply unless the plan looks like a rule
   * having gone wrong rather than a night's worth of lapses.
   */
  async recomputeSuspensions(memberId?: number) {
    const changes = await this.planSuspensions(memberId);

    // Suspending removes the permissions a credential confers, so a sweep
    // that would take out a crowd is almost certainly a misconfigured
    // requirement rather than a crowd who all lapsed overnight. It stops and
    // asks instead — for one member's recompute there is nothing to weigh up.
    const suspensions = changes.filter((change) => change.to === 'SUSPENDED');
    const limit = Number(process.env.MAX_AUTO_SUSPENSIONS ?? 10);
    if (!memberId && suspensions.length > limit) {
      this.logger.error(
        `Refusing to suspend ${suspensions.length} credentials in one run ` +
          `(limit ${limit}). Check for an ongoing requirement that was just added.`,
      );
      // Reinstatements are safe and still applied: nobody is harmed by
      // getting a credential back.
      const reinstated = changes.filter((change) => change.to === 'ACTIVE');
      await this.applyStatusChanges(reinstated);
      // Once per situation, not once per night. The same warning every
      // morning for a fortnight teaches everybody to filter the one message
      // that most needs reading; a different set of people means a genuinely
      // different situation and is worth saying again.
      if (await this.massSuspensionIsNews(suspensions)) {
        await this.notifications.notifyPermissionHolders(
          PERMISSIONS.CREDENTIALS_GRANT,
          {
            type: 'credential.mass-suspension',
            subject: `${suspensions.length} credentials would have been suspended`,
            body:
              `Tonight's check found ${suspensions.length} credentials failing an ongoing ` +
              'requirement, which is more than one night of lapses looks like. Nothing was ' +
              'changed, and this will not be repeated nightly unless the list changes. ' +
              'An ongoing requirement added recently is the usual cause — the review page ' +
              'lists who would be affected and what each of them is missing, and can ' +
              'apply the lot if the rule is right.',
            task: {
              actionLabel: 'Review who would be suspended',
              actionUrl: '/admin/credentials/suspensions',
            },
          },
        );
      }
      return { changed: reinstated.length, blocked: suspensions.length };
    }

    await this.applyStatusChanges(changes);
    if (!memberId) await this.clearMassSuspensionReport();
    return { changed: changes.length, blocked: 0 };
  }

  /**
   * True when this blocked sweep is not the one already reported.
   *
   * Keyed on which credentials are involved rather than on how many, so a
   * second person lapsing into the same misconfiguration is news and a
   * quiet fortnight is not.
   */
  private async massSuspensionIsNews(
    suspensions: SuspensionChange[],
  ): Promise<boolean> {
    const fingerprint = suspensions
      .map((change) => change.id)
      .sort((a, b) => a - b)
      .join(',');
    const stored = await this.prisma.appSetting.findUnique({
      where: { key: MASS_SUSPENSION_KEY },
    });
    const previous =
      (stored?.value as unknown as { fingerprint?: string } | undefined)
        ?.fingerprint ?? '';
    if (previous === fingerprint) return false;
    // The count travels with it so the navigation badge is a single indexed
    // read. Recomputing the sweep on every page load, for every officer, to
    // show one number would cost far more than the number is worth.
    // Through `unknown`: a plain `as object` is stripped by the lint rule for
    // unnecessary assertions, which leaves it failing to compile.
    const value = {
      fingerprint,
      count: suspensions.length,
      at: new Date().toISOString(),
    } as unknown as Prisma.InputJsonObject;
    await this.prisma.appSetting.upsert({
      where: { key: MASS_SUSPENSION_KEY },
      create: { key: MASS_SUSPENSION_KEY, value },
      update: { value },
    });
    return true;
  }

  /**
   * Whether a sweep is currently held back, and how many it would affect.
   *
   * Read from what the last blocked sweep recorded rather than by planning a
   * new one: this is called on every page render for anyone who could act on
   * it, and the plan is a query per credential.
   */
  async heldSuspensions(): Promise<{ held: boolean; count: number }> {
    const stored = await this.prisma.appSetting.findUnique({
      where: { key: MASS_SUSPENSION_KEY },
    });
    const value = stored?.value as unknown as { count?: number } | undefined;
    return { held: !!stored, count: value?.count ?? 0 };
  }

  /** Forgets the reported sweep, so the next problem is announced afresh. */
  private async clearMassSuspensionReport() {
    await this.prisma.appSetting
      .delete({ where: { key: MASS_SUSPENSION_KEY } })
      .catch(() => undefined);
  }

  private async applyStatusChanges(
    changes: Array<{ id: number; to: 'ACTIVE' | 'SUSPENDED' }>,
  ) {
    for (const change of changes) {
      await this.prisma.memberCredential.update({
        where: { id: change.id },
        data: { status: change.to },
      });
      await this.audit.log(
        'system',
        change.to === 'SUSPENDED'
          ? 'credentials.auto-suspend'
          : 'credentials.auto-reactivate',
        'MemberCredential',
        change.id,
      );
    }
  }
}
