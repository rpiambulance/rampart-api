import { nyNow, toDbDate } from '../common/dates';
import type { PrismaService } from '../prisma/prisma.service';
import { nightsFor, whosOnDate, whosOnReply, whosOnText } from './whoson';

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

describe('what night /whoson was asked about', () => {
  const TODAY = '2026-09-03';

  it('means tonight when nothing is said', () => {
    expect(whosOnDate('', TODAY)).toBe(TODAY);
    expect(whosOnDate('   ', TODAY)).toBe(TODAY);
    expect(whosOnDate('today', TODAY)).toBe(TODAY);
    expect(whosOnDate('tonight', TODAY)).toBe(TODAY);
  });

  it('understands yesterday, spelt out or not', () => {
    expect(whosOnDate('yesterday', TODAY)).toBe('2026-09-02');
    expect(whosOnDate('yest', TODAY)).toBe('2026-09-02');
  });

  // Somebody types this one-handed, mid-shift.
  it('does not mind capitals or stray spaces', () => {
    expect(whosOnDate('  YEST ', TODAY)).toBe('2026-09-02');
    expect(whosOnDate('Yesterday', TODAY)).toBe('2026-09-02');
  });

  it('still understands tomorrow and a plain date', () => {
    expect(whosOnDate('tomorrow', TODAY)).toBe('2026-09-04');
    expect(whosOnDate('2026-08-19', TODAY)).toBe('2026-08-19');
  });

  // Across a month boundary, where adding and subtracting days is easiest to
  // get wrong.
  it('steps back over the end of a month', () => {
    expect(whosOnDate('yest', '2026-09-01')).toBe('2026-08-31');
    expect(whosOnDate('yest', '2026-03-01')).toBe('2026-02-28');
  });

  it('says nothing rather than guessing at what it cannot read', () => {
    expect(whosOnDate('last thursday', TODAY)).toBeNull();
    expect(whosOnDate('19-08-2026', TODAY)).toBeNull();
    expect(whosOnDate('yesterdayish', TODAY)).toBeNull();
  });
});

describe('which night /whoson means at the hour it is asked', () => {
  // A New York wall-clock time, whatever the machine running this thinks.
  const at = (nyTime: string) => new Date(`2026-09-03T${nyTime}:00-04:00`);
  const dates = (nights: ReturnType<typeof nightsFor>) =>
    nights?.map((night) => night.date);

  // A crew that came on last night is still in the building at two in the
  // morning. Answering with the night ahead would name five people who are
  // asleep.
  it('gives the crew still on duty through the small hours', () => {
    expect(dates(nightsFor('', at('00:01')))).toEqual(['2026-09-02']);
    expect(dates(nightsFor('', at('03:00')))).toEqual(['2026-09-02']);
    expect(dates(nightsFor('', at('05:59')))).toEqual(['2026-09-02']);
  });

  it('still calls that crew tonight, because it is', () => {
    expect(nightsFor('', at('03:00'))?.[0].label).toBe('*Tonight’s crew:*');
  });

  it('gives both across the handover', () => {
    expect(dates(nightsFor('', at('06:00')))).toEqual([
      '2026-09-02',
      '2026-09-03',
    ]);
    expect(dates(nightsFor('', at('08:59')))).toEqual([
      '2026-09-02',
      '2026-09-03',
    ]);
    expect(nightsFor('', at('07:00'))?.map((n) => n.label)).toEqual([
      '*Last night’s crew:*',
      '*Tonight’s crew:*',
    ]);
  });

  it('gives the night ahead once the morning is over', () => {
    expect(dates(nightsFor('', at('09:00')))).toEqual(['2026-09-03']);
    expect(dates(nightsFor('', at('14:00')))).toEqual(['2026-09-03']);
    expect(dates(nightsFor('', at('23:59')))).toEqual(['2026-09-03']);
  });

  it('treats "tonight" and "today" as having asked for nothing in particular', () => {
    expect(dates(nightsFor('tonight', at('03:00')))).toEqual(['2026-09-02']);
    expect(dates(nightsFor('today', at('07:00')))).toEqual([
      '2026-09-02',
      '2026-09-03',
    ]);
  });

  // Somebody who named a night has said which they mean; overriding them
  // would be answering a question they did not ask.
  it('gives one night to anybody who named one, at any hour', () => {
    expect(dates(nightsFor('yest', at('03:00')))).toEqual(['2026-09-02']);
    expect(dates(nightsFor('tomorrow', at('03:00')))).toEqual(['2026-09-04']);
    expect(dates(nightsFor('2026-08-19', at('07:00')))).toEqual(['2026-08-19']);
    // ...and lets the date decide what to call it.
    expect(nightsFor('2026-08-19', at('07:00'))?.[0].label).toBeUndefined();
  });

  it('still refuses what it cannot read', () => {
    expect(nightsFor('last thursday', at('07:00'))).toBeNull();
  });

  it('labels the two nights by what they are, not by their dates', async () => {
    const crewFor = (date: string) => ({
      date: toDbDate(date),
      slots: [
        {
          position: 'CC',
          placeholder: null,
          member: {
            firstName: date === '2026-09-02' ? 'Casey' : 'Morgan',
            preferredFirstName: null,
            lastName: 'Okonkwo',
            slackId: null,
          },
        },
      ],
    });
    const prisma = {
      crew: {
        findUnique: ({ where }: { where: { date: Date } }) =>
          Promise.resolve(crewFor(where.date.toISOString().slice(0, 10))),
      },
    } as unknown as PrismaService;

    const text = await whosOnReply(prisma, '', at('07:00'));
    expect(text).toContain('*Last night’s crew:*');
    expect(text).toContain('*Tonight’s crew:*');
    // Last night first, so it reads in the order the nights happened.
    expect(text!.indexOf('*Last night’s crew:*')).toBeLessThan(
      text!.indexOf('*Tonight’s crew:*'),
    );
    expect(text).toContain('Casey Okonkwo');
    expect(text).toContain('Morgan Okonkwo');
  });
});

describe('which night counts as tonight', () => {
  const at = (nyTime: string) => new Date(`2026-09-03T${nyTime}:00-04:00`);
  const prismaFor = (date: string) =>
    ({
      crew: {
        findUnique: () =>
          Promise.resolve({
            date: toDbDate(date),
            slots: [],
          }),
      },
    }) as unknown as PrismaService;

  // The heading has to follow the same clock the night was chosen by, or a
  // caller that injects a time gets one answer's dates and another's words.
  it('calls the injected day tonight, not whatever day the machine is on', async () => {
    const text = await whosOnText(prismaFor('2026-09-03'), '2026-09-03', {
      now: at('14:00'),
    });
    expect(text.split('\n')[0]).toBe('*Tonight’s crew:*');
  });

  it('names any other night by its date', async () => {
    const text = await whosOnText(prismaFor('2026-08-19'), '2026-08-19', {
      now: at('14:00'),
    });
    expect(text.split('\n')[0]).toBe('*Crew for 2026-08-19:*');
  });
});
