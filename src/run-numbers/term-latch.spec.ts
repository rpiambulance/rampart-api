import { RunNumbersService } from './run-numbers.service';
import { DEFAULT_DIVISIONS, TERM_LATCH_KEY } from './divisions';

/**
 * The changeover rule, without a database in the way.
 *
 * A changeover month is open until somebody says the new term has begun.
 * Saying "still the old one" settles nothing and the next person is asked
 * again; saying "the new one" settles it for everyone after.
 */
function serviceWith(latch: unknown) {
  const settings: Record<string, unknown> = {
    [TERM_LATCH_KEY]: latch,
  };
  const prisma = {
    appSetting: {
      findUnique: ({ where }: { where: { key: string } }) =>
        Promise.resolve(
          settings[where.key] ? { value: settings[where.key] } : null,
        ),
      upsert: ({
        where,
        create,
      }: {
        where: { key: string };
        create: { value: unknown };
      }) => {
        settings[where.key] = create.value;
        return Promise.resolve(create);
      },
    },
  };
  const service = new RunNumbersService(prisma as never, {} as never);
  return { service, settings };
}

/** Noon on a given day, New York, expressed as the UTC instant. */
const at = (iso: string) => new Date(`${iso}T17:00:00.000Z`);

describe('term changeover', () => {
  it('asks in January, offering the ending term first', async () => {
    const { service } = serviceWith(null);
    const term = await service.currentTerm(at('2027-01-14'));
    expect(term.division).toBeNull();
    expect(term.options).toEqual(['F', 'S']);
    expect(term.year).toBe('27');
  });

  it('goes on asking while people say the old term still applies', async () => {
    // Choosing F in January is "this one belongs to the autumn", which
    // decides nothing about the next standby.
    const { service, settings } = serviceWith(null);
    expect(settings[TERM_LATCH_KEY]).toBeFalsy();
    const term = await service.currentTerm(at('2027-01-20'));
    expect(term.options).toEqual(['F', 'S']);
  });

  it('stops asking once somebody picks the term beginning', async () => {
    const { service } = serviceWith({ division: 'S', window: '27-0' });
    const term = await service.currentTerm(at('2027-01-20'));
    expect(term.division).toBe('S');
    expect(term.options).toBeNull();
  });

  it('ignores a latch naming the term that was ending', async () => {
    // Nothing writes this, but a hand-edited setting should not settle a
    // changeover by claiming the outgoing term.
    const { service } = serviceWith({ division: 'F', window: '27-0' });
    const term = await service.currentTerm(at('2027-01-20'));
    expect(term.options).toEqual(['F', 'S']);
  });

  it('forgets the decision at the next changeover', async () => {
    const settled = { division: 'S', window: '27-0' };
    const { service } = serviceWith(settled);
    // May is a different changeover, so it starts open again.
    const may = await service.currentTerm(at('2027-05-06'));
    expect(may.options).toEqual(['S', 'U']);
    // And so does the same month a year later.
    const nextJanuary = await service.currentTerm(at('2028-01-06'));
    expect(nextJanuary.options).toEqual(['F', 'S']);
  });

  it('settles nothing in a month that is not a changeover', async () => {
    const { service } = serviceWith(null);
    expect((await service.currentTerm(at('2027-03-02'))).division).toBe('S');
    expect((await service.currentTerm(at('2026-10-02'))).division).toBe('F');
    expect((await service.currentTerm(at('2027-06-02'))).division).toBe('U');
  });

  it('uses the configured terms', () => {
    expect(DEFAULT_DIVISIONS.ambiguous.map((w) => w.start)).toEqual([0, 4, 7]);
  });
});
