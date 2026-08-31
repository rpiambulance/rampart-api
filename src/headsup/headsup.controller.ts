import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { map, merge, Observable, startWith } from 'rxjs';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { Public } from '../auth/public.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { HeadsupEvents } from './headsup.events';
import { HeadsupService, isCounter } from './headsup.service';

class NoteDto {
  @IsString()
  @MaxLength(500)
  body!: string;
}

class MishapDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsDateString()
  occurredAt?: string;
}

class LinkDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;
}

/**
 * The station whiteboard.
 *
 * Split three ways by who is asking. A display holds a token and may read
 * the board and nothing else. A member may write on it, because that is what
 * a whiteboard is for. Handing out the links and clearing the counters is
 * the only part that needs a permission.
 */
@Controller({ path: 'headsup', version: '1' })
export class HeadsupController {
  constructor(
    private readonly headsup: HeadsupService,
    private readonly events: HeadsupEvents,
  ) {}

  // --------------------------------------------------- what a display sees

  @Public()
  @Get('board')
  async board(@Query('token') token?: string) {
    await this.headsup.requireLink(token);
    return this.headsup.board();
  }

  /**
   * The live channel a display listens on.
   *
   * Server-sent events rather than a socket: everything here travels one
   * way, to screens that never answer back, and an EventSource reconnects
   * itself when the station wifi drops — which is the failure that actually
   * happens. A keep-alive rides along because idle proxies close quiet
   * connections, and a dark board is worse than a chatty one.
   */
  @Public()
  @Sse('stream')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  async stream(@Query('token') token?: string): Promise<Observable<unknown>> {
    await this.headsup.requireLink(token);
    const events = this.events
      .stream()
      .pipe(map((event) => ({ type: event.kind, data: event })));
    const keepAlive = new Observable<{ type: string; data: unknown }>(
      (subscriber) => {
        const timer = setInterval(
          () => subscriber.next({ type: 'ping', data: { at: Date.now() } }),
          25_000,
        );
        return () => clearInterval(timer);
      },
    );
    // A screen that has just connected should not wait for the next change
    // before it has anything on it.
    return merge(events, keepAlive).pipe(
      startWith({ type: 'board', data: { kind: 'board' } }),
    );
  }

  // ------------------------------------------ what anybody on duty can do

  @Get('notes')
  notes() {
    return this.headsup.notes();
  }

  @Post('notes')
  addNote(@CurrentAuth() auth: AuthContext, @Body() body: NoteDto) {
    return this.headsup.addNote(auth, body.body);
  }

  @Delete('notes/:id')
  removeNote(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.headsup.removeNote(auth, id);
  }

  @Get('mishaps')
  mishaps() {
    return this.headsup.mishaps();
  }

  @Post('mishaps')
  addMishap(@CurrentAuth() auth: AuthContext, @Body() body: MishapDto) {
    return this.headsup.addMishap(auth, body.note, body.occurredAt);
  }

  @Delete('mishaps/:id')
  removeMishap(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.headsup.removeMishap(auth, id);
  }

  /** The counters as the board reads them, for the page that clears them. */
  @Get('counters')
  async counters() {
    const [calls, mishaps] = await Promise.all([
      this.headsup.count('calls'),
      this.headsup.count('mishaps'),
    ]);
    return { calls, mishaps };
  }

  // -------------------------------------------------------- the admin side

  @Post('counters/:counter/reset')
  @RequirePermissions(PERMISSIONS.HEADSUP_MANAGE)
  reset(@CurrentAuth() auth: AuthContext, @Param('counter') counter: string) {
    if (!isCounter(counter)) {
      throw new BadRequestException('The board has no such counter.');
    }
    return this.headsup.resetCounter(auth, counter);
  }

  @Get('counters/:counter/resets')
  @RequirePermissions(PERMISSIONS.HEADSUP_MANAGE)
  resets(@Param('counter') counter: string) {
    if (!isCounter(counter)) {
      throw new BadRequestException('The board has no such counter.');
    }
    return this.headsup.resetHistory(counter);
  }

  @Get('links')
  @RequirePermissions(PERMISSIONS.HEADSUP_MANAGE)
  links() {
    return this.headsup.listLinks();
  }

  @Post('links')
  @RequirePermissions(PERMISSIONS.HEADSUP_MANAGE)
  createLink(@CurrentAuth() auth: AuthContext, @Body() body: LinkDto) {
    return this.headsup.createLink(auth, body.label);
  }

  @Delete('links/:id')
  @RequirePermissions(PERMISSIONS.HEADSUP_MANAGE)
  revokeLink(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.headsup.revokeLink(auth, id);
  }
}
