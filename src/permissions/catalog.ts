/**
 * The permission catalog. Keys are stored in RolePermission / ApiToken rows;
 * handlers reference these constants. Spec §10.
 */
export const PERMISSIONS = {
  MEMBERS_READ: 'members:read',
  MEMBERS_WRITE: 'members:write',
  MEMBERS_DEACTIVATE: 'members:deactivate',
  ROLES_MANAGE: 'roles:manage',
  SETTINGS_WRITE: 'settings:write',
  CERTS_READ_ALL: 'certs:read-all',
  CERTS_VERIFY: 'certs:verify',
  CREDENTIALS_GRANT: 'credentials:grant',
  CREDENTIALS_APPOINT: 'credentials:appoint', // DS — Captain
  EVALS_WRITE: 'evals:write',
  EVALS_MANAGE_FORMS: 'evals:manage-forms',
  EVALS_READ_ALL: 'evals:read-all',
  PROMOTIONS_REVIEW: 'promotions:review',
  PROMOTIONS_VOTE: 'promotions:vote',
  PROMOTIONS_CAPTAIN_APPROVE: 'promotions:captain-approve',
  PROMOTIONS_ADJUST: 'promotions:adjust-requirements',
  SCHEDULE_CREWS_ASSIGN: 'schedule:crews:assign',
  SCHEDULE_CREWS_MANAGE_DEFAULTS: 'schedule:crews:manage-defaults',
  SCHEDULE_SETTINGS: 'schedule:settings',
  EVENTS_CREATE: 'events:create',
  EVENTS_ASSIGN_OTHERS: 'events:assign-others',
  EVENTS_LOCK: 'events:lock',
  EVENTS_APPROVE: 'events:approve',
  TRAININGS_MANAGE: 'trainings:manage',
  FUEL_WRITE: 'fuel:write',
  RADIOS_MANAGE: 'radios:manage',
  VEHICLES_MANAGE: 'vehicles:manage',
  TOKENS_MANAGE: 'tokens:manage',
  AUDIT_READ: 'audit:read',
  INTEGRATIONS_MANAGE: 'integrations:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);
