import { fromDbDate, nyNow, toDbDate } from '../common/dates';
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
export async function whosOnText(
  prisma: PrismaService,
  dateStr = nyNow().dateStr,
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
    when === nyNow().dateStr ? '*Tonight’s crew:*' : `*Crew for ${when}:*`;

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
    lines.push(`• ${POSITION_LABELS[position]}: ${who}`);
  }
  return lines.join('\n');
}
