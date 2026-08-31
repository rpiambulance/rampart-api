import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { Public } from '../auth/public.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { RequestsService, REQUESTABLE_FIELDS } from './requests.service';

class ProfileChangeDto {
  @IsString()
  field!: string;

  @IsString()
  @MaxLength(200)
  requestedValue!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}

class DecisionDto {
  @IsBoolean()
  approve!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  /** Account requests only: the member created from it. */
  @IsOptional()
  @IsInt()
  memberId?: number;
}

class InviteDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  label?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

class AccountRequestDto {
  @IsString()
  @MaxLength(40)
  inviteCode!: string;

  @IsString()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MaxLength(100)
  lastName!: string;

  @IsEmail()
  email!: string;

  /**
   * The same contact detail a member keeps on their profile.
   *
   * All optional: somebody asking to join should not be turned away over a
   * home phone number, and everything here can be edited once they are in.
   * Asking now only saves the chasing afterwards.
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredFirstName?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  cellPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  homePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  localAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  homeAddress?: string;

  /** Required to create a member, so worth having before the officer starts. */
  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}

/**
 * Asking rather than being told: a member asking for a locked field to be
 * changed, and somebody outside asking for an account at all.
 */
@Controller({ path: 'requests', version: '1' })
export class RequestsController {
  constructor(private readonly requests: RequestsService) {}

  /** Which fields have to be asked about, for the profile page to offer. */
  @Get('profile/fields')
  fields() {
    return Object.entries(REQUESTABLE_FIELDS).map(([key, label]) => ({
      key,
      label,
    }));
  }

  @Post('profile')
  requestProfileChange(
    @CurrentAuth() auth: AuthContext,
    @Body() body: ProfileChangeDto,
  ) {
    return this.requests.requestProfileChange(auth, body);
  }

  /** A member's own, so the profile page can say one is already in. */
  @Get('profile/mine')
  myProfileChanges(@CurrentAuth() auth: AuthContext) {
    return auth.kind === 'member'
      ? this.requests.myProfileChanges(auth.memberId)
      : [];
  }

  @Get('profile/pending')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  pendingProfileChanges() {
    return this.requests.pendingProfileChanges();
  }

  @Post('profile/:id/decide')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  decideProfileChange(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DecisionDto,
  ) {
    return this.requests.decideProfileChange(auth, id, body.approve, body.note);
  }

  // ------------------------------------------------------------ invitations

  @Get('invites')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  invites() {
    return this.requests.listInvites();
  }

  @Post('invites')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  createInvite(@CurrentAuth() auth: AuthContext, @Body() body: InviteDto) {
    return this.requests.createInvite(auth, body);
  }

  @Post('invites/:code/close')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  closeInvite(@CurrentAuth() auth: AuthContext, @Param('code') code: string) {
    return this.requests.closeInvite(auth, code);
  }

  /**
   * Whether a code is good, without spending it.
   *
   * Public because the portal has to know whether to show the form at all,
   * and it says only whether the code works — never which codes exist.
   */
  @Public()
  @Get('invites/check')
  checkInvite(@Query('code') code?: string) {
    return this.requests.checkInvite(code ?? '');
  }

  // -------------------------------------------------------- account requests

  @Public()
  @Post('account')
  requestAccount(@Body() body: AccountRequestDto) {
    return this.requests.requestAccount(body);
  }

  @Get('account/pending')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  pendingAccountRequests() {
    return this.requests.pendingAccountRequests();
  }

  @Post('account/:id/decide')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  decideAccountRequest(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DecisionDto,
  ) {
    return this.requests.decideAccountRequest(auth, id, body.approve, {
      memberId: body.memberId,
      note: body.note,
    });
  }
}
