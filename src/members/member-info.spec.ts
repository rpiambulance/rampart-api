import type { PrismaService } from '../prisma/prisma.service';
import { memberInfoReply } from './member-info';

interface Row {
  firstName: string;
  preferredFirstName: string | null;
  lastName: string;
  email: string | null;
  cellPhone: string | null;
  credentials: Array<{ type: { key: string; name: string } }>;
}

const person = (over: Partial<Row> = {}): Row => ({
  firstName: 'Daniel',
  preferredFirstName: 'Dan',
  lastName: 'Rivera',
  email: 'rivera@example.edu',
  cellPhone: '518-555-0100',
  credentials: [
    { type: { key: 'CC', name: 'Crew Chief' } },
    { type: { key: 'D_T', name: 'Driver Trainer' } },
  ],
  ...over,
});

/** Just enough Prisma for the one query this makes. */
const prismaWith = (rows: Row[]) =>
  ({
    member: { findMany: () => Promise.resolve(rows) },
  }) as unknown as PrismaService;

describe('looking a member up from Slack', () => {
  it('gives the name somebody goes by, the email and the credentials', async () => {
    const reply = await memberInfoReply(prismaWith([person()]), 'rivera', {
      withPhones: false,
    });
    expect(reply).toContain('*Dan Rivera*');
    expect(reply).toContain('rivera@example.edu');
    // Written the way they are said, not the way they are keyed.
    expect(reply).toContain('Credentials: CC, D-T');
  });

  it('keeps the cell to itself', async () => {
    const reply = await memberInfoReply(prismaWith([person()]), 'rivera', {
      withPhones: false,
    });
    expect(reply).not.toContain('518-555-0100');
    expect(reply).not.toContain('Cell');
  });

  it('gives it to whoever runs the workspace', async () => {
    const reply = await memberInfoReply(prismaWith([person()]), 'rivera', {
      withPhones: true,
    });
    expect(reply).toContain('Cell: 518-555-0100');
  });

  it('says so when there is no cell on file', async () => {
    const reply = await memberInfoReply(
      prismaWith([person({ cellPhone: null })]),
      'rivera',
      { withPhones: true },
    );
    expect(reply).toContain('No cell on file.');
  });

  // A surname half the roster shares is a search, not an answer.
  it('names the matches rather than picking one', async () => {
    const reply = await memberInfoReply(
      prismaWith([
        person({ firstName: 'Ann', preferredFirstName: null }),
        person({ firstName: 'Bo', preferredFirstName: null }),
      ]),
      'rivera',
      { withPhones: true },
    );
    expect(reply).toContain('2 people match');
    expect(reply).toContain('Ann Rivera');
    expect(reply).toContain('Bo Rivera');
    // And no number is handed out for a person nobody has picked yet.
    expect(reply).not.toContain('518-555-0100');
  });

  it('asks for more of the name when the list is long', async () => {
    const many = Array.from({ length: 7 }, (_, i) =>
      person({ firstName: `Person${i}`, preferredFirstName: null }),
    );
    expect(
      await memberInfoReply(prismaWith(many), 'a', { withPhones: false }),
    ).toContain('Try more of the name');
  });

  it('says when nobody matches, and when nothing was asked', async () => {
    expect(
      await memberInfoReply(prismaWith([]), 'nobody', { withPhones: false }),
    ).toContain('Nobody active');
    expect(
      await memberInfoReply(prismaWith([person()]), '   ', {
        withPhones: false,
      }),
    ).toContain('/memberinfo');
  });
});
