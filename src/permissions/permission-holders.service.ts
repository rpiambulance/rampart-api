import { Injectable } from '@nestjs/common';
import { nyToday } from '../common/dates';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Who holds a permission, from either source the auth guard unions: a role
 * assigned directly, or a role conferred by an active credential.
 *
 * Lifted out of the services that each had their own copy — the answer has to
 * be the same everywhere, and "who can be asked to do this" is now a question
 * several features need.
 */
@Injectable()
export class PermissionHoldersService {
  constructor(private readonly prisma: PrismaService) {}

  async idsWith(permission: string): Promise<Set<number>> {
    const today = nyToday();
    const [byRole, byCredential] = await Promise.all([
      this.prisma.memberRole.findMany({
        where: {
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
          member: { active: true },
          role: { permissions: { some: { permission } } },
        },
        select: { memberId: true },
      }),
      this.prisma.memberCredential.findMany({
        where: {
          status: 'ACTIVE',
          member: { active: true },
          type: {
            linkedRoles: {
              some: { role: { permissions: { some: { permission } } } },
            },
          },
        },
        select: { memberId: true },
      }),
    ]);
    return new Set([
      ...byRole.map((row) => row.memberId),
      ...byCredential.map((row) => row.memberId),
    ]);
  }

  /** The same, as members to choose from. */
  async membersWith(permission: string) {
    const ids = await this.idsWith(permission);
    if (!ids.size) return [];
    return this.prisma.member.findMany({
      where: { id: { in: [...ids] }, active: true },
      select: {
        id: true,
        firstName: true,
        preferredFirstName: true,
        lastName: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }
}
