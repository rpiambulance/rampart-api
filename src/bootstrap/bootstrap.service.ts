import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuditService } from '../audit/audit.service';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Solves the first-admin chicken-and-egg: the admin console requires a
 * console permission, which comes from a role assignment, which is normally
 * granted *in* the console.
 *
 * Set BOOTSTRAP_ADMIN_EMAIL (optionally BOOTSTRAP_ADMIN_NAME and
 * BOOTSTRAP_ADMIN_ROLE, default "Admin") and restart. On boot the API grants
 * that role to the member with that email, creating the member if needed.
 *
 * It is a **no-op once any member already holds roles:manage**, so leaving
 * the variable set is harmless and it can never silently re-grant access
 * after you've removed someone. The member is linked to Keycloak on their
 * first login, by verified email (see AuthGuard).
 */
@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config
      .get<string>('BOOTSTRAP_ADMIN_EMAIL')
      ?.trim()
      .toLowerCase();
    if (!email) return;

    const now = new Date();
    const existingAdmin = await this.prisma.memberRole.findFirst({
      where: {
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
        member: { active: true },
        role: {
          permissions: { some: { permission: PERMISSIONS.ROLES_MANAGE } },
        },
      },
    });
    if (existingAdmin) {
      this.logger.log(
        'BOOTSTRAP_ADMIN_EMAIL is set but an administrator already exists — skipping.',
      );
      return;
    }

    const roleName = this.config.get<string>('BOOTSTRAP_ADMIN_ROLE') ?? 'Admin';
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      this.logger.error(
        `Cannot bootstrap: role "${roleName}" does not exist. Run the seed first.`,
      );
      return;
    }

    const configuredName = this.config.get<string>('BOOTSTRAP_ADMIN_NAME')?.trim();
    const [firstName, ...rest] = (configuredName || email.split('@')[0]).split(' ');
    const lastName = rest.join(' ') || 'Administrator';

    const member = await this.prisma.member.upsert({
      where: { email },
      create: { email, firstName, lastName, active: true },
      update: { active: true },
    });
    await this.prisma.memberRole.create({
      data: { memberId: member.id, roleId: role.id, startDate: now },
    });
    await this.audit.log('system', 'bootstrap.admin.grant', 'MemberRole', member.id, {
      email,
      role: roleName,
    });

    this.logger.warn(
      `Bootstrapped "${roleName}" for ${email} (member ${member.id}). ` +
        'Sign in with the matching Keycloak account to link it, then remove ' +
        'BOOTSTRAP_ADMIN_EMAIL from the environment.',
    );
  }
}
