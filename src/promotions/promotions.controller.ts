import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
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
  @RequirePermissions(PERMISSIONS.PROMOTIONS_REVIEW)
  review(@Param('id', ParseIntPipe) id: number) {
    return this.promotions.getReview(id);
  }

  @Post('requests/:id/proxy')
  proxy(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ProxyDto,
  ) {
    return this.promotions.appointProxy(requireMember(auth), id, body.proxyId);
  }

  @Post('requests/:id/vote')
  vote(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: VoteDto,
  ) {
    return this.promotions.vote(requireMember(auth), id, body.vote, body.notes);
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

  @Delete('requests/:id')
  withdraw(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.promotions.withdraw(requireMember(auth), id);
  }
}
