/**
 * Seeds reference data: the credential ladder, default scheduling settings,
 * event kinds, starter cert types, and seed roles. Idempotent (upserts).
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, GrantMethod } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const CREDENTIALS: Array<{
  key: string;
  name: string;
  requires: string[];
  grantMethod?: GrantMethod;
  isAddOn?: boolean;
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
  },
];

const SCHEDULING_SETTINGS: Record<string, unknown> = {
  minAgeYears: 18,
  riderSignupOpen: { weekday: 0, time: '16:00' }, // Sunday 1600
  rotationWeeks: 2,
  dayOfUnlockTime: '12:00',
  probationaryRequiresTrainer: true,
  dropDeadline: { daysBefore: 2, time: '18:00' },
};

const EVENT_KINDS = ['Game', 'Detail', 'Meeting', 'Social'];

const CERT_TYPES = [
  { name: 'CPR — BLS Provider', abbreviation: 'CPR', issuingOrg: 'AHA', defaultValidityMonths: 24 },
  { name: 'NYS EMT', abbreviation: 'EMT', issuingOrg: 'NYS DOH', defaultValidityMonths: 36 },
  { name: "Driver's License", abbreviation: 'DL', issuingOrg: null, defaultValidityMonths: 96 },
  { name: 'CEVO', abbreviation: 'CEVO', issuingOrg: 'Coaching Systems', defaultValidityMonths: null },
  { name: 'NIMS ICS-100', abbreviation: 'NIMS 100', issuingOrg: 'FEMA', defaultValidityMonths: null },
  { name: 'NIMS ICS-200', abbreviation: 'NIMS 200', issuingOrg: 'FEMA', defaultValidityMonths: null },
  { name: 'NIMS IS-700', abbreviation: 'NIMS 700', issuingOrg: 'FEMA', defaultValidityMonths: null },
  { name: 'NIMS IS-800', abbreviation: 'NIMS 800', issuingOrg: 'FEMA', defaultValidityMonths: null },
];

// Seed roles (spec §10). Permission keys must match src/permissions/catalog.ts.
const ALL = [
  'members:read', 'members:write', 'members:deactivate', 'roles:manage',
  'settings:write', 'certs:read-all', 'certs:verify', 'credentials:grant',
  'credentials:appoint', 'evals:write', 'evals:manage-forms', 'evals:read-all',
  'promotions:review', 'promotions:vote', 'promotions:captain-approve', 'trainings:manage',
  'schedule:crews:assign', 'schedule:crews:manage-defaults', 'schedule:settings',
  'events:create', 'events:assign-others', 'events:lock', 'fuel:write',
  'radios:manage', 'tokens:manage', 'audit:read', 'integrations:manage',
];

const ROLES: Array<{ name: string; isOfficer: boolean; permissions: string[] }> = [
  { name: 'Admin', isOfficer: false, permissions: ALL },
  {
    name: 'Captain',
    isOfficer: true,
    permissions: [
      'members:read', 'members:write', 'certs:read-all', 'credentials:grant',
      'credentials:appoint', 'evals:read-all', 'promotions:review',
      'promotions:captain-approve', 'schedule:crews:assign', 'events:create',
      'events:assign-others', 'events:lock', 'audit:read',
    ],
  },
  {
    name: 'Training Committee',
    isOfficer: false,
    permissions: [
      'members:read', 'certs:read-all', 'certs:verify', 'evals:write',
      'evals:manage-forms', 'evals:read-all', 'promotions:review', 'promotions:vote',
      'trainings:manage',
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

async function main() {
  // Credential ladder
  for (const cred of CREDENTIALS) {
    await prisma.credentialType.upsert({
      where: { key: cred.key },
      create: {
        key: cred.key,
        name: cred.name,
        grantMethod: cred.grantMethod ?? GrantMethod.PROMOTION,
        isAddOn: cred.isAddOn ?? false,
      },
      update: { name: cred.name },
    });
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

  // Scheduling knobs
  for (const [key, value] of Object.entries(SCHEDULING_SETTINGS)) {
    await prisma.schedulingSetting.upsert({
      where: { key },
      create: { key, value: value as object },
      update: {},
    });
  }

  // Event kinds
  for (const name of EVENT_KINDS) {
    await prisma.eventKind.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }

  // Certification types
  for (const cert of CERT_TYPES) {
    await prisma.certificationType.upsert({
      where: { name: cert.name },
      create: cert,
      update: {},
    });
  }

  // Roles
  for (const role of ROLES) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      create: { name: role.name, isOfficer: role.isOfficer },
      update: { isOfficer: role.isOfficer },
    });
    for (const permission of role.permissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permission: { roleId: created.id, permission } },
        create: { roleId: created.id, permission },
        update: {},
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
