-- Grant full admin access to one member, by email.
--
--   psql "$DATABASE_URL" -v email=you@rpiambulance.com -f scripts/grant-admin.sql
--
-- Safe to re-run. Self-sufficient: creates the Admin role and its permissions
-- if the seed never ran, creates the member if they don't exist yet, and skips
-- the role assignment if they already hold it.
--
-- The Keycloak account is linked automatically on first login by verified
-- email, so no keycloakSubject is needed here.

BEGIN;

-- 1. Ensure the Admin role exists ("updatedAt" has no DB default — Prisma
--    normally supplies it, so raw inserts must too).
INSERT INTO "Role" (name, description, "isOfficer", "updatedAt")
VALUES ('Admin', 'Full system access', false, now())
ON CONFLICT (name) DO NOTHING;

-- 2. Ensure it carries every permission in the catalog.
INSERT INTO "RolePermission" ("roleId", permission)
SELECT r.id, p.permission
FROM "Role" r
CROSS JOIN (VALUES
  ('members:read'),('members:write'),('members:deactivate'),('roles:manage'),
  ('settings:write'),('certs:read-all'),('certs:verify'),('credentials:grant'),
  ('credentials:appoint'),('evals:write'),('evals:manage-forms'),('evals:read-all'),
  ('promotions:review'),('promotions:vote'),('promotions:captain-approve'),
  ('promotions:adjust-requirements'),('schedule:crews:assign'),
  ('schedule:crews:manage-defaults'),('schedule:settings'),('events:create'),
  ('events:assign-others'),('events:lock'),('events:approve'),('trainings:manage'),
  ('fuel:write'),('radios:manage'),('vehicles:manage'),('tokens:manage'),
  ('dispatches:ingest'),('dispatches:read'),('audit:read'),('integrations:manage')
) AS p(permission)
WHERE r.name = 'Admin'
ON CONFLICT ("roleId", permission) DO NOTHING;

-- 3. Ensure the member exists and is active.
INSERT INTO "Member" ("firstName", "lastName", email, active, "updatedAt")
VALUES ('Admin', 'User', :'email', true, now())
ON CONFLICT (email) DO UPDATE SET active = true;

-- 4. Assign Admin, unless already held.
INSERT INTO "MemberRole" ("memberId", "roleId", "startDate")
SELECT m.id, r.id, CURRENT_DATE
FROM "Member" m, "Role" r
WHERE m.email = :'email'
  AND r.name = 'Admin'
  AND NOT EXISTS (
    SELECT 1 FROM "MemberRole" x
    WHERE x."memberId" = m.id AND x."roleId" = r.id
  );

COMMIT;

-- Verification.
SELECT m.id,
       m.email,
       m."firstName" || ' ' || m."lastName" AS name,
       m.active,
       COALESCE(m."keycloakSubject", '(links on first login)') AS keycloak,
       r.name AS role,
       (SELECT count(*) FROM "RolePermission" rp WHERE rp."roleId" = r.id) AS permissions
FROM "Member" m
JOIN "MemberRole" mr ON mr."memberId" = m.id
JOIN "Role" r ON r.id = mr."roleId"
WHERE m.email = :'email';
