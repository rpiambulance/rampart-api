/**
 * Seeds reference data: the credential ladder, default scheduling settings,
 * event kinds, starter cert types, and seed roles. Idempotent (upserts).
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { ensureReferenceData } from '../src/bootstrap/reference-data';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // The single source of truth, shared with the API's boot-time check so the
  // two can never drift.
  await ensureReferenceData(prisma, (m) => console.log(m));

  // Local-dev member linked to the Keycloak user imported from
  // keycloak/realm-rampart.json (dev/dev). Never enable in production.
  if (process.env.SEED_DEV_MEMBER === 'true') {
    const dev = await prisma.member.upsert({
      where: { email: 'dev@rpiambulance.test' },
      create: {
        keycloakSubject: '11111111-1111-1111-1111-111111111111',
        firstName: 'Dev',
        lastName: 'Member',
        email: 'dev@rpiambulance.test',
        dob: new Date('1990-01-15T00:00:00Z'),
      },
      update: { keycloakSubject: '11111111-1111-1111-1111-111111111111' },
    });
    const admin = await prisma.role.findUniqueOrThrow({ where: { name: 'Admin' } });
    const hasRole = await prisma.memberRole.findFirst({
      where: { memberId: dev.id, roleId: admin.id },
    });
    if (!hasRole) {
      await prisma.memberRole.create({
        data: { memberId: dev.id, roleId: admin.id, startDate: new Date() },
      });
    }
    for (const key of ['O', 'A', 'A_CC', 'P_CC', 'CC']) {
      const type = await prisma.credentialType.findUniqueOrThrow({ where: { key } });
      await prisma.memberCredential.upsert({
        where: { memberId_typeId: { memberId: dev.id, typeId: type.id } },
        create: { memberId: dev.id, typeId: type.id },
        update: {},
      });
    }
    console.log('Dev member seeded (Keycloak login: dev / dev).');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
