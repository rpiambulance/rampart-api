import type { PrismaClient } from '../generated/prisma/client';

/** Every member is an Observer at minimum — it is the floor of the ladder. */
export const OBSERVER_KEY = 'O';

type Db = Pick<PrismaClient, 'credentialType' | 'member' | 'memberCredential'>;

/**
 * Gives a member the Observer credential unless they already have an Observer
 * record of any kind. A revocation leaves a REVOKED row behind, so checking
 * for the row rather than for an active one means a deliberate revocation is
 * never quietly undone.
 *
 * Silently does nothing if the ladder has not been seeded yet; the boot-time
 * backfill picks the member up once it has.
 */
export async function grantObserver(db: Db, memberId: number): Promise<void> {
  const type = await db.credentialType.findUnique({
    where: { key: OBSERVER_KEY },
  });
  if (!type) return;
  const existing = await db.memberCredential.findUnique({
    where: { memberId_typeId: { memberId, typeId: type.id } },
  });
  if (existing) return;
  await db.memberCredential.create({
    data: { memberId, typeId: type.id },
  });
}

/**
 * Brings existing members up to the floor. Runs on boot: members predating
 * the rule, and anyone the legacy import brought in without the flag, would
 * otherwise sit below a minimum everything else assumes.
 */
export async function backfillObservers(
  db: Db,
  log: (message: string) => void = () => {},
): Promise<void> {
  const type = await db.credentialType.findUnique({
    where: { key: OBSERVER_KEY },
  });
  if (!type) return;

  const missing = await db.member.findMany({
    where: { credentials: { none: { typeId: type.id } } },
    select: { id: true },
  });
  if (!missing.length) return;

  await db.memberCredential.createMany({
    data: missing.map((member) => ({ memberId: member.id, typeId: type.id })),
    skipDuplicates: true,
  });
  log(`Granted Observer to ${missing.length} member(s) who lacked it.`);
}
