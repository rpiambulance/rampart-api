import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthContext } from '../auth/auth-context';
import { currentRequest } from '../common/request-context';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    auth: AuthContext | 'system',
    action: string,
    entity: string,
    entityId?: string | number,
    diff?: unknown,
  ) {
    const actorType =
      auth === 'system'
        ? 'SYSTEM'
        : auth.kind === 'member'
          ? 'MEMBER'
          : 'API_TOKEN';
    const actorId =
      auth === 'system'
        ? null
        : auth.kind === 'member'
          ? auth.memberId
          : auth.apiTokenId;
    // Where it came from, when it came from a request at all. Scheduled jobs
    // and boot-time work leave these null rather than inventing an address.
    const request = currentRequest();
    await this.prisma.auditLog.create({
      data: {
        actorType,
        actorId,
        action,
        entity,
        entityId: entityId != null ? String(entityId) : null,
        diff: diff as object | undefined,
        ip: request?.ip ?? null,
        userAgent: request?.userAgent?.slice(0, 512) ?? null,
      },
    });
  }
}
