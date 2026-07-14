import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { CredentialsService } from './credentials.service';

class GrantDto {
  @IsInt()
  memberId!: number;

  @IsInt()
  credentialTypeId!: number;

  @IsOptional()
  @IsString()
  title?: string;
}

class RequirementDto {
  @IsIn(['CERTIFICATION', 'EVALUATION_COUNT', 'CLASS'])
  kind!: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS';

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

@Controller({ path: 'credentials', version: '1' })
export class CredentialsController {
  constructor(private readonly credentials: CredentialsService) {}

  @Get('types')
  types() {
    return this.credentials.listTypes();
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

  @Post('grant')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  grant(@CurrentAuth() auth: AuthContext, @Body() body: GrantDto) {
    return this.credentials.grant(auth, body.memberId, body.credentialTypeId, {
      title: body.title,
    });
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
