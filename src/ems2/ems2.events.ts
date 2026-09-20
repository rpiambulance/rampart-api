import { Injectable } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';

/**
 * The channel a standby board listens on.
 *
 * Everything on a standby is written by several people at once — a crew
 * chief on a phone at a gate, a supervisor at the aid station, somebody at
 * the desk — and until now each of them saw their own writes and nobody
 * else's until they reloaded. A board that is wrong about who is on a unit
 * is worse than a board that is slow.
 *
 * Deliberately thin: the event says which standby moved, and the screen
 * asks for it again. A payload describing the change would have to be kept
 * in step with every write, and a screen that missed one would be quietly
 * wrong rather than briefly stale.
 *
 * In-process, like the display channel: one API instance serves the
 * agency. Were this ever to run more than once, this becomes a shared
 * broker and the boards would not be able to tell.
 */
@Injectable()
export class Ems2Events {
  private readonly channel = new Subject<number>();

  /** Something about this standby changed. */
  touched(standbyId: number): void {
    this.channel.next(standbyId);
  }

  /** Changes to one standby, for the screens watching that one. */
  stream(standbyId: number): Observable<{ data: { at: string } }> {
    return this.channel.pipe(
      filter((id) => id === standbyId),
      map(() => ({ data: { at: new Date().toISOString() } })),
    );
  }
}
