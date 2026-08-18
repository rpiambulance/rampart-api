import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { CredentialsService } from './credentials.service';

class TrainerGrantDto {
  @IsInt()
  memberId!: number;

  @IsIn(['A_CC', 'A_D'])
  credentialKey!: 'A_CC' | 'A_D';
}

class GrantDto {
  @IsInt()
  memberId!: number;

  @IsInt()
  credentialTypeId!: number;

  @IsOptional()
  @IsString()
  title?: string;

  /**
   * The date the member actually earned this credential (YYYY-MM-DD). Omit
   * when backfilling a credential whose promotion date is not yet known —
   * it can be filled in later via PATCH .../effective-date.
   */
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'effectiveAt must be a date in YYYY-MM-DD form',
  })
  effectiveAt?: string;
}

class EffectiveDateDto {
  /** Null clears the date back to unknown. */
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'effectiveAt must be a date in YYYY-MM-DD form',
  })
  effectiveAt?: string | null;
}

class LinkedRolesDto {
  @IsArray()
  @IsInt({ each: true })
  roleIds!: number[];
}

class RequirementDto {
  @IsIn(['CERTIFICATION', 'EVALUATION_COUNT', 'CLASS', 'CHECKLIST'])
  kind!: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS' | 'CHECKLIST';

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
}

class AppointDto {
  @IsInt()
  memberId!: number;

  @IsString()
  credentialKey!: string; // e.g. DS

  @IsOptional()
  @IsBoolean()
  senior?: boolean; // grants the "Senior Duty Supervisor" title
}

/**
 * A promotion date is a plain calendar date, and it cannot be in the future —
 * a credential nobody has earned yet is not a credential.
 */
function parseEffectiveDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${value} is not a real date`);
  }
  if (date.getTime() > Date.now()) {
    throw new BadRequestException('A promotion date cannot be in the future');
  }
  return date;
}

@Controller({ path: 'credentials', version: '1' })
export class CredentialsController {
  constructor(private readonly credentials: CredentialsService) {}

  @Get('types')
  types() {
    return this.credentials.listTypes();
  }

  /** Replace the roles conferred by holding this credential (roles:manage). */
  @Put('types/:id/roles')
  @RequirePermissions(PERMISSIONS.ROLES_MANAGE)
  setLinkedRoles(
    @Param('id', ParseIntPipe) credentialTypeId: number,
    @Body() body: LinkedRolesDto,
  ) {
    return this.credentials.setLinkedRoles(credentialTypeId, body.roleIds);
  }

  @Post('types/:id/requirements')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  addRequirement(
    @Param('id', ParseIntPipe) credentialTypeId: number,
    @Body() body: RequirementDto,
  ) {
    return this.credentials.addRequirement(credentialTypeId, body);
  }

  @Delete('requirements/:requirementId')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  removeRequirement(@Param('requirementId', ParseIntPipe) requirementId: number) {
    return this.credentials.removeRequirement(requirementId);
  }

  @Get('checklist/:memberId/:credentialTypeId')
  @RequirePermissions(PERMISSIONS.PROMOTIONS_REVIEW)
  checklist(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('credentialTypeId', ParseIntPipe) credentialTypeId: number,
  ) {
    return this.credentials.checklist(memberId, credentialTypeId);
  }

  @Get('my-checklist/:credentialTypeId')
  myChecklist(
    @CurrentAuth() auth: AuthContext,
    @Param('credentialTypeId', ParseIntPipe) credentialTypeId: number,
  ) {
    if (auth.kind !== 'member') return [];
    return this.credentials.checklist(auth.memberId, credentialTypeId);
  }

  /** What the caller's own training lets them clear others for. */
  @Get('trainer-grants')
  trainerGrants(@CurrentAuth() auth: AuthContext) {
    if (auth.kind !== 'member') return [];
    return this.credentials.trainerGrants(auth.memberId);
  }

  /**
   * The same, with the members each one could be given to.
   *
   * Deliberately not gated on members:read: a trainer is being shown exactly
   * the people they may act on, which is a narrower thing than the roster.
   */
  @Get('trainer-candidates')
  trainerCandidates(@CurrentAuth() auth: AuthContext) {
    if (auth.kind !== 'member') return [];
    return this.credentials.trainerCandidates(auth.memberId);
  }

  /**
   * A trainer clearing a member for calls. Gated on the trainer's credential
   * rather than a permission, so no separate grant is needed.
   */
  @Post('trainer-grant')
  trainerGrant(
    @CurrentAuth() auth: AuthContext,
    @Body() body: TrainerGrantDto,
  ) {
    return this.credentials.trainerGrant(auth, body.memberId, body.credentialKey);
  }

  @Post('grant')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  grant(@CurrentAuth() auth: AuthContext, @Body() body: GrantDto) {
    return this.credentials.grant(auth, body.memberId, body.credentialTypeId, {
      title: body.title,
      effectiveAt: parseEffectiveDate(body.effectiveAt),
    });
  }

  /**
   * Fills in (or corrects) the date a member actually earned a credential.
   * Separate from granting so a credential can be backfilled now and dated
   * once someone digs the promotion date out of the old records.
   */
  @Patch(':memberId/:credentialTypeId/effective-date')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  setEffectiveDate(
    @CurrentAuth() auth: AuthContext,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('credentialTypeId', ParseIntPipe) credentialTypeId: number,
    @Body() body: EffectiveDateDto,
  ) {
    return this.credentials.setEffectiveDate(
      auth,
      memberId,
      credentialTypeId,
      parseEffectiveDate(body.effectiveAt),
    );
  }

  @Post('appoint')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_APPOINT)
  appoint(@CurrentAuth() auth: AuthContext, @Body() body: AppointDto) {
    return this.credentials.appoint(auth, body.memberId, body.credentialKey, {
      senior: body.senior,
    });
  }

  @Delete(':memberId/:credentialTypeId')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  revoke(
    @CurrentAuth() auth: AuthContext,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('credentialTypeId', ParseIntPipe) credentialTypeId: number,
  ) {
    return this.credentials.revoke(auth, memberId, credentialTypeId);
  }
}
