import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IsInt, IsOptional, IsString } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { ChecklistsService } from './checklists.service';

class StartDto {
  /** Omitted means the caller themselves. */
  @IsOptional()
  @IsInt()
  memberId?: number;
}

class SignDto {
  @IsInt()
  memberId!: number;

  @IsOptional()
  @IsString()
  note?: string;
}

class RevokeDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

/**
 * Training checklists: lines signed off one at a time, over time, by whoever
 * holds the credential that line calls for.
 *
 * Signing is authorised by credential rather than by permission — the same
 * rule as trainer clearances. A trainer's authority to say "I watched them do
 * this" comes from what they are qualified in, not from an administrative
 * grant, so nothing here is gated on a permission except withdrawing someone
 * else's signature.
 */
@Controller({ path: 'checklists', version: '1' })
export class ChecklistsController {
  constructor(private readonly checklists: ChecklistsService) {}

  @Get()
  list() {
    return this.checklists.listTemplates();
  }

  /** The signed-in member's own checklists, read-only. */
  @Get('mine')
  mine(@CurrentAuth() auth: AuthContext) {
    return this.checklists.mine(requireMember(auth));
  }

  /** What this member could start but has not. */
  @Get('available')
  available(@CurrentAuth() auth: AuthContext) {
    return this.checklists.availableTo(requireMember(auth));
  }

  /**
   * Start a checklist. Omit memberId to start your own; naming somebody else
   * needs the credential that signs its lines.
   */
  @Post(':templateId/start')
  start(
    @CurrentAuth() auth: AuthContext,
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() body: StartDto,
  ) {
    return this.checklists.start(
      auth,
      templateId,
      body.memberId ?? requireMember(auth),
    );
  }

  @Post(':templateId/unstart')
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  unstart(
    @CurrentAuth() auth: AuthContext,
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() body: StartDto,
  ) {
    return this.checklists.unstart(
      auth,
      templateId,
      body.memberId ?? requireMember(auth),
    );
  }

  /** Who a trainer could start this for. */
  @Get(':templateId/not-started')
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  notStarted(@Param('templateId', ParseIntPipe) templateId: number) {
    return this.checklists.notStarted(templateId);
  }

  @Get(':templateId/members')
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  subjects(@Param('templateId', ParseIntPipe) templateId: number) {
    return this.checklists.subjects(templateId);
  }

  @Get(':templateId/members/:memberId')
  progress(
    @CurrentAuth() auth: AuthContext,
    @Param('templateId', ParseIntPipe) templateId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    const viewer = requireMember(auth);
    // Anyone may read their own; reading someone else's is a roster matter.
    if (
      viewer !== memberId &&
      !auth.permissions.has(PERMISSIONS.MEMBERS_READ)
    ) {
      throw new ForbiddenException('Not your checklist');
    }
    return this.checklists.progress(templateId, memberId);
  }

  @Post('items/:itemId/sign')
  sign(
    @CurrentAuth() auth: AuthContext,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() body: SignDto,
  ) {
    return this.checklists.sign(
      auth,
      requireMember(auth),
      itemId,
      body.memberId,
      body.note,
    );
  }

  @Post('signoffs/:id/revoke')
  revoke(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RevokeDto,
  ) {
    return this.checklists.revoke(auth, requireMember(auth), id, body.reason);
  }
}
