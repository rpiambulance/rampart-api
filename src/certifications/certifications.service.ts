import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class CertificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  listTypes() {
    return this.prisma.certificationType.findMany({ where: { active: true } });
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

  /** Expiring/expired report (replaces .expired_certs.php). */
  async expiring(withinDays = 30) {
    const now = new Date();
    const horizon = new Date(now.getTime() + withinDays * 86_400_000);
    return this.prisma.memberCertification.findMany({
      where: {
        status: 'VERIFIED',
        expiresAt: { not: null, lte: horizon },
        member: { active: true },
      },
      include: {
        type: true,
        member: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  async submit(
    memberId: number,
    input: {
      typeId: number;
      identifier?: string;
      issuedAt?: string;
      expiresAt?: string;
    },
  ) {
    const type = await this.prisma.certificationType.findUnique({
      where: { id: input.typeId },
    });
    if (!type) throw new NotFoundException('Unknown certification type');

    let expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
    if (!expiresAt && input.issuedAt && type.defaultValidityMonths) {
      const d = new Date(input.issuedAt);
      d.setMonth(d.getMonth() + type.defaultValidityMonths);
      expiresAt = d;
    }

    return this.prisma.memberCertification.create({
      data: {
        memberId,
        typeId: input.typeId,
        identifier: input.identifier,
        issuedAt: input.issuedAt ? new Date(input.issuedAt) : null,
        expiresAt,
      },
      include: { type: true },
    });
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

  async getDocument(documentId: number) {
    const doc = await this.prisma.certificationDocument.findUnique({
      where: { id: documentId },
    });
    if (!doc) throw new NotFoundException('Document not found');
    const object = await this.storage.get(doc.storageKey);
    return { doc, object };
  }

  async verify(
    auth: AuthContext,
    certificationId: number,
    decision: { approve: boolean; reason?: string },
  ) {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('Verification requires a member session');
    }
    const cert = await this.prisma.memberCertification.findUnique({
      where: { id: certificationId },
    });
    if (!cert) throw new NotFoundException('Certification not found');

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
    await this.audit.log(auth, 'certs.verify', 'MemberCertification', certificationId, decision);
    await this.notifications.notifyMember(
      cert.memberId,
      `Certification ${decision.approve ? 'verified' : 'rejected'}`,
      decision.approve
        ? 'Your certification was verified.'
        : `Your certification was rejected${decision.reason ? `: ${decision.reason}` : ''}.`,
    );
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
  async recomputeSuspensions(memberId?: number) {
    const now = new Date();
    const credentials = await this.prisma.memberCredential.findMany({
      where: {
        ...(memberId ? { memberId } : {}),
        status: { in: ['ACTIVE', 'SUSPENDED'] },
      },
      include: {
        type: {
          include: {
            requirements: { where: { kind: 'CERTIFICATION' } },
          },
        },
      },
    });

    const changes: Array<{ id: number; to: 'ACTIVE' | 'SUSPENDED' }> = [];
    for (const cred of credentials) {
      const certReqs = cred.type.requirements;
      if (!certReqs.length) continue;
      let allSatisfied = true;
      for (const req of certReqs) {
        const ok = await this.prisma.memberCertification.findFirst({
          where: {
            memberId: cred.memberId,
            typeId: req.certificationTypeId!,
            status: 'VERIFIED',
            OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
          },
          select: { id: true },
        });
        if (!ok) {
          allSatisfied = false;
          break;
        }
      }
      const target = allSatisfied ? 'ACTIVE' : 'SUSPENDED';
      if (cred.status !== target) changes.push({ id: cred.id, to: target });
    }

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
    return { changed: changes.length };
  }
}
