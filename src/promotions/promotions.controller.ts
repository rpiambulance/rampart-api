import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PromotionsService } from './promotions.service';

class VoteDto {
  @IsIn(['APPROVE', 'DENY'])
  vote!: 'APPROVE' | 'DENY';

  @IsOptional()
  @IsString()
  notes?: string;
}

class ProxyDto {
  @IsInt()
  proxyId!: number;
}

class AdjustmentDto {
  @IsInt()
  memberId!: number;

  @IsInt()
  credentialTypeId!: number;

  @IsIn(['WAIVER', 'ADDITIONAL'])
  kind!: 'WAIVER' | 'ADDITIONAL';

  @IsOptional()
  @IsInt()
  requirementId?: number;

  @IsOptional()
  @IsIn(['CERTIFICATION', 'EVALUATION_COUNT', 'CLASS'])
  reqKind?: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS';

  @IsOptional()
  @IsInt()
  certificationTypeId?: number;

  @IsOptional()
  @IsInt()
  evalTemplateId?: number;

  @IsOptional()
  @IsInt()
  count?: number;

  @IsOptional()
  @IsInt()
  classId?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

/** Why a vote is being taken back. Optional, like a vote's own notes. */
class RescindDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

/** What was counted in the room. */
class MeetingVoteDto {
  @IsString()
  meetingDate!: string;

  @IsInt()
  @Min(0)
  approve!: number;

  @IsInt()
  @Min(0)
  deny!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  abstain?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  /** Give the captain's approval too, for somebody who can. */
  @IsOptional()
  @IsBoolean()
  approveAsCaptain?: boolean;
}

class CaptainDto {
  @IsIn([true, false])
  approved!: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

@Controller({ path: 'promotions', version: '1' })
export class PromotionsController {
  constructor(private readonly promotions: PromotionsService) {}

  @Get('eligible')
  eligible(@CurrentAuth() auth: AuthContext) {
    return this.promotions.eligibleRequests(requireMember(auth));
  }

  @Post('requests')
  create(
    @CurrentAuth() auth: AuthContext,
    @Body() body: { credentialTypeId: number },
  ) {
    return this.promotions.createRequest(
      requireMember(auth),
      body.credentialTypeId,
    );
  }

  @Get('requests')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_REVIEW)
  list(@Query('status') status?: string) {
    return this.promotions.listRequests(status);
  }

  @Get('requests/:id')
  review(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.promotions.getReview(id, auth);
  }

  @Post('requests/:id/proxy')
  proxy(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ProxyDto,
  ) {
    return this.promotions.appointProxy(requireMember(auth), id, body.proxyId);
  }

  @Delete('requests/:id/proxy')
  withdrawProxy(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.promotions.withdrawProxy(requireMember(auth), id);
  }

  @Post('requests/:id/vote')
  vote(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: VoteDto,
  ) {
    return this.promotions.vote(requireMember(auth), id, body.vote, body.notes);
  }

  /** Take back a vote you cast, so the seat can be voted again. */
  @Post('requests/:id/votes/:voteId/rescind')
  rescind(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Param('voteId', ParseIntPipe) voteId: number,
    @Body() body: RescindDto,
  ) {
    return this.promotions.rescindVote(
      requireMember(auth),
      id,
      voteId,
      body.notes,
    );
  }

  /** The committee voted in person; record what it decided, and the count. */
  @Post('requests/:id/in-person-vote')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_RECORD_MEETING)
  recordMeetingVote(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: MeetingVoteDto,
  ) {
    requireMember(auth);
    return this.promotions.recordMeetingVote(
      auth as AuthContext & { kind: 'member' },
      id,
      body,
    );
  }

  @Post('requests/:id/captain-decision')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_CAPTAIN_APPROVE)
  captain(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CaptainDto,
  ) {
    requireMember(auth);
    return this.promotions.captainDecision(
      auth as AuthContext & { kind: 'member' },
      id,
      body.approved,
      body.notes,
    );
  }

  // ---- per-member requirement adjustments ----

  @Get('adjustments/:memberId/:credentialTypeId')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_REVIEW)
  listAdjustments(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('credentialTypeId', ParseIntPipe) credentialTypeId: number,
  ) {
    return this.promotions.listAdjustments(memberId, credentialTypeId);
  }

  @Post('adjustments')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_ADJUST)
  createAdjustment(
    @CurrentAuth() auth: AuthContext,
    @Body() body: AdjustmentDto,
  ) {
    requireMember(auth);
    return this.promotions.createAdjustment(
      auth as AuthContext & { kind: 'member' },
      body,
    );
  }

  @Patch('adjustments/:id')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_ADJUST)
  setAdjustmentSatisfied(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { satisfied: boolean },
  ) {
    return this.promotions.setAdjustmentSatisfied(auth, id, !!body.satisfied);
  }

  @Delete('adjustments/:id')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_ADJUST)
  removeAdjustment(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.promotions.removeAdjustment(auth, id);
  }

  @Delete('requests/:id')
  withdraw(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.promotions.withdraw(requireMember(auth), id);
  }
}
