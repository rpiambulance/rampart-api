import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export type HeadsupEvent =
  | { kind: 'board' }
  | {
      kind: 'dispatch';
      determinant: string | null;
      complaint: string | null;
      location: string | null;
      receivedAt: string;
    };

/**
 * The channel the displays listen on.
 *
 * A whiteboard on a wall nobody can reach has to be told when something
 * changes; it cannot be asked to refresh. Two things are pushed: "the board
 * moved, fetch it again", and a dispatch, which the screen interrupts itself
 * for. Kept deliberately thin — the event says what happened, and the
 * display asks for the detail — so a reconnecting screen and a connected one
 * end up showing the same thing.
 *
 * In-process only. One API instance serves the station's handful of screens;
 * were this ever to run more than once, this becomes a shared broker rather
 * than a Subject, and the displays would not be able to tell.
 */
@Injectable()
export class HeadsupEvents {
  private readonly channel = new Subject<HeadsupEvent>();

  emit(event: HeadsupEvent): void {
    this.channel.next(event);
  }

  /** Something on the board changed; displays should fetch it again. */
  boardChanged(): void {
    this.emit({ kind: 'board' });
  }

  stream(): Observable<HeadsupEvent> {
    return this.channel.asObservable();
  }
}
