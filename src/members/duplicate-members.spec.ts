import { ConflictException } from '@nestjs/common';
import { MembersService } from './members.service';

/**
 * The two ways somebody being added is already on the roster.
 *
 * An address is the one that cannot be argued with — it is unique, and it is
 * what a login is matched on, so two records sharing one means one of them
 * can never be signed into. A name is a question: agencies do get two Chris
 * Reillys.
 */
function serviceWith(existing: {
  byEmail?: {
    id: number;
    firstName: string;
    lastName: string;
    active: boolean;
  } | null;
  byName?: Array<{ id: number; firstName: string; lastName: string }>;
}) {
  const created: Array<Record<string, unknown>> = [];
  const prisma = {
    member: {
      findFirst: () => Promise.resolve(existing.byEmail ?? null),
      findMany: () => Promise.resolve(existing.byName ?? []),
      create: ({ data }: { data: Record<string, unknown> }) => {
        created.push(data);
        return Promise.resolve({ id: 1, ...data });
      },
    },
    memberCredential: { findUnique: () => Promise.resolve(null) },
    credentialType: { findUnique: () => Promise.resolve(null) },
  };
  const service = new MembersService(
    prisma as never,
    { log: () => Promise.resolve() } as never,
    { provisionUser: () => Promise.resolve('kc-1') } as never,
    { emit: () => Promise.resolve() } as never,
  );
  return { service, created };
}

const auth = { kind: 'member', memberId: 1, permissions: new Set() } as never;
const casey = {
  firstName: 'Casey',
  lastName: 'Reilly',
  email: 'casey@x.test',
  dob: '2004-05-01',
};

/** The body of a ConflictException, which carries the code and the match. */
const bodyOf = async (run: Promise<unknown>) => {
  try {
    await run;
    return null;
  } catch (error) {
    if (!(error instanceof ConflictException)) throw error;
    return error.getResponse() as { code: string; message: string };
  }
};

describe('adding somebody already on the roster', () => {
  it('adds a genuinely new person', async () => {
    const { service, created } = serviceWith({});
    await service.create(auth, casey);
    expect(created).toHaveLength(1);
  });

  it('refuses an address that already belongs to somebody', async () => {
    const { service, created } = serviceWith({
      byEmail: { id: 7, firstName: 'Casey', lastName: 'Reilly', active: true },
    });
    const body = await bodyOf(service.create(auth, casey));
    expect(body?.code).toBe('DUPLICATE_EMAIL');
    expect(body?.message).toContain('Casey Reilly');
    expect(created).toEqual([]);
  });

  it('cannot be confirmed past when the address clashes', async () => {
    // The whole point of the distinction: a name is a question, an address
    // is not, and the confirmation must not answer both.
    const { service, created } = serviceWith({
      byEmail: { id: 7, firstName: 'Casey', lastName: 'Reilly', active: true },
    });
    const body = await bodyOf(
      service.create(auth, { ...casey, confirmDuplicateName: true }),
    );
    expect(body?.code).toBe('DUPLICATE_EMAIL');
    expect(created).toEqual([]);
  });

  it('says so when the clashing record is inactive', async () => {
    // Otherwise the address is taken by somebody invisible on the roster,
    // and the message reads as nonsense.
    const { service } = serviceWith({
      byEmail: { id: 7, firstName: 'Casey', lastName: 'Reilly', active: false },
    });
    const body = await bodyOf(service.create(auth, casey));
    expect(body?.message).toMatch(/inactive/);
  });

  it('asks about a matching name rather than refusing it', async () => {
    const { service, created } = serviceWith({
      byName: [{ id: 7, firstName: 'Casey', lastName: 'Reilly' }],
    });
    const body = await bodyOf(service.create(auth, casey));
    expect(body?.code).toBe('DUPLICATE_NAME');
    expect(created).toEqual([]);
  });

  it('adds them once the name has been confirmed', async () => {
    const { service, created } = serviceWith({
      byName: [{ id: 7, firstName: 'Casey', lastName: 'Reilly' }],
    });
    await service.create(auth, { ...casey, confirmDuplicateName: true });
    expect(created).toHaveLength(1);
  });

  it('does not try to store the confirmation as a member field', async () => {
    // It is an answer to a question this method asked, not a column. Spread
    // into the create it takes the whole insert down — and only on the
    // confirmed path, which is the one the feature exists for.
    const { service, created } = serviceWith({
      byName: [{ id: 7, firstName: 'Casey', lastName: 'Reilly' }],
    });
    await service.create(auth, { ...casey, confirmDuplicateName: true });
    expect(created[0]).not.toHaveProperty('confirmDuplicateName');
  });
});
