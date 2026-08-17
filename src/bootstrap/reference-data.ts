/**
 * Reference data the application cannot function without: the credential
 * ladder, scheduling knobs, event kinds/tiers, starter certification types,
 * and the seed roles.
 *
 * This runs on every boot (see BootstrapService) rather than only from
 * `prisma/seed.ts`. The production image runs `prisma migrate deploy` and
 * nothing else, so a deployed environment that never had the seed run by hand
 * came up with an empty credential ladder — which silently empties the
 * credential dropdowns, makes crew eligibility unanswerable, and causes the
 * legacy import to skip every credential and certification it can't map.
 *
 * Everything here is create-if-missing. Values an administrator can edit in
 * the app are never overwritten — in particular, permissions are only attached
 * to a role at the moment that role is created, so removing one in the console
 * does not come back on the next restart.
 */
import type { PrismaClient } from '../generated/prisma/client';
import { GrantMethod } from '../generated/prisma/enums';

export const CREDENTIALS: Array<{
  key: string;
  name: string;
  requires: string[];
  grantMethod?: GrantMethod;
  isAddOn?: boolean;
  outranksAll?: boolean;
}> = [
  { key: 'O', name: 'Observer', requires: [] },
  { key: 'A', name: 'Attendant', requires: ['O'] },
  // Driver track
  {
    key: 'A_D',
    name: 'Attendant Cleared for Calls as Driver',
    requires: ['A'],
  },
  { key: 'P_D', name: 'Probationary Driver', requires: ['A_D'] },
  { key: 'D', name: 'Driver', requires: ['P_D'] },
  { key: 'D_T', name: 'Driver Trainer', requires: ['D'] },
  // Crew chief track
  {
    key: 'A_CC',
    name: 'Attendant Cleared for Calls as Crew Chief',
    requires: ['A'],
  },
  { key: 'P_CC', name: 'Probationary Crew Chief', requires: ['A_CC'] },
  { key: 'CC', name: 'Crew Chief', requires: ['P_CC'] },
  { key: 'CC_T', name: 'Crew Chief Trainer', requires: ['CC'] },
  // CC add-ons
  {
    key: 'FR_CC',
    name: 'First Response Crew Chief',
    requires: ['CC'],
    isAddOn: true,
  },
  { key: 'EES', name: 'Event EMS Supervisor', requires: ['CC'], isAddOn: true },
  // Captain appointment (SDS = a DS with title "Senior Duty Supervisor")
  {
    key: 'DS',
    name: 'Duty Supervisor',
    requires: ['CC_T', 'D_T', 'EES'],
    grantMethod: GrantMethod.APPOINTMENT,
    // A DS may take any position in any event or crew.
    outranksAll: true,
  },
];

export const SCHEDULING_SETTINGS: Record<string, unknown> = {
  minAgeYears: 18,
  publicWeeks: 2,
  riderSignupOpen: { weekday: 0, time: '16:00' }, // Sunday 1600
  rotationWeeks: 2,
  dayOfUnlockTime: '12:00',
  probationaryRequiresTrainer: true,
  dropDeadline: { daysBefore: 2, time: '18:00' },
};

export const EVENT_KINDS = ['Game', 'Detail', 'Meeting', 'Social'];

// Placeholder tiers — rename/extend in the admin settings UI.
export const EVENT_TIERS = [
  { name: 'Tier 1 — Basic standby', description: 'Single BLS crew on standby' },
  {
    name: 'Tier 2 — Enhanced coverage',
    description: 'Multiple crews or extended duration',
  },
  {
    name: 'Tier 3 — Special event',
    description: 'Large event; supervisor + multiple crews',
  },
];

export const CERT_TYPES = [
  {
    name: 'CPR — BLS Provider',
    abbreviation: 'CPR',
    issuingOrg: 'AHA',
    defaultValidityMonths: 24,
  },
  {
    name: 'NYS Certified First Responder',
    abbreviation: 'CFR',
    issuingOrg: 'NYS DOH',
    defaultValidityMonths: 36,
  },
  {
    name: 'NYS EMT',
    abbreviation: 'EMT',
    issuingOrg: 'NYS DOH',
    defaultValidityMonths: 36,
  },
  {
    name: 'NYS AEMT',
    abbreviation: 'AEMT',
    issuingOrg: 'NYS DOH',
    defaultValidityMonths: 36,
  },
  {
    name: 'NYS Paramedic',
    abbreviation: 'Paramedic',
    issuingOrg: 'NYS DOH',
    defaultValidityMonths: 36,
  },
  {
    name: "Driver's License",
    abbreviation: 'DL',
    issuingOrg: null,
    defaultValidityMonths: 96,
  },
  {
    name: 'CEVO',
    abbreviation: 'CEVO',
    issuingOrg: 'Coaching Systems',
    defaultValidityMonths: null,
  },
  {
    name: 'NIMS ICS-100',
    abbreviation: 'NIMS 100',
    issuingOrg: 'FEMA',
    defaultValidityMonths: null,
  },
  {
    name: 'NIMS ICS-200',
    abbreviation: 'NIMS 200',
    issuingOrg: 'FEMA',
    defaultValidityMonths: null,
  },
  {
    name: 'NIMS IS-700',
    abbreviation: 'NIMS 700',
    issuingOrg: 'FEMA',
    defaultValidityMonths: null,
  },
  {
    name: 'NIMS IS-800',
    abbreviation: 'NIMS 800',
    issuingOrg: 'FEMA',
    defaultValidityMonths: null,
  },
];

/**
 * Which certifications outrank which. Holding the higher one satisfies a
 * requirement for anything beneath it, so a Paramedic answers a requirement
 * for EMT. Only the direct step is listed; the rest follows transitively.
 */
export const CERT_HIERARCHY: Array<{ higher: string; supersedes: string[] }> = [
  { higher: 'NYS EMT', supersedes: ['NYS Certified First Responder'] },
  { higher: 'NYS AEMT', supersedes: ['NYS EMT'] },
  { higher: 'NYS Paramedic', supersedes: ['NYS AEMT'] },
];

// Seed roles (spec §10). Permission keys must match src/permissions/catalog.ts.
const ALL = [
  'members:read',
  'members:write',
  'members:deactivate',
  'roles:manage',
  'settings:write',
  'certs:read-all',
  'certs:verify',
  'credentials:grant',
  'credentials:appoint',
  'evals:write',
  'evals:manage-forms',
  'evals:read-all',
  'evals:delete-draft',
  'evals:delete-completed',
  'promotions:review',
  'promotions:vote',
  'promotions:captain-approve',
  'promotions:adjust-requirements',
  'trainings:manage',
  'schedule:crews:assign',
  'schedule:crews:duty-sup',
  'schedule:crews:manage-defaults',
  'schedule:settings',
  'events:create',
  'events:assign-others',
  'events:lock',
  'events:approve',
  'events:decline',
  'fuel:write',
  'radios:manage',
  'vehicles:manage',
  'tokens:manage',
  'dispatches:ingest',
  'dispatches:read',
  'audit:read',
  'integrations:manage',
  'system:migrate-legacy',
];

export const ROLES: Array<{
  name: string;
  isOfficer: boolean;
  permissions: string[];
}> = [
  { name: 'Admin', isOfficer: false, permissions: ALL },
  {
    name: 'Captain',
    isOfficer: true,
    permissions: [
      'members:read',
      'members:write',
      'certs:read-all',
      'credentials:grant',
      'credentials:appoint',
      'evals:read-all',
      'promotions:review',
      'promotions:captain-approve',
      'promotions:adjust-requirements',
      'schedule:crews:assign',
      'events:create',
      'events:assign-others',
      'events:lock',
      'events:approve',
      'audit:read',
    ],
  },
  {
    name: 'Training Committee',
    isOfficer: false,
    permissions: [
      'members:read',
      'certs:read-all',
      'certs:verify',
      'evals:write',
      'evals:manage-forms',
      'evals:read-all',
      'evals:delete-draft',
      'promotions:review',
      'promotions:vote',
      'trainings:manage',
    ],
  },
  {
    name: 'Scheduling Coordinator',
    isOfficer: true,
    permissions: [
      'members:read',
      'schedule:crews:assign',
      'schedule:crews:manage-defaults',
      'schedule:settings',
      'events:create',
      'events:assign-others',
      'events:lock',
    ],
  },
  {
    name: 'Duty Supervisor Coordinator',
    isOfficer: false,
    permissions: ['members:read', 'schedule:crews:assign'],
  },
  {
    name: 'Officer',
    isOfficer: true,
    permissions: ['members:read', 'certs:read-all'],
  },
];

/**
 * Reference data the seeder knows how to provision, as ledger keys. Anything
 * recorded in SeededReference has been provisioned once and is never created
 * again — which is the whole point: a certification type deleted in the
 * console must not come back on the next deployment.
 */
type Ledger = Set<string>;

const ledgerKey = (kind: string, key: string) => `${kind}\u0000${key}`;

/** Every key this seeder would provision, for the one-time adoption pass. */
function allKnownKeys(): Array<{ kind: string; key: string }> {
  const keys: Array<{ kind: string; key: string }> = [
    { kind: 'observers', key: 'backfill' },
  ];
  for (const cred of CREDENTIALS) {
    keys.push({ kind: 'credential', key: cred.key });
    for (const requires of cred.requires) {
      keys.push({
        kind: 'credential-prerequisite',
        key: `${cred.key}>${requires}`,
      });
    }
  }
  for (const key of Object.keys(SCHEDULING_SETTINGS)) {
    keys.push({ kind: 'setting', key });
  }
  for (const name of EVENT_KINDS) keys.push({ kind: 'event-kind', key: name });
  for (const tier of EVENT_TIERS)
    keys.push({ kind: 'event-tier', key: tier.name });
  for (const cert of CERT_TYPES)
    keys.push({ kind: 'certification', key: cert.name });
  for (const step of CERT_HIERARCHY) {
    for (const lower of step.supersedes) {
      keys.push({
        kind: 'cert-supersession',
        key: `${step.higher}>${lower}`,
      });
    }
  }
  for (const role of ROLES) keys.push({ kind: 'role', key: role.name });
  return keys;
}

/**
 * Marks everything as already provisioned, without creating any of it.
 *
 * Run once against a database that predates the ledger. Without this the
 * first boot after the ledger ships would look at an empty ledger, conclude
 * nothing had ever been seeded, and restore every row an administrator had
 * deleted — the exact bug the ledger exists to fix.
 */
async function adoptExisting(prisma: PrismaClient, log: (m: string) => void) {
  const keys = allKnownKeys();
  await prisma.seededReference.createMany({
    data: keys.map(({ kind, key }) => ({ kind, key })),
    skipDuplicates: true,
  });
  log(
    `Reference data: adopted ${keys.length} existing entries. ` +
      'Nothing was created; deletions from here on are permanent.',
  );
}

/**
 * Creates reference data that has never been created before.
 *
 * Safe to call on every boot, and — unlike create-if-missing — safe to delete
 * from afterwards. The ledger records what has been provisioned rather than
 * inspecting what currently exists, so removing a certification type, an
 * event kind or a role in the console is respected instead of being undone by
 * the next deployment. Reference data added to these lists later still gets
 * created, because it has no ledger entry yet.
 *
 * Set REFERENCE_DATA_SEED=off to disable it outright.
 */
export async function ensureReferenceData(
  prisma: PrismaClient,
  log: (message: string) => void = () => {},
): Promise<void> {
  if (process.env.REFERENCE_DATA_SEED === 'off') {
    log('Reference data seeding is off (REFERENCE_DATA_SEED=off).');
    return;
  }

  const existing = await prisma.seededReference.findMany();
  if (existing.length === 0) {
    // An established database that predates the ledger: adopt, never create.
    const provisioned = await prisma.credentialType.count();
    if (provisioned > 0) {
      await adoptExisting(prisma, log);
      return;
    }
  }

  const ledger: Ledger = new Set(
    existing.map((row) => ledgerKey(row.kind, row.key)),
  );
  const created: string[] = [];
  const record: Array<{ kind: string; key: string }> = [];

  /** Runs `create` only if this key has never been provisioned. */
  const once = async (
    kind: string,
    key: string,
    label: string,
    create: () => Promise<void>,
  ) => {
    if (ledger.has(ledgerKey(kind, key))) return;
    await create();
    record.push({ kind, key });
    created.push(label);
  };

  // Credential ladder
  for (const cred of CREDENTIALS) {
    await once('credential', cred.key, `credential ${cred.key}`, async () => {
      await prisma.credentialType.upsert({
        where: { key: cred.key },
        create: {
          key: cred.key,
          name: cred.name,
          grantMethod: cred.grantMethod ?? GrantMethod.PROMOTION,
          isAddOn: cred.isAddOn ?? false,
          outranksAll: cred.outranksAll ?? false,
        },
        update: {},
      });
    });
  }
  // outranksAll is code-owned rather than administrator-editable, so it is
  // kept in step on rows that are still there. It never revives a deleted one.
  for (const cred of CREDENTIALS) {
    const existingType = await prisma.credentialType.findUnique({
      where: { key: cred.key },
    });
    if (!existingType) continue;
    if (existingType.outranksAll !== (cred.outranksAll ?? false)) {
      await prisma.credentialType.update({
        where: { id: existingType.id },
        data: { outranksAll: cred.outranksAll ?? false },
      });
      created.push(`credential ${cred.key} (outranksAll)`);
    }
  }
  for (const cred of CREDENTIALS) {
    const type = await prisma.credentialType.findUnique({
      where: { key: cred.key },
    });
    if (!type) continue;
    for (const requiredKey of cred.requires) {
      await once(
        'credential-prerequisite',
        `${cred.key}>${requiredKey}`,
        `${cred.key} requires ${requiredKey}`,
        async () => {
          const required = await prisma.credentialType.findUnique({
            where: { key: requiredKey },
          });
          if (!required) return;
          await prisma.credentialPrerequisite.upsert({
            where: {
              credentialTypeId_requiresTypeId: {
                credentialTypeId: type.id,
                requiresTypeId: required.id,
              },
            },
            create: { credentialTypeId: type.id, requiresTypeId: required.id },
            update: {},
          });
        },
      );
    }
  }

  for (const [key, value] of Object.entries(SCHEDULING_SETTINGS)) {
    await once('setting', key, `setting ${key}`, async () => {
      await prisma.schedulingSetting.upsert({
        where: { key },
        create: { key, value: value as object },
        update: {},
      });
    });
  }

  for (const name of EVENT_KINDS) {
    await once('event-kind', name, `event kind ${name}`, async () => {
      await prisma.eventKind.upsert({
        where: { name },
        create: { name },
        update: {},
      });
    });
  }

  for (const tier of EVENT_TIERS) {
    await once('event-tier', tier.name, `event tier ${tier.name}`, async () => {
      await prisma.eventTier.upsert({
        where: { name: tier.name },
        create: tier,
        update: {},
      });
    });
  }

  for (const cert of CERT_TYPES) {
    await once(
      'certification',
      cert.name,
      `certification ${cert.abbreviation}`,
      async () => {
        await prisma.certificationType.upsert({
          where: { name: cert.name },
          create: cert,
          update: {},
        });
      },
    );
  }

  for (const step of CERT_HIERARCHY) {
    for (const lowerName of step.supersedes) {
      await once(
        'cert-supersession',
        `${step.higher}>${lowerName}`,
        `${step.higher} supersedes ${lowerName}`,
        async () => {
          const higher = await prisma.certificationType.findUnique({
            where: { name: step.higher },
          });
          const lower = await prisma.certificationType.findUnique({
            where: { name: lowerName },
          });
          if (!higher || !lower) return;
          await prisma.certificationSupersession.upsert({
            where: {
              higherTypeId_lowerTypeId: {
                higherTypeId: higher.id,
                lowerTypeId: lower.id,
              },
            },
            create: { higherTypeId: higher.id, lowerTypeId: lower.id },
            update: {},
          });
        },
      );
    }
  }

  for (const role of ROLES) {
    await once('role', role.name, `role ${role.name}`, async () => {
      const existingRole = await prisma.role.findUnique({
        where: { name: role.name },
      });
      if (existingRole) return;
      await prisma.role.create({
        data: {
          name: role.name,
          isOfficer: role.isOfficer,
          permissions: {
            create: role.permissions.map((permission) => ({ permission })),
          },
        },
      });
    });
  }

  if (record.length) {
    await prisma.seededReference.createMany({
      data: record,
      skipDuplicates: true,
    });
  }
  if (created.length) {
    log(`Reference data created: ${created.join(', ')}`);
  }
}

/** True once the Observer backfill has been run; it must never run twice. */
export async function observerBackfillDone(
  prisma: PrismaClient,
): Promise<boolean> {
  const row = await prisma.seededReference.findUnique({
    where: { kind_key: { kind: 'observers', key: 'backfill' } },
  });
  return !!row;
}

export async function markObserverBackfillDone(
  prisma: PrismaClient,
): Promise<void> {
  await prisma.seededReference.createMany({
    data: [{ kind: 'observers', key: 'backfill' }],
    skipDuplicates: true,
  });
}
