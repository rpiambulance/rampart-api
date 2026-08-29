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
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_UPLOAD_BYTES } from '../storage/upload-limits';
import type { Response } from 'express';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { CertificationsService } from './certifications.service';

class CorrectionsDto {
  @IsOptional()
  @IsInt()
  typeId?: number;

  @IsOptional()
  @IsString()
  identifier?: string | null;

  @IsOptional()
  @IsDateString()
  issuedAt?: string | null;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;
}

class TypeConfigDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  abbreviation?: string;

  @IsOptional()
  @IsString()
  issuingOrg?: string | null;

  @IsOptional()
  @IsInt()
  defaultValidityMonths?: number | null;
}

class VerifyDto {
  @IsBoolean()
  approve!: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  /** Fixes applied to the submission as part of approving it. */
  @IsOptional()
  @ValidateNested()
  @Type(() => CorrectionsDto)
  corrections?: CorrectionsDto;

  /** Vets a proposed type. Requires settings:write. */
  @IsOptional()
  @ValidateNested()
  @Type(() => TypeConfigDto)
  typeConfig?: TypeConfigDto;
}

class CertTypeDto {
  @IsString()
  name!: string;

  @IsString()
  abbreviation!: string;

  @IsOptional()
  @IsString()
  issuingOrg?: string;

  @IsOptional()
  @IsInt()
  defaultValidityMonths?: number | null;

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  identifierField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  issuedAtField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  expiresAtField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  documentField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';
}

class PatchCertTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  abbreviation?: string;

  @IsOptional()
  @IsString()
  issuingOrg?: string;

  @IsOptional()
  @IsInt()
  defaultValidityMonths?: number | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  identifierField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  issuedAtField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  expiresAtField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';

  @IsOptional()
  @IsIn(['HIDDEN', 'OPTIONAL', 'REQUIRED'])
  documentField?: 'HIDDEN' | 'OPTIONAL' | 'REQUIRED';
}

class LadderDto {
  /** Highest rung first; each outranks the next. */
  @IsArray()
  @IsInt({ each: true })
  typeIds!: number[];

  /** Break the ladder instead of saving it. */
  @IsOptional()
  @IsBoolean()
  unlink?: boolean;
}

class SupersedesDto {
  @IsArray()
  @IsInt({ each: true })
  lowerTypeIds!: number[];
}

class AmendCertDto {
  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

class SubmitCertDto {
  /** One of these: an existing type, or a name for one that is not listed. */
  @IsOptional()
  @IsInt()
  typeId?: number;

  @IsOptional()
  @IsString()
  proposedTypeName?: string;

  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

@Controller({ path: 'certifications', version: '1' })
export class CertificationsController {
  constructor(private readonly certs: CertificationsService) {}

  @Get('types')
  types() {
    return this.certs.listTypes();
  }

  @Post('types')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  createType(@Body() body: CertTypeDto) {
    return this.certs.createType(body);
  }

  @Patch('types/:id')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  updateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchCertTypeDto,
  ) {
    return this.certs.updateType(id, body);
  }

  /** Save an ordered ladder, highest rung first. */
  @Put('ladder')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  saveLadder(@CurrentAuth() auth: AuthContext, @Body() body: LadderDto) {
    return this.certs.saveLadder(auth, body.typeIds, { unlink: body.unlink });
  }

  /** Replace the certifications this type outranks. */
  @Put('types/:id/supersedes')
  @RequirePermissions(PERMISSIONS.SETTINGS_WRITE)
  setSupersedes(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SupersedesDto,
  ) {
    return this.certs.setSupersedes(auth, id, body.lowerTypeIds);
  }

  @Get('mine')
  mine(@CurrentAuth() auth: AuthContext) {
    return this.certs.listForMember(requireMember(auth));
  }

  @Get('member/:memberId')
  @RequirePermissions(PERMISSIONS.CERTS_READ_ALL)
  forMember(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.certs.listForMember(memberId);
  }

  @Get('pending')
  @RequirePermissions(PERMISSIONS.CERTS_VERIFY)
  pending() {
    return this.certs.listPending();
  }

  /**
   * How many are waiting, for the navigation badge. Separate from the list
   * so the nav shell — which renders on every page — does not fetch and
   * discard the whole queue to show a number.
   */
  @Get('pending/count')
  @RequirePermissions(PERMISSIONS.CERTS_VERIFY)
  pendingCount() {
    return this.certs.pendingCount();
  }

  /**
   * What the nightly check would change, and why — the list behind the
   * warning that a sweep was held back.
   */
  @Get('suspensions/preview')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  suspensionPreview() {
    return this.certs.previewSuspensions();
  }

  /**
   * Runs the nightly check now.
   *
   * So that fixing a requirement can be confirmed straight away rather than
   * waited on until morning — and so a held-back sweep can be released by
   * correcting the rule rather than only by overriding the guard.
   */
  @Post('suspensions/run')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  runSuspensionCheck() {
    return this.certs.recomputeSuspensions();
  }

  /** Cheap enough for the navigation badge; see heldSuspensions. */
  @Get('suspensions/held')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  heldSuspensions() {
    return this.certs.heldSuspensions();
  }

  /** Apply it anyway, past the crowd guard, because somebody has looked. */
  @Post('suspensions/apply')
  @RequirePermissions(PERMISSIONS.CREDENTIALS_GRANT)
  applySuspensions(@CurrentAuth() auth: AuthContext) {
    return this.certs.applySuspensions(auth);
  }

  @Get('expiring')
  @RequirePermissions(PERMISSIONS.CERTS_READ_ALL)
  expiring(@Query('withinDays') withinDays?: string) {
    return this.certs.expiring(withinDays ? Number(withinDays) : 30);
  }

  @Post()
  submit(@CurrentAuth() auth: AuthContext, @Body() body: SubmitCertDto) {
    return this.certs.submit(requireMember(auth), body);
  }

  /**
   * Record a certification for another member. Gated on certs:verify — the
   * people who approve certifications are the ones who hold this data.
   */
  @Post('member/:memberId')
  @RequirePermissions(PERMISSIONS.CERTS_VERIFY)
  submitFor(
    @CurrentAuth() auth: AuthContext,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() body: SubmitCertDto,
  ) {
    return this.certs.submit(memberId, body, { enteredBy: auth });
  }

  @Post(':id/documents')
  // Kept in step with the web app's server-action body limit, which is the
  // first ceiling an upload meets and silently the lower one if the two
  // drift apart.
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  upload(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Whoever verifies certifications may attach to anyone's: they are often
    // the one holding the card, and entering it on a member's behalf without
    // being able to attach the proof would be half a job.
    return this.certs.attachDocument(requireMember(auth), id, file, {
      asOfficer: auth.permissions.has(PERMISSIONS.CERTS_VERIFY),
    });
  }

  @Delete('documents/:documentId')
  removeDocument(
    @CurrentAuth() auth: AuthContext,
    @Param('documentId') documentId: string,
  ) {
    return this.certs.removeDocument(auth, documentId);
  }

  /**
   * Undecorated on purpose: a member may open their own documents, which no
   * single permission expresses, so the service decides and answers 403.
   */
  @Get('documents/:documentId')
  async document(
    @CurrentAuth() auth: AuthContext,
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ) {
    const { doc, object } = await this.certs.getDocument(documentId, auth);
    res.setHeader('Content-Type', object.contentType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${doc.fileName.replace(/"/g, '')}"`,
    );
    res.send(object.body);
  }

  @Patch(':id')
  amend(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AmendCertDto,
  ) {
    return this.certs.amend(auth, id, body);
  }

  @Delete(':id')
  remove(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.certs.remove(auth, id);
  }

  @Post(':id/verify')
  @RequirePermissions(PERMISSIONS.CERTS_VERIFY)
  verify(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: VerifyDto,
  ) {
    return this.certs.verify(auth, id, body);
  }
}
