import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthContext } from '../auth/auth-context';

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
    await this.prisma.auditLog.create({
      data: {
        actorType,
        actorId,
        action,
        entity,
        entityId: entityId != null ? String(entityId) : null,
        diff: diff as object | undefined,
      },
    });
  }
}
