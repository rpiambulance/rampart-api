/**
 * CLI wrapper for the legacy MySQL -> Postgres ETL. Identical logic to the
 * admin-triggered endpoint (POST /v1/admin/legacy-migration).
 *
 *   LEGACY_MYSQL_URL=mysql://user:pass@host:3306/ambulanc_web \
 *     npx tsx scripts/migrate-legacy.ts
 */
import 'dotenv/config';
import * as readline from 'node:readline/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { runLegacyMigration } from '../src/legacy/legacy-migration';
import type {
  ConflictResolution,
  MigrationConflict,
} from '../src/legacy/conflicts';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/**
 * The legacy data violates uniqueness constraints that Postgres enforces.
 * Ask rather than guess — the same questions the admin console asks.
 */
async function promptForConflict(
  conflict: MigrationConflict,
): Promise<ConflictResolution> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log(`\n! ${conflict.label} conflicts on ${conflict.fields.join(', ')}`);
    for (const [field, value] of Object.entries(conflict.values)) {
      console.log(`    ${field}: ${value || '(blank)'}`);
    }
    if (conflict.existing) {
      console.log(`  already used by #${conflict.existing.id} ${conflict.existing.summary}`);
    }
    conflict.options.forEach((option, i) => {
      console.log(`  [${i + 1}] ${option.label} — ${option.description}`);
    });
    for (;;) {
      const answer = (await rl.question('  Choose: ')).trim();
      const option = conflict.options[Number(answer) - 1];
      if (!option) {
        console.log(`  Enter 1-${conflict.options.length}.`);
        continue;
      }
      if (option.action !== 'replace') return { action: option.action };
      const value = await rl.question(
        `  New value${option.suggestion ? ` [${option.suggestion}]` : ''}: `,
      );
      return { action: 'replace', value: value.trim() || option.suggestion };
    }
  } finally {
    rl.close();
  }
}

async function main() {
  const mysqlUrl = process.env.LEGACY_MYSQL_URL;
  if (!mysqlUrl) {
    throw new Error('Set LEGACY_MYSQL_URL (mysql://user:pass@host:3306/ambulanc_web)');
  }
  await runLegacyMigration(
    prisma,
    mysqlUrl,
    (m) => console.log(m),
    promptForConflict,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
