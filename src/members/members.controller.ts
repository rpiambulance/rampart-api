import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { ProfileReviewService } from './profile-review.service';
import { UnlinkedLoginService } from '../auth/unlinked-login.service';
import { MembersService } from './members.service';

class LinkLoginDto {
  @IsInt()
  memberId!: number;
}

class ProfileReviewRequestDto {
  /** Shown to the member, for "we are updating the call list" and the like. */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

class SelfEditDto {
  @IsOptional()
  @IsIn(['sidebar', 'topnav'])
  navLayout?: 'sidebar' | 'topnav';

  /** Remembered events view, so the tab you last chose is the one you land on. */
  @IsOptional()
  @IsIn(['list', 'day', 'week', 'month'])
  eventView?: 'list' | 'day' | 'week' | 'month';

  /** Clock preference. The site shows 24-hour time unless asked otherwise. */
  @IsOptional()
  @IsIn(['24h', '12h'])
  timeFormat?: '24h' | '12h';

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  cellPhone?: string;

  @IsOptional()
  @IsString()
  homePhone?: string;

  @IsOptional()
  @IsString()
  localAddress?: string;

  @IsOptional()
  @IsString()
  homeAddress?: string;
}

class CreateMemberDto {
  /**
   * Set to add somebody whose name matches an existing member.
   *
   * Two people really can share a name, so a name clash is a question rather
   * than a refusal — but it is asked once, deliberately, rather than assumed
   * away. A matching email is a different matter and cannot be confirmed
   * past.
   */
  @IsOptional()
  @IsBoolean()
  confirmDuplicateName?: boolean;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  /**
   * Required when adding somebody, and only then: editing an existing record
   * stays partial, or a member migrated in without one could not be touched
   * at all until somebody found their birthday.
   */
  @IsDateString()
  dob!: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  cellPhone?: string;

  @IsOptional()
  @IsString()
  localAddress?: string;

  @IsOptional()
  @IsString()
  homeAddress?: string;

  @IsOptional()
  @IsString()
  rcsId?: string;

  /**
   * RPI 900 number. Editing it needs members:write — it is absent from
   * SelfEditDto, so members cannot set their own.
   */
  @IsOptional()
  @IsString()
  nineHundredNumber?: string;

  /**
   * The member's Slack account, so direct messages, mentions and chore
   * button presses can find them. Absent from SelfEditDto: a member setting
   * their own would be claiming to be somebody in Slack unverified.
   *
   * A Slack member ID, not a handle. The legacy portal stored handles and
   * they do not work for any of the three, so they are refused here rather
   * than accepted and silently ignored later.
   */
  @IsOptional()
  @Matches(/^$|^[UW][A-Z0-9]{6,}$/, {
    message:
      'A Slack member ID looks like U024BE7LH — find it under the member’s Slack profile, ⋮, Copy member ID. A handle such as @everest will not work.',
  })
  slackId?: string;

  @IsOptional()
  @IsString()
  rin?: string;

  @IsOptional()
  @IsString()
  keycloakSubject?: string;
}

class UpdateMemberDto extends CreateMemberDto {
  @IsOptional()
  @IsString()
  declare firstName: string;

  @IsOptional()
  @IsString()
  declare lastName: string;

  @IsOptional()
  @IsEmail()
  declare email: string;

  // Required to add somebody, optional to edit them: a member migrated in
  // without one must not be un-editable until somebody finds their birthday.
  @IsOptional()
  @IsDateString()
  declare dob: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

class DeactivateManyDto {
  @IsArray()
  @IsInt({ each: true })
  memberIds!: number[];

  /** The cutoff the review was run against, recorded in the audit log. */
  @IsString()
  reason!: string;
}

@Controller({ path: 'members', version: '1' })
export class MembersController {
  constructor(
    private readonly members: MembersService,
    private readonly profileReview: ProfileReviewService,
    private readonly unlinked: UnlinkedLoginService,
  ) {}

  @Get()
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  list(
    @CurrentAuth() auth: AuthContext,
    @Query('includeInactive') includeInactive?: string,
  ) {
    // Inactive members are only ever listed to those who manage the
    // active/inactive lifecycle. For everyone else the flag is ignored
    // rather than rejected, so a stale link simply shows the active roster.
    const maySeeInactive = auth.permissions.has(PERMISSIONS.MEMBERS_DEACTIVATE);
    return this.members.list(maySeeInactive && includeInactive === 'true');
  }

  /**
   * Active members with no crew or event participation since `since`.
   * Read-only: nothing is deactivated until the caller confirms a list.
   */
  @Get('inactivity-review')
  @RequirePermissions(PERMISSIONS.MEMBERS_DEACTIVATE)
  inactivityReview(
    @CurrentAuth() auth: AuthContext,
    @Query('since') since?: string,
  ) {
    if (!since || !/^\d{4}-\d{2}-\d{2}$/.test(since)) {
      throw new BadRequestException('since must be a date in YYYY-MM-DD form');
    }
    if (Number.isNaN(new Date(`${since}T00:00:00Z`).getTime())) {
      throw new BadRequestException(`${since} is not a real date`);
    }
    // Passed on as a date string: the service compares it against both a
    // date-only column and an instant column, which need different values.
    return this.members.inactivityReview(
      since,
      auth.kind === 'member' ? auth.memberId : undefined,
    );
  }

  @Post('deactivate-many')
  @RequirePermissions(PERMISSIONS.MEMBERS_DEACTIVATE)
  deactivateMany(
    @CurrentAuth() auth: AuthContext,
    @Body() body: DeactivateManyDto,
  ) {
    return this.members.deactivateMany(body.memberIds, auth, body.reason);
  }

  @Get('me')
  async me(@CurrentAuth() auth: AuthContext) {
    const member = await this.members.get(requireMember(auth));
    // Effective permission set (union of currently-held roles) so clients
    // can tailor navigation/affordances. Enforcement stays server-side.
    return { ...member, permissions: [...auth.permissions].sort() };
  }

  @Patch('me')
  async editSelf(@CurrentAuth() auth: AuthContext, @Body() body: SelfEditDto) {
    const memberId = requireMember(auth);
    const updated = await this.members.update(memberId, body);
    // Editing your own details is reviewing them, so it answers an
    // outstanding request rather than leaving one open behind a change that
    // was made because of it.
    await this.profileReview.confirm(memberId);
    return updated;
  }

  /** Logins waiting to be attached to somebody. */
  @Get('unlinked-logins')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  unlinkedLogins() {
    return this.unlinked.outstanding();
  }

  /** Attaches one to a member, which closes every officer's copy of the task. */
  @Post('unlinked-logins/:id/link')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  linkUnlinkedLogin(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: LinkLoginDto,
  ) {
    return this.unlinked.link(auth, id, body.memberId);
  }

  /** Whether this member has been asked to check their details. */
  @Get('me/profile-review')
  profileReviewState(@CurrentAuth() auth: AuthContext) {
    return this.profileReview.stateFor(requireMember(auth));
  }

  /** "Yes, these are right." Clears the request without changing anything. */
  @Post('me/profile-review/confirm')
  confirmProfile(@CurrentAuth() auth: AuthContext) {
    return this.profileReview.confirm(requireMember(auth));
  }

  /**
   * Ask everybody active to check their details.
   *
   * Before the :id route below, or "everyone" would be read as a member id.
   */
  @Post('profile-review/request-all')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  requestProfileReviewAll(
    @CurrentAuth() auth: AuthContext,
    @Body() body: ProfileReviewRequestDto,
  ) {
    return this.profileReview.requestFromEveryone(auth, body.note);
  }

  @Post(':id/profile-review/request')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  requestProfileReview(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ProfileReviewRequestDto,
  ) {
    return this.profileReview.requestFrom(auth, id, body.note);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  get(@Param('id', ParseIntPipe) id: number) {
    return this.members.get(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  create(@CurrentAuth() auth: AuthContext, @Body() body: CreateMemberDto) {
    return this.members.create(auth, body);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMemberDto,
  ) {
    if (
      body.active === false &&
      !auth.permissions.has(PERMISSIONS.MEMBERS_DEACTIVATE)
    ) {
      throw new ForbiddenException('Missing permission: members:deactivate');
    }
    return this.members.update(id, body, auth);
  }
}
