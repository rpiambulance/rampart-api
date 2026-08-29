import { ensureReferenceData } from './reference-data';
import type { PrismaClient } from '../generated/prisma/client';

/** Whatever identifies the row being written, for the assertions below. */
function label(data: Record<string, unknown>): string {
  const named = data.key ?? data.name;
  return typeof named === 'string' ? named : 'unnamed';
}

/**
 * A stand-in for the handful of Prisma calls the seeder makes, so the rule
 * that matters — reference data deleted by an administrator stays deleted —
 * can be tested without a database.
 */
function fakePrisma(opts: { credentialTypes?: number } = {}) {
  const ledger: Array<{ kind: string; key: string }> = [];
  const createdBy: Record<string, string[]> = {};

  const model = (name: string) => ({
    upsert: jest.fn(({ create }: { create: Record<string, unknown> }) => {
      // The seeder only reaches an upsert when the ledger says "never done",
      // so anything recorded here is something a deployment would create.
      (createdBy[name] ??= []).push(label(create));
      return Promise.resolve(create);
    }),
    findUnique: jest.fn(() => Promise.resolve(null)),
    update: jest.fn(() => Promise.resolve({})),
    create: jest.fn(({ data }: { data: Record<string, unknown> }) => {
      (createdBy[name] ??= []).push(label(data));
      return Promise.resolve(data);
    }),
    count: jest.fn(() => Promise.resolve(0)),
  });

  const prisma = {
    seededReference: {
      findMany: jest.fn(() =>
        Promise.resolve(ledger.map((row) => ({ ...row }))),
      ),
      findUnique: jest.fn(() => Promise.resolve(null)),
      createMany: jest.fn(
        async ({ data }: { data: Array<{ kind: string; key: string }> }) => {
          for (const row of data) {
            if (!ledger.some((e) => e.kind === row.kind && e.key === row.key)) {
              ledger.push(row);
            }
          }
          return Promise.resolve({ count: data.length });
        },
      ),
    },
    credentialType: {
      ...model('credentialType'),
      count: jest.fn(() => Promise.resolve(opts.credentialTypes ?? 0)),
    },
    credentialPrerequisite: model('credentialPrerequisite'),
    schedulingSetting: model('schedulingSetting'),
    eventKind: model('eventKind'),
    eventTier: model('eventTier'),
    certificationType: model('certificationType'),
    certificationSupersession: model('certificationSupersession'),
    role: model('role'),
    // Read by the boot-time report of permissions no role holds.
    rolePermission: model('rolePermission'),
  };

  return { prisma: prisma as unknown as PrismaClient, ledger, createdBy };
}

describe('reference data seeding', () => {
  afterEach(() => {
    delete process.env.REFERENCE_DATA_SEED;
  });

  it('provisions a fresh database and records what it did', async () => {
    const { prisma, ledger, createdBy } = fakePrisma({ credentialTypes: 0 });
    await ensureReferenceData(prisma);

    expect(createdBy.credentialType?.length).toBeGreaterThan(0);
    expect(createdBy.certificationType?.length).toBeGreaterThan(0);
    expect(createdBy.eventKind?.length).toBeGreaterThan(0);
    // Everything it created is written to the ledger, or the next boot would
    // do it all again.
    expect(ledger.some((row) => row.kind === 'certification')).toBe(true);
    expect(ledger.some((row) => row.kind === 'role')).toBe(true);
  });

  it('adopts an established database without creating anything', async () => {
    // The first boot after the ledger ships. The database already has its
    // reference data, minus whatever an administrator has deleted — and the
    // seeder cannot tell those two cases apart, so it must create nothing.
    const { prisma, ledger, createdBy } = fakePrisma({ credentialTypes: 14 });
    await ensureReferenceData(prisma);

    expect(createdBy).toEqual({});
    expect(ledger.length).toBeGreaterThan(0);
  });

  it('never re-creates something already provisioned', async () => {
    const { prisma, ledger, createdBy } = fakePrisma({ credentialTypes: 14 });
    await ensureReferenceData(prisma); // adopt
    const adopted = ledger.length;

    // Now the administrator deletes a certification type and redeploys. Every
    // lookup returns null, exactly as it would for a genuinely missing row.
    await ensureReferenceData(prisma);

    expect(createdBy).toEqual({});
    expect(ledger.length).toBe(adopted);
  });

  it('does nothing at all when switched off', async () => {
    process.env.REFERENCE_DATA_SEED = 'off';
    const { prisma, ledger, createdBy } = fakePrisma({ credentialTypes: 0 });
    await ensureReferenceData(prisma);

    expect(createdBy).toEqual({});
    expect(ledger).toEqual([]);
  });
});
