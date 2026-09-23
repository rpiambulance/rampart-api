import type { CredentialGraphService } from '../credentials/credential-graph.service';
import type { PrismaService } from '../prisma/prisma.service';
import { memberInfoReply } from './member-info';

/**
 * Enough of the ladder to show the reply asks it rather than printing what
 * it was handed: a supervisor is the whole answer, and O sits under A.
 */
const graph = {
  topmostOf: (keys: Iterable<string>) => {
    const held = [...keys];
    if (held.includes('DS')) return Promise.resolve(['DS']);
    return Promise.resolve(
      held.filter((k) => !(k === 'O' && held.includes('A'))),
    );
  },
} as unknown as CredentialGraphService;

interface Row {
  firstName: string;
  preferredFirstName: string | null;
  lastName: string;
  email: string | null;
  cellPhone: string | null;
  credentials: Array<{
    title: string | null;
    type: { key: string; name: string };
  }>;
}

const person = (over: Partial<Row> = {}): Row => ({
  firstName: 'Daniel',
  preferredFirstName: 'Dan',
  lastName: 'Rivera',
  email: 'rivera@example.edu',
  cellPhone: '518-555-0100',
  credentials: [
    { title: null, type: { key: 'CC', name: 'Crew Chief' } },
    { title: null, type: { key: 'D_T', name: 'Driver Trainer' } },
  ],
  ...over,
});

/** Just enough Prisma for the queries this makes. */
const prismaWith = (rows: Row[], tagged: Row | null = null) =>
  ({
    member: {
      findMany: () => Promise.resolve(rows),
      findFirst: () => Promise.resolve(tagged),
    },
  }) as unknown as PrismaService;

describe('looking a member up from Slack', () => {
  it('gives the name somebody goes by, the email and the credentials', async () => {
    const reply = await memberInfoReply(
      prismaWith([person()]),
      graph,
      'rivera',
      {
        withPhones: false,
      },
    );
    expect(reply).toContain('*Dan Rivera*');
    expect(reply).toContain('rivera@example.edu');
    // Written the way they are said, not the way they are keyed.
    expect(reply).toContain('Credentials: CC, D-T');
  });

  // What somebody is, not everything they have been signed off on. A
  // supervisor holding the bottom rung as well read as "DS, O".
  it('gives the top of the ladder rather than the whole of it', async () => {
    const reply = await memberInfoReply(
      prismaWith([
        person({
          credentials: [
            { title: null, type: { key: 'DS', name: 'Duty Supervisor' } },
            { title: null, type: { key: 'O', name: 'Observer' } },
          ],
        }),
      ]),
      graph,
      'rivera',
      { withPhones: false },
    );
    expect(reply).toContain('Credentials: DS');
    expect(reply).not.toContain('DS, O');
  });

  it('says a titled supervisor the way the portal does', async () => {
    const reply = await memberInfoReply(
      prismaWith([
        person({
          credentials: [
            {
              title: 'Senior Duty Supervisor',
              type: { key: 'DS', name: 'Duty Supervisor' },
            },
          ],
        }),
      ]),
      graph,
      'rivera',
      { withPhones: false },
    );
    expect(reply).toContain('Credentials: SDS');
  });

  it('keeps the cell to itself', async () => {
    const reply = await memberInfoReply(
      prismaWith([person()]),
      graph,
      'rivera',
      {
        withPhones: false,
      },
    );
    expect(reply).not.toContain('518-555-0100');
    expect(reply).not.toContain('Cell');
  });

  it('gives it to whoever runs the workspace', async () => {
    const reply = await memberInfoReply(
      prismaWith([person()]),
      graph,
      'rivera',
      {
        withPhones: true,
      },
    );
    expect(reply).toContain('Cell: 518-555-0100');
  });

  it('says so when there is no cell on file', async () => {
    const reply = await memberInfoReply(
      prismaWith([person({ cellPhone: null })]),
      graph,
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
      graph,
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
      await memberInfoReply(prismaWith(many), graph, 'a', {
        withPhones: false,
      }),
    ).toContain('Try more of the name');
  });

  // Tagging somebody is what a person does in Slack when they mean a person.
  describe('when the name is tagged rather than typed', () => {
    it('answers the account the tag names, without searching', async () => {
      const reply = await memberInfoReply(
        // Nobody would be found by searching for the raw tag.
        prismaWith([], person()),
        graph,
        '<@U024BE7LH|dan>',
        { withPhones: true },
      );
      expect(reply).toContain('*Dan Rivera*');
      expect(reply).toContain('Cell: 518-555-0100');
    });

    it('takes a tag with no display name on it', async () => {
      expect(
        await memberInfoReply(prismaWith([], person()), graph, '<@U024BE7LH>', {
          withPhones: false,
        }),
      ).toContain('*Dan Rivera*');
    });

    it('says what to do when the account is nobody here', async () => {
      const reply = await memberInfoReply(
        prismaWith([], null),
        graph,
        '<@U024BE7LH|stranger>',
        { withPhones: false },
      );
      expect(reply).toContain('<@U024BE7LH>');
      expect(reply).toContain('/linkme');
    });

    // A workspace that does not escape what it sends gives us the display
    // name that was typed, which is worth a look at the roster and no more.
    it('tries an unescaped tag as a name', async () => {
      expect(
        await memberInfoReply(prismaWith([person()]), graph, '@rivera', {
          withPhones: false,
        }),
      ).toContain('*Dan Rivera*');
    });
  });

  it('says when nobody matches, and when nothing was asked', async () => {
    expect(
      await memberInfoReply(prismaWith([]), graph, 'nobody', {
        withPhones: false,
      }),
    ).toContain('Nobody active');
    expect(
      await memberInfoReply(prismaWith([person()]), graph, '   ', {
        withPhones: false,
      }),
    ).toContain('/memberinfo');
  });
});
