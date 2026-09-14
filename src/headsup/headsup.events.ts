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
    }
  /**
   * Who has said they are coming, redrawn every time somebody answers.
   *
   * Carries the roster rather than a "go and look" so the screen can fill in
   * a name the moment it lands — the whole point of it being on a wall is
   * that somebody walking past sees the answer without asking for it.
   */
  | {
      kind: 'responders';
      calloutId: number;
      asked: boolean;
      headline: string;
      openedAt: string;
      closesAt: string;
      responders: Array<{ name: string; responding: boolean }>;
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
