/**
 * CLI wrapper for the legacy MySQL -> Postgres ETL. Identical logic to the
 * admin-triggered endpoint (POST /v1/admin/legacy-migration).
 *
 *   LEGACY_MYSQL_URL=mysql://user:pass@host:3306/ambulanc_web \
 *     npx tsx scripts/migrate-legacy.ts
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { runLegacyMigration } from '../src/legacy/legacy-migration';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const mysqlUrl = process.env.LEGACY_MYSQL_URL;
  if (!mysqlUrl) {
    throw new Error('Set LEGACY_MYSQL_URL (mysql://user:pass@host:3306/ambulanc_web)');
  }
  await runLegacyMigration(prisma, mysqlUrl, (m) => console.log(m));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
