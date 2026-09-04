import { nyNow, toDbDate } from '../common/dates';
import type { PrismaService } from '../prisma/prisma.service';
import { whosOnText } from './whoson';

type Slot = {
  position: string;
  placeholder: string | null;
  member: {
    firstName: string;
    preferredFirstName: string | null;
    lastName: string;
    slackId: string | null;
  } | null;
};

/** Just enough Prisma for the one query this makes. */
const prismaWith = (
  crew: {
    date: Date;
    outOfService?: boolean;
    outOfServiceReason?: string | null;
    slots: Slot[];
  } | null,
) =>
  ({
    crew: { findUnique: () => Promise.resolve(crew) },
  }) as unknown as PrismaService;

const member = (
  firstName: string,
  lastName: string,
  slackId: string | null = null,
  preferredFirstName: string | null = null,
) => ({ firstName, lastName, slackId, preferredFirstName });

const slot = (position: string, m: Slot['member'], placeholder = null) => ({
  position,
  placeholder,
  member: m,
});

describe('who is on tonight, as Slack shows it', () => {
  const today = nyNow().dateStr;

  it('gives each seat a bold label and the person beside it', async () => {
    const text = await whosOnText(
      prismaWith({
        date: toDbDate(today),
        slots: [
          slot('CC', member('Daniel', 'Rivera', 'U012ABCDEF', 'Alex')),
          slot('DRIVER', member('Casey', 'Okonkwo')),
        ],
      }),
      today,
    );
    const lines = text.split('\n');
    expect(lines[0]).toBe('*Tonight’s crew:*');
    // A Slack ID becomes a mention; without one, the name they go by.
    expect(lines[1]).toBe('*Crew Chief:* <@U012ABCDEF>');
    expect(lines[2]).toBe('*Driver:* Casey Okonkwo');
  });

  // The old format. Worth pinning: two things post this text, and a stray
  // bullet returning in one of them is exactly the sort of drift nobody
  // notices until it is in the channel.
  it('no longer bullets anything', async () => {
    const text = await whosOnText(
      prismaWith({
        date: toDbDate(today),
        slots: [slot('CC', member('Casey', 'Okonkwo'))],
      }),
      today,
    );
    expect(text).not.toContain('•');
  });

  it('shows an empty seat as open rather than leaving it out', async () => {
    const text = await whosOnText(
      prismaWith({ date: toDbDate(today), slots: [] }),
      today,
    );
    expect(text).toContain('*Crew Chief:* _open_');
    expect(text).toContain('*Duty Supervisor:* _open_');
  });

  it('shows a placeholder as written', async () => {
    const text = await whosOnText(
      prismaWith({
        date: toDbDate(today),
        slots: [slot('DRIVER', null, 'CLOSED' as never)],
      }),
      today,
    );
    expect(text).toContain('*Driver:* CLOSED');
  });

  // A night out of service still has somebody carrying the phone.
  it('keeps the duty supervisor when the agency is shut down', async () => {
    const text = await whosOnText(
      prismaWith({
        date: toDbDate(today),
        outOfService: true,
        outOfServiceReason: 'Weather',
        slots: [
          slot('CC', member('Casey', 'Okonkwo')),
          slot('DUTY_SUP', member('Morgan', 'Ellis', 'U099ZZZZZZ')),
        ],
      }),
      today,
    );
    expect(text).toContain('*Out of service* — Weather');
    expect(text).toContain('*Duty Supervisor:* <@U099ZZZZZZ>');
    expect(text).not.toContain('Crew Chief');
  });

  it('says so when there is no crew at all', async () => {
    expect(await whosOnText(prismaWith(null), today)).toBe(
      `No crew is scheduled for ${today}.`,
    );
  });
});
