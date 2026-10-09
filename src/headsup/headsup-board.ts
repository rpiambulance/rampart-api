import { displayName } from '../common/name';

/** The five seats the board has room for, in the order it shows them. */
export const BOARD_POSITIONS = [
  'CC',
  'DRIVER',
  'ATTENDANT',
  'OBSERVER',
  'DUTY_SUP',
] as const;

export type BoardPosition = (typeof BOARD_POSITIONS)[number];

export const POSITION_TITLES: Record<BoardPosition, string> = {
  CC: 'Crew chief',
  DRIVER: 'Driver',
  ATTENDANT: 'Attendant',
  OBSERVER: 'Attendant',
  DUTY_SUP: 'Duty supervisor',
};

/**
 * The numbers a rider answers to when they have none of their own.
 *
 * A rider without a 900 number still has to be addressable on the radio,
 * and the station has always used these two for it. They are handed out in
 * order to the riders who need one — not pinned to a seat. One rider short
 * of a number is 992 whichever seat they are sitting in; tying 993 to the
 * observer meant a crew of three numbered people and one without put that
 * one on 993, a number nobody on the radio was expecting to hear.
 */
export const RIDER_SPARES = ['992', '993'] as const;

/** The seats a spare belongs to: the spares are the riders'. */
const SPARE_SEATS: BoardPosition[] = ['ATTENDANT', 'OBSERVER'];

export interface BoardSeat {
  position: BoardPosition;
  title: string;
  name: string | null;
  number: string | null;
  /** Nobody in it, so the board shows the seat rather than hiding it. */
  vacant: boolean;
}

interface SlotInput {
  position: string;
  placeholder: string | null;
  member: {
    firstName: string;
    preferredFirstName?: string | null;
    lastName: string;
    nineHundredNumber: string | null;
  } | null;
}

/**
 * Tonight's five seats, filled in.
 *
 * Every seat is returned whether or not anybody is in it: a board that hides
 * an empty seat reads as a full crew, which is the one thing it must never
 * do. A placeholder — "CLOSED" and friends — is shown as written, because
 * somebody put it there on purpose.
 */
export function crewBoard(slots: SlotInput[]): BoardSeat[] {
  const bySeat = new Map(slots.map((slot) => [slot.position, slot]));

  // Worked out across the crew before any seat is drawn, because what one
  // rider is called depends on whether the other needed a number too.
  const spares = new Map<BoardPosition, string>();
  for (const seat of SPARE_SEATS) {
    const member = bySeat.get(seat)?.member;
    if (!member || member.nineHundredNumber?.trim()) continue;
    const spare = RIDER_SPARES[spares.size];
    if (spare) spares.set(seat, spare);
  }

  return BOARD_POSITIONS.map((position) => {
    const slot = bySeat.get(position);
    const member = slot?.member ?? null;
    if (member) {
      return {
        position,
        title: POSITION_TITLES[position],
        name: displayName(member),
        // A blank number is the same as none: the fallback exists so the
        // seat is addressable, not so the board can show an empty gap.
        number:
          member.nineHundredNumber?.trim() || spares.get(position) || null,
        vacant: false,
      };
    }
    const placeholder = slot?.placeholder?.trim();
    return {
      position,
      title: POSITION_TITLES[position],
      name: placeholder || null,
      number: null,
      vacant: !placeholder,
    };
  });
}
