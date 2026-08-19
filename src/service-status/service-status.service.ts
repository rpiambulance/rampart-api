import { Injectable } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WebhooksService } from '../webhooks/webhooks.service';

export const SERVICE_STATUS_KEY = 'agency.serviceStatus';

export interface ServiceStatus {
  inService: boolean;
  reason: string | null;
  changedAt: string | null;
  changedById: number | null;
}

const IN_SERVICE: ServiceStatus = {
  inService: true,
  reason: null,
  changedAt: null,
  changedById: null,
};

/**
 * Whether the agency is running at all.
 *
 * Distinct from a night being out of service, which is one date on the
 * schedule: this is the whole operation, and it is what the portal header
 * reports to everybody. Absent a stored value the agency is in service — a
 * fresh install should not claim to be shut down.
 */
@Injectable()
export class ServiceStatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly webhooks: WebhooksService,
  ) {}

  async current(): Promise<ServiceStatus & { changedBy: string | null }> {
    const row = await this.prisma.appSetting.findUnique({
      where: { key: SERVICE_STATUS_KEY },
    });
    const status = (row?.value as unknown as ServiceStatus) ?? IN_SERVICE;

    let changedBy: string | null = null;
    if (status.changedById) {
      const member = await this.prisma.member.findUnique({
        where: { id: status.changedById },
        select: { firstName: true, lastName: true },
      });
      changedBy = member ? `${member.firstName} ${member.lastName}` : null;
    }
    return { ...status, changedBy };
  }

  async set(auth: AuthContext, inService: boolean, reason?: string) {
    const value: ServiceStatus = {
      inService,
      reason: inService ? null : reason?.trim() || null,
      changedAt: new Date().toISOString(),
      changedById: auth.kind === 'member' ? auth.memberId : null,
    };
    // Through `unknown`: a plain `as object` is stripped by the lint rule
    // for unnecessary assertions, which leaves it failing to compile.
    const stored = value as unknown as Prisma.InputJsonObject;
    await this.prisma.appSetting.upsert({
      where: { key: SERVICE_STATUS_KEY },
      create: { key: SERVICE_STATUS_KEY, value: stored },
      update: { value: stored },
    });
    await this.audit.log(
      auth,
      'agency.service-status',
      'AppSetting',
      undefined,
      {
        inService,
        reason: value.reason,
      },
    );
    this.webhooks.emit('agency.service-status', {
      inService,
      reason: value.reason,
    });
    return value;
  }
}
