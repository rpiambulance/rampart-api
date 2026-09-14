import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { MAX_UPLOAD_BYTES } from '../storage/upload-limits';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Public } from '../auth/public.decorator';
import { requireIngestToken } from '../auth/ingest-token';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { AirService } from './air.service';

/**
 * What the pager sends: one line of text, which is all it knows.
 *
 * `dispatch` is the name AIR's gateway used for the same field, accepted so
 * a sender pointed here mid-configuration still works rather than posting
 * an empty page nobody notices.
 */
class PageDto {
  @IsOptional() @IsString() @MaxLength(2000) text?: string;
  @IsOptional() @IsString() @MaxLength(2000) dispatch?: string;
}

/**
 * AIR: the page in, and the answers out.
 *
 * The page endpoint is public in the same sense Herald's is — no session,
 * authenticated by the ingest token it carries, in the query string or an
 * Authorization header. A page turns the membership out, so an unsigned one
 * is not something to accept from anybody who finds the URL.
 */
@Controller({ version: '1' })
export class AirController {
  constructor(
    private readonly air: AirService,
    private readonly prisma: PrismaService,
  ) {}

  /** The tones dropped. */
  @Public()
  @Throttle({ default: { limit: 120, ttl: 3_600_000 } })
  @Post('air/page')
  async page(
    @Body() body: PageDto,
    @Req() req: Request,
    @Query('token') token?: string,
  ) {
    await requireIngestToken(this.prisma, PERMISSIONS.DISPATCHES_INGEST, {
      query: token,
      request: req,
    });
    const text = (body.text ?? body.dispatch ?? '').trim();
    if (!text) return { ok: false, reason: 'Nothing to post' };
    const callout = await this.air.page(text, 'DISPATCH');
    return { ok: true, id: callout.id, asked: callout.asked };
  }

  /** A county longtone. Posted for awareness; nobody is asked. */
  @Public()
  @Throttle({ default: { limit: 120, ttl: 3_600_000 } })
  @Post('air/longtone')
  async longtone(
    @Body() body: PageDto,
    @Req() req: Request,
    @Query('token') token?: string,
  ) {
    await requireIngestToken(this.prisma, PERMISSIONS.DISPATCHES_INGEST, {
      query: token,
      request: req,
    });
    const text = (body.text ?? body.dispatch ?? '').trim();
    if (!text) return { ok: false, reason: 'Nothing to post' };
    const callout = await this.air.page(text, 'LONGTONE');
    return { ok: true, id: callout.id, asked: false };
  }

  /**
   * The recording, from the scanner computer.
   *
   * It posted straight to Slack before this existed. Now it comes here, is
   * kept, and is handed on — so the call has its audio in the log a year
   * later, rather than only in a channel somebody has to scroll.
   */
  @Public()
  @Throttle({ default: { limit: 120, ttl: 3_600_000 } })
  @Post('air/audio')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  async audio(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
    @Query('token') token?: string,
  ) {
    await requireIngestToken(this.prisma, PERMISSIONS.DISPATCHES_INGEST, {
      query: token,
      request: req,
    });
    if (!file?.buffer?.length) {
      throw new BadRequestException('No audio was uploaded');
    }
    const stored = await this.air.audio({
      body: file.buffer,
      filename: file.originalname || 'dispatch.mp3',
      contentType: file.mimetype || 'audio/mpeg',
    });
    return {
      ok: true,
      id: stored.id,
      calloutId: stored.calloutId,
      bytes: stored.bytes,
    };
  }

  /** Playing it back in the portal. */
  @Get('air/audio/:id')
  @RequirePermissions(PERMISSIONS.DISPATCHES_READ)
  async playAudio(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const found = await this.air.audioFile(id);
    if (!found) throw new NotFoundException('No such recording');
    res.setHeader('Content-Type', found.object.contentType);
    res.setHeader('Content-Length', String(found.object.body.byteLength));
    // Named so a download is recognisable, and inline so the portal's own
    // player can just point at it.
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${found.audio.filename ?? `dispatch-${id}.mp3`}"`,
    );
    res.end(found.object.body);
  }

  /** What is being asked right now — the screen in the bay reads this. */
  @Get('air/live')
  live() {
    return this.air.live();
  }

  @Get('air/callouts/:id')
  @RequirePermissions(PERMISSIONS.DISPATCHES_READ)
  get(@Param('id', ParseIntPipe) id: number) {
    return this.air.get(id);
  }
}
