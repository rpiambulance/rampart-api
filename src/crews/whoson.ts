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

/** 06:00 to 09:00 in New York, as minutes past midnight. */
const MORNING_START = 6 * 60;
const MORNING_END = 9 * 60;

/**
 * Whether the answer to "who is on" is two nights rather than one.
 *
 * A night crew works into the following morning, so between the small hours
 * and the start of the day the interesting crew is the one that has just
 * finished — but by breakfast the one coming on that evening matters too.
 * Somebody asking at seven wants both, and cannot say which they meant.
 */
export function isHandoverMorning(now = new Date()): boolean {
  const { minutes } = nyNow(now);
  return minutes >= MORNING_START && minutes < MORNING_END;
}

/**
 * The nights a bare /whoson should answer with, newest last.
 *
 * Only when nothing was asked for in particular: somebody who typed a date,
 * or "yesterday", has said which night they mean and gets that one.
 */
export function nightsFor(asked: string, now = new Date()): string[] | null {
  const today = nyNow(now).dateStr;
  const said = asked.trim().toLowerCase();
  const unspecified = said === '' || said === 'today' || said === 'tonight';
  if (unspecified && isHandoverMorning(now)) {
    return [addDays(today, -1), today];
  }
  const one = whosOnDate(asked, today);
  return one ? [one] : null;
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
  if (nights.length === 1) return whosOnText(prisma, nights[0], { now });

  const [previous, tonight] = nights;
  const parts = await Promise.all([
    whosOnText(prisma, previous, { label: '*Last night’s crew:*', now }),
    whosOnText(prisma, tonight, { label: '*Tonight’s crew:*', now }),
  ]);
  return parts.join('\n\n');
}
