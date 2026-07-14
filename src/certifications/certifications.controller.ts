import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { CertificationsService } from './certifications.service';

class VerifyDto {
  @IsBoolean()
  approve!: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

class SubmitCertDto {
  @IsInt()
  typeId!: number;

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

  @Get('expiring')
  @RequirePermissions(PERMISSIONS.CERTS_READ_ALL)
  expiring(@Query('withinDays') withinDays?: string) {
    return this.certs.expiring(withinDays ? Number(withinDays) : 30);
  }

  @Post()
  submit(@CurrentAuth() auth: AuthContext, @Body() body: SubmitCertDto) {
    return this.certs.submit(requireMember(auth), body);
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  upload(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.certs.attachDocument(requireMember(auth), id, file);
  }

  @Get('documents/:documentId')
  @RequirePermissions(PERMISSIONS.CERTS_VERIFY)
  async document(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Res() res: Response,
  ) {
    const { doc, object } = await this.certs.getDocument(documentId);
    res.setHeader('Content-Type', object.contentType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${doc.fileName.replace(/"/g, '')}"`,
    );
    res.send(object.body);
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
