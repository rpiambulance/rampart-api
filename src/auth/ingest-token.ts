import { UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import type { Request } from 'express';
import type { PrismaService } from '../prisma/prisma.service';
import type { Permission } from '../permissions/catalog';

/**
 * The check a machine feed passes instead of signing in.
 *
 * Herald and the pager both post from somewhere with no session and no
 * browser: an API token is the whole of their identity. Taken from the query
 * string, because that is what a feed configured as one URL can carry, or
 * from an Authorization header for a sender that can set one.
 *
 * Shared rather than copied so the two feeds cannot drift into accepting
 * different things.
 */
export async function requireIngestToken(
  prisma: PrismaService,
  permission: Permission,
  input: { query?: string; request?: Request },
): Promise<void> {
  const header = input.request?.headers?.authorization;
  const bearer = header?.startsWith('Bearer ')
    ? header.slice('Bearer '.length).trim()
    : undefined;
  const raw = input.query?.trim() || bearer;

  if (!raw?.startsWith('rpa_')) {
    throw new UnauthorizedException(`A ${permission} API token is required`);
  }
  const tokenHash = createHash('sha256').update(raw).digest('hex');
  const token = await prisma.apiToken.findUnique({ where: { tokenHash } });
  const now = new Date();
  if (
    !token ||
    token.revokedAt ||
    (token.expiresAt && token.expiresAt < now) ||
    !token.permissions.includes(permission)
  ) {
    throw new UnauthorizedException('Invalid ingest token');
  }
  await prisma.apiToken.update({
    where: { id: token.id },
    data: { lastUsedAt: now },
  });
}
