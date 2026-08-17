import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { createHash } from 'crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { nyToday } from '../common/dates';
import { PrismaService } from '../prisma/prisma.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthContext } from './auth-context';

const API_TOKEN_PREFIX = 'rpa_';

/** Relations the guard needs to compute effective permissions. */
const MEMBER_AUTH_INCLUDE = {
  roles: { include: { role: { include: { permissions: true } } } },
  credentials: {
    where: { status: 'ACTIVE' as const },
    include: {
      type: {
        include: { linkedRoles: { include: { role: { include: { permissions: true } } } } },
      },
    },
  },
};

/**
 * Global guard: authenticates every request either via a Keycloak-issued JWT
 * (browser/web-app traffic) or an admin-created API token (machine clients).
 * Attaches an AuthContext to the request; PermissionsGuard authorizes it.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private jwks?: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const header: string | undefined = request.headers['authorization'];
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = header.slice('Bearer '.length);

    request.auth = token.startsWith(API_TOKEN_PREFIX)
      ? await this.authenticateApiToken(token)
      : await this.authenticateKeycloakJwt(token);
    return true;
  }

  private async authenticateKeycloakJwt(token: string): Promise<AuthContext> {
    const issuer = this.config.getOrThrow<string>('KEYCLOAK_ISSUER');
    const audience = this.config.get<string>('KEYCLOAK_AUDIENCE');
    this.jwks ??= createRemoteJWKSet(
      new URL(`${issuer}/protocol/openid-connect/certs`),
    );

    let subject: string;
    let email: string | undefined;
    let emailVerified = false;
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer,
        ...(audience ? { audience } : {}),
      });
      subject = payload.sub!;
      email =
        typeof payload.email === 'string'
          ? payload.email.trim().toLowerCase()
          : undefined;
      emailVerified = payload.email_verified === true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    let member = await this.prisma.member.findUnique({
      where: { keycloakSubject: subject },
      include: {
        roles: {
          include: { role: { include: { permissions: true } } },
        },
        credentials: {
          where: { status: 'ACTIVE' },
          include: {
            type: {
              include: {
                linkedRoles: {
                  include: { role: { include: { permissions: true } } },
                },
              },
            },
          },
        },
      },
    });
    // First-login linking. Members created by an officer or migrated from the
    // legacy portal have no keycloakSubject yet; claim it once, keyed on a
    // Keycloak-verified email. Never re-points a member already linked to a
    // different Keycloak account.
    if (!member && email && emailVerified) {
      const byEmail = await this.prisma.member.findUnique({ where: { email } });
      if (byEmail && byEmail.keycloakSubject === null) {
        member = await this.prisma.member.update({
          where: { id: byEmail.id },
          data: { keycloakSubject: subject },
          include: MEMBER_AUTH_INCLUDE,
        });
        this.logger.log(
          `Linked member ${byEmail.id} (${email}) to Keycloak subject ${subject}`,
        );
      }
    }

    if (!member) {
      throw new ForbiddenException({
        code: 'NO_MEMBER_RECORD',
        message:
          'Your login is valid but no member record is linked to it. Contact an officer.',
      });
    }
    if (!member.active) {
      throw new ForbiddenException({
        code: 'INACTIVE_MEMBER',
        message:
          'Your membership is inactive. Contact an officer to become active again.',
      });
    }

    // Assignment dates are calendar days, so a role runs from the first
    // moment of its start date through the last of its end date, in the
    // agency's timezone. Measured against the current instant instead, an
    // assignment would go live at 20:00 the evening before it starts and its
    // holder would lose the permission on the morning of its final day.
    const today = nyToday();
    const permissions = new Set<string>();
    for (const assignment of member.roles) {
      const started = assignment.startDate <= today;
      const notEnded = !assignment.endDate || assignment.endDate >= today;
      if (started && notEnded) {
        for (const p of assignment.role.permissions) {
          permissions.add(p.permission);
        }
      }
    }
    // Roles linked to ACTIVE credentials confer their permissions too
    // (additive; automatic suspension removes them).
    for (const credential of member.credentials) {
      for (const link of credential.type.linkedRoles) {
        for (const p of link.role.permissions) {
          permissions.add(p.permission);
        }
      }
    }

    return {
      kind: 'member',
      memberId: member.id,
      permissions,
    };
  }

  private async authenticateApiToken(token: string): Promise<AuthContext> {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const apiToken = await this.prisma.apiToken.findUnique({
      where: { tokenHash },
    });
    const now = new Date();
    if (
      !apiToken ||
      apiToken.revokedAt ||
      (apiToken.expiresAt && apiToken.expiresAt < now)
    ) {
      throw new UnauthorizedException('Invalid API token');
    }
    await this.prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: now },
    });

    return {
      kind: 'api-token',
      apiTokenId: apiToken.id,
      permissions: new Set(apiToken.permissions),
    };
  }
}
