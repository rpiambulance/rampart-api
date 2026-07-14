import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { ALL_PERMISSIONS, PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';

class CreateTokenDto {
  @IsString()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

/** Admin-created machine tokens with explicit permission subsets (spec §2.2). */
@Controller({ path: 'tokens', version: '1' })
export class TokensController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  @RequirePermissions(PERMISSIONS.TOKENS_MANAGE)
  list() {
    return this.prisma.apiToken.findMany({
      select: {
        id: true,
        name: true,
        permissions: true,
        expiresAt: true,
        revokedAt: true,
        lastUsedAt: true,
        createdAt: true,
        owner: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  @RequirePermissions(PERMISSIONS.TOKENS_MANAGE)
  async create(@CurrentAuth() auth: AuthContext, @Body() body: CreateTokenDto) {
    if (auth.kind !== 'member') {
      throw new ForbiddenException('Tokens must be created by a member');
    }
    const invalid = body.permissions.filter(
      (p) => !(ALL_PERMISSIONS as string[]).includes(p),
    );
    if (invalid.length) {
      throw new ForbiddenException(`Unknown permissions: ${invalid.join(', ')}`);
    }
    const secret = `rpa_${randomBytes(32).toString('hex')}`;
    const token = await this.prisma.apiToken.create({
      data: {
        name: body.name,
        tokenHash: createHash('sha256').update(secret).digest('hex'),
        ownerId: auth.memberId,
        permissions: body.permissions,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    await this.audit.log(auth, 'tokens.create', 'ApiToken', token.id, {
      name: body.name,
      permissions: body.permissions,
    });
    // The plaintext secret is returned exactly once.
    return { id: token.id, name: token.name, secret };
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.TOKENS_MANAGE)
  async revoke(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    await this.prisma.apiToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
    await this.audit.log(auth, 'tokens.revoke', 'ApiToken', id);
    return { ok: true };
  }
}
