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
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { MembersService } from './members.service';

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
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

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
   */
  @IsOptional()
  @IsString()
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
  constructor(private readonly members: MembersService) {}

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
  editSelf(@CurrentAuth() auth: AuthContext, @Body() body: SelfEditDto) {
    return this.members.update(requireMember(auth), body);
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
    if (body.active === false && !auth.permissions.has(PERMISSIONS.MEMBERS_DEACTIVATE)) {
      throw new ForbiddenException('Missing permission: members:deactivate');
    }
    return this.members.update(id, body, auth);
  }
}
