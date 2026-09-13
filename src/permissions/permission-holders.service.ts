import { Injectable } from '@nestjs/common';
import { nyToday } from '../common/dates';
import { CredentialGraphService } from '../credentials/credential-graph.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly graph: CredentialGraphService,
  ) {}

  /**
   * The credentials that confer a role carrying this permission, read the
   * way the guard reads them: the linked ones, and anything above them.
   */
  private async credentialKeysFor(permission: string): Promise<string[]> {
    const links = await this.prisma.credentialTypeRole.findMany({
      where: { role: { permissions: { some: { permission } } } },
      select: { credentialType: { select: { key: true } } },
    });
    if (!links.length) return [];
    const linked = links.map((link) => link.credentialType.key);
    // The linked credentials themselves, whatever the ladder cache knows.
    return [
      ...new Set([...linked, ...(await this.graph.keysSatisfying(linked))]),
    ];
  }

  async idsWith(permission: string): Promise<Set<number>> {
    const today = nyToday();
    const credentialKeys = await this.credentialKeysFor(permission);
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
          // Empty when no credential confers this permission, which matches
          // nothing — the query is cheap enough not to be worth skipping.
          type: { key: { in: credentialKeys } },
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
