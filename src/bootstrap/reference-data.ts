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
  { key: 'A_D', name: 'Attendant Cleared for Calls as Driver', requires: ['A'] },
  { key: 'P_D', name: 'Probationary Driver', requires: ['A_D'] },
  { key: 'D', name: 'Driver', requires: ['P_D'] },
  { key: 'D_T', name: 'Driver Trainer', requires: ['D'] },
  // Crew chief track
  { key: 'A_CC', name: 'Attendant Cleared for Calls as Crew Chief', requires: ['A'] },
  { key: 'P_CC', name: 'Probationary Crew Chief', requires: ['A_CC'] },
  { key: 'CC', name: 'Crew Chief', requires: ['P_CC'] },
  { key: 'CC_T', name: 'Crew Chief Trainer', requires: ['CC'] },
  // CC add-ons
  { key: 'FR_CC', name: 'First Response Crew Chief', requires: ['CC'], isAddOn: true },
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
  { name: 'Tier 2 — Enhanced coverage', description: 'Multiple crews or extended duration' },
  { name: 'Tier 3 — Special event', description: 'Large event; supervisor + multiple crews' },
];

export const CERT_TYPES = [
  { name: 'CPR — BLS Provider', abbreviation: 'CPR', issuingOrg: 'AHA', defaultValidityMonths: 24 },
  { name: 'NYS Certified First Responder', abbreviation: 'CFR', issuingOrg: 'NYS DOH', defaultValidityMonths: 36 },
  { name: 'NYS EMT', abbreviation: 'EMT', issuingOrg: 'NYS DOH', defaultValidityMonths: 36 },
  { name: 'NYS AEMT', abbreviation: 'AEMT', issuingOrg: 'NYS DOH', defaultValidityMonths: 36 },
  { name: 'NYS Paramedic', abbreviation: 'Paramedic', issuingOrg: 'NYS DOH', defaultValidityMonths: 36 },
  { name: "Driver's License", abbreviation: 'DL', issuingOrg: null, defaultValidityMonths: 96 },
  { name: 'CEVO', abbreviation: 'CEVO', issuingOrg: 'Coaching Systems', defaultValidityMonths: null },
  { name: 'NIMS ICS-100', abbreviation: 'NIMS 100', issuingOrg: 'FEMA', defaultValidityMonths: null },
  { name: 'NIMS ICS-200', abbreviation: 'NIMS 200', issuingOrg: 'FEMA', defaultValidityMonths: null },
  { name: 'NIMS IS-700', abbreviation: 'NIMS 700', issuingOrg: 'FEMA', defaultValidityMonths: null },
  { name: 'NIMS IS-800', abbreviation: 'NIMS 800', issuingOrg: 'FEMA', defaultValidityMonths: null },
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
  'members:read', 'members:write', 'members:deactivate', 'roles:manage',
  'settings:write', 'certs:read-all', 'certs:verify', 'credentials:grant',
  'credentials:appoint', 'evals:write', 'evals:manage-forms', 'evals:read-all',
  'promotions:review', 'promotions:vote', 'promotions:captain-approve',
  'promotions:adjust-requirements', 'trainings:manage',
  'schedule:crews:assign', 'schedule:crews:duty-sup',
  'schedule:crews:manage-defaults', 'schedule:settings',
  'events:create', 'events:assign-others', 'events:lock', 'events:approve',
  'fuel:write', 'radios:manage', 'vehicles:manage', 'tokens:manage',
  'dispatches:ingest', 'dispatches:read', 'audit:read', 'integrations:manage',
  'system:migrate-legacy',
];

export const ROLES: Array<{ name: string; isOfficer: boolean; permissions: string[] }> = [
  { name: 'Admin', isOfficer: false, permissions: ALL },
  {
    name: 'Captain',
    isOfficer: true,
    permissions: [
      'members:read', 'members:write', 'certs:read-all', 'credentials:grant',
      'credentials:appoint', 'evals:read-all', 'promotions:review',
      'promotions:captain-approve', 'promotions:adjust-requirements',
      'schedule:crews:assign', 'events:create', 'events:assign-others',
      'events:lock', 'events:approve', 'audit:read',
    ],
  },
  {
    name: 'Training Committee',
    isOfficer: false,
    permissions: [
      'members:read', 'certs:read-all', 'certs:verify', 'evals:write',
      'evals:manage-forms', 'evals:read-all', 'promotions:review',
      'promotions:vote', 'trainings:manage',
    ],
  },
  {
    name: 'Scheduling Coordinator',
    isOfficer: true,
    permissions: [
      'members:read', 'schedule:crews:assign', 'schedule:crews:manage-defaults',
      'schedule:settings', 'events:create', 'events:assign-others', 'events:lock',
    ],
  },
  {
    name: 'Duty Supervisor Coordinator',
    isOfficer: false,
    permissions: ['members:read', 'schedule:crews:assign'],
  },
  { name: 'Officer', isOfficer: true, permissions: ['members:read', 'certs:read-all'] },
];

/**
 * Creates any missing reference data. Safe to call on every boot: it only
 * fills gaps, and reports what it had to create so an environment that was
 * missing its ladder says so in the logs rather than failing quietly.
 */
export async function ensureReferenceData(
  prisma: PrismaClient,
  log: (message: string) => void = () => {},
): Promise<void> {
  const created: string[] = [];

  // Credential ladder
  for (const cred of CREDENTIALS) {
    const existing = await prisma.credentialType.findUnique({
      where: { key: cred.key },
    });
    if (!existing) {
      await prisma.credentialType.create({
        data: {
          key: cred.key,
          name: cred.name,
          grantMethod: cred.grantMethod ?? GrantMethod.PROMOTION,
          isAddOn: cred.isAddOn ?? false,
          outranksAll: cred.outranksAll ?? false,
        },
      });
      created.push(`credential ${cred.key}`);
    } else if (existing.outranksAll !== (cred.outranksAll ?? false)) {
      // Code-owned, not admin-editable: keep it in step on existing rows.
      await prisma.credentialType.update({
        where: { id: existing.id },
        data: { outranksAll: cred.outranksAll ?? false },
      });
      created.push(`credential ${cred.key} (outranksAll)`);
    }
  }
  for (const cred of CREDENTIALS) {
    const type = await prisma.credentialType.findUniqueOrThrow({
      where: { key: cred.key },
    });
    for (const requiredKey of cred.requires) {
      const required = await prisma.credentialType.findUniqueOrThrow({
        where: { key: requiredKey },
      });
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
    }
  }

  // Scheduling knobs — existing values are never overwritten.
  for (const [key, value] of Object.entries(SCHEDULING_SETTINGS)) {
    const existing = await prisma.schedulingSetting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.schedulingSetting.create({ data: { key, value: value as object } });
      created.push(`setting ${key}`);
    }
  }

  for (const name of EVENT_KINDS) {
    const existing = await prisma.eventKind.findUnique({ where: { name } });
    if (!existing) {
      await prisma.eventKind.create({ data: { name } });
      created.push(`event kind ${name}`);
    }
  }

  for (const tier of EVENT_TIERS) {
    const existing = await prisma.eventTier.findUnique({ where: { name: tier.name } });
    if (!existing) {
      await prisma.eventTier.create({ data: tier });
      created.push(`event tier ${tier.name}`);
    }
  }

  for (const cert of CERT_TYPES) {
    const existing = await prisma.certificationType.findUnique({
      where: { name: cert.name },
    });
    if (!existing) {
      await prisma.certificationType.create({ data: cert });
      created.push(`certification ${cert.abbreviation}`);
    }
  }

  // Certification ranking. Edges are create-if-missing, like the credential
  // ladder: an administrator may add their own, and removing one here does not
  // put it back.
  for (const step of CERT_HIERARCHY) {
    const higher = await prisma.certificationType.findUnique({
      where: { name: step.higher },
    });
    if (!higher) continue;
    for (const lowerName of step.supersedes) {
      const lower = await prisma.certificationType.findUnique({
        where: { name: lowerName },
      });
      if (!lower) continue;
      const exists = await prisma.certificationSupersession.findUnique({
        where: {
          higherTypeId_lowerTypeId: {
            higherTypeId: higher.id,
            lowerTypeId: lower.id,
          },
        },
      });
      if (exists) continue;
      await prisma.certificationSupersession.create({
        data: { higherTypeId: higher.id, lowerTypeId: lower.id },
      });
      created.push(`${step.higher} supersedes ${lowerName}`);
    }
  }

  // Roles. Permissions are attached only when the role is first created, so a
  // permission deliberately removed in the console stays removed.
  for (const role of ROLES) {
    const existing = await prisma.role.findUnique({ where: { name: role.name } });
    if (existing) continue;
    await prisma.role.create({
      data: {
        name: role.name,
        isOfficer: role.isOfficer,
        permissions: { create: role.permissions.map((permission) => ({ permission })) },
      },
    });
    created.push(`role ${role.name}`);
  }

  if (created.length) {
    log(`Reference data created: ${created.join(', ')}`);
  }
}
