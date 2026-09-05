import { addDays, fromDbDate, nyNow, toDbDate } from '../common/dates';
import { mentionFor } from '../notifications/slack-id';
import type { PrismaService } from '../prisma/prisma.service';

export const POSITION_LABELS: Record<string, string> = {
  CC: 'Crew Chief',
  DRIVER: 'Driver',
  ATTENDANT: 'Rider',
  OBSERVER: 'Rider',
  DUTY_SUP: 'Duty Supervisor',
};

export const POSITION_ORDER = [
  'CC',
  'DRIVER',
  'ATTENDANT',
  'OBSERVER',
  'DUTY_SUP',
] as const;

/**
 * Who is on for a given night, as Slack text.
 *
 * Shared by the nightly post and the /whoson command so the two can never
 * disagree — a member checking the command against last night's post and
 * finding different answers would trust neither.
 */
/**
 * The night a /whoson argument names, or null if it names nothing.
 *
 * Deliberately generous about how people type. Somebody reaching for this
 * mid-shift is on a phone, one-handed, and being told to try again because
 * they wrote "yest" is a worse answer than the roster.
 */
export function whosOnDate(
  asked: string,
  today = nyNow().dateStr,
): string | null {
  const said = asked.trim().toLowerCase();
  if (said === '' || said === 'today' || said === 'tonight') return today;
  if (said === 'tomorrow') return addDays(today, 1);
  if (said === 'yesterday' || said === 'yest') return addDays(today, -1);
  return /^\d{4}-\d{2}-\d{2}$/.test(said) ? said : null;
}

/**
 * The hours a night crew's shift straddles, in New York, as minutes past
 * midnight. A crew comes on in the evening, works through, and is relieved
 * around six; by nine the night is over and the next one is what matters.
 */
const NIGHT_ENDS = 6 * 60;
const HANDOVER_ENDS = 9 * 60;

/** A night to show, and what to call it at the hour it is being shown. */
export interface Night {
  date: string;
  /** Unset means let the date decide, as it does for an explicit request. */
  label?: string;
}

/**
 * The nights a bare /whoson should answer with, in the order they happened.
 *
 * The calendar day is the wrong answer for a third of the hours in it,
 * because a night crew belongs to the evening it started and works past
 * midnight into the next date. So:
 *
 *   before 06:00  the crew that came on last night is still in the building,
 *                 and is what "who is on" means. It is still tonight to
 *                 anybody awake to ask, so that is what it is called.
 *   06:00–09:00   one crew has just come off and another has not come on.
 *                 Both, because which one is meant cannot be guessed.
 *   after 09:00   the night ahead.
 *
 * Only when nothing was asked for in particular: somebody who typed a date,
 * or "yesterday", has said which night they mean and gets that one.
 */
export function nightsFor(asked: string, now = new Date()): Night[] | null {
  const { dateStr: today, minutes } = nyNow(now);
  const said = asked.trim().toLowerCase();
  const unspecified = said === '' || said === 'today' || said === 'tonight';

  if (unspecified) {
    const lastNight = addDays(today, -1);
    if (minutes < NIGHT_ENDS) {
      return [{ date: lastNight, label: '*Tonight’s crew:*' }];
    }
    if (minutes < HANDOVER_ENDS) {
      return [
        { date: lastNight, label: '*Last night’s crew:*' },
        { date: today, label: '*Tonight’s crew:*' },
      ];
    }
    return [{ date: today }];
  }

  const one = whosOnDate(asked, today);
  return one ? [{ date: one }] : null;
}

export async function whosOnText(
  prisma: PrismaService,
  dateStr = nyNow().dateStr,
  opts: {
    /** Overrides the date-derived heading, for a night named by what it is. */
    label?: string;
    /** The clock to call "today" by, so a caller injecting one is believed. */
    now?: Date;
  } = {},
): Promise<string> {
  const crew = await prisma.crew.findUnique({
    where: { date: toDbDate(dateStr) },
    include: {
      slots: {
        include: {
          member: {
            select: {
              firstName: true,
              preferredFirstName: true,
              lastName: true,
              slackId: true,
            },
          },
        },
      },
    },
  });
  if (!crew) return `No crew is scheduled for ${dateStr}.`;

  const when = fromDbDate(crew.date);
  const heading =
    opts.label ??
    (when === nyNow(opts.now).dateStr
      ? '*Tonight’s crew:*'
      : `*Crew for ${when}:*`);

  // A night out of service still has a duty supervisor, so the seat is shown
  // rather than the whole crew being replaced by a notice.
  const lines = [
    crew.outOfService
      ? `${heading}\n:warning: *Out of service*${crew.outOfServiceReason ? ` — ${crew.outOfServiceReason}` : ''}`
      : heading,
  ];
  for (const position of POSITION_ORDER) {
    if (crew.outOfService && position !== 'DUTY_SUP') continue;
    const slot = crew.slots.find((s) => s.position === position);
    // mentionFor falls back to the name when what is stored is a handle
    // rather than an ID, which is what the legacy import left behind.
    const who = slot?.member
      ? mentionFor(slot.member)
      : (slot?.placeholder ?? '_open_');
    lines.push(`*${POSITION_LABELS[position]}:* ${who}`);
  }
  return lines.join('\n');
}

/**
 * What /whoson answers with.
 *
 * One night usually; two through the handover morning, labelled by what each
 * one is to somebody reading at seven o'clock rather than by its date — "last
 * night" and "tonight" are how the question gets asked, and a pair of ISO
 * dates would leave the reader working out which was which.
 */
export async function whosOnReply(
  prisma: PrismaService,
  asked: string,
  now = new Date(),
): Promise<string | null> {
  const nights = nightsFor(asked, now);
  if (!nights) return null;
  const parts = await Promise.all(
    nights.map((night) =>
      whosOnText(prisma, night.date, { label: night.label, now }),
    ),
  );
  return parts.join('\n\n');
}
