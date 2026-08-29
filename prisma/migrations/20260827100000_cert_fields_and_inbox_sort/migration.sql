-- Which fields a certification type asks for, and how a member's inbox is
-- ordered. Both default to what the code did before, so no row changes
-- meaning: every field stays optional, and the inbox keeps unread first.

CREATE TYPE "FieldRequirement" AS ENUM ('HIDDEN', 'OPTIONAL', 'REQUIRED');

ALTER TABLE "CertificationType"
  ADD COLUMN "identifierField" "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL',
  ADD COLUMN "issuedAtField"   "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL',
  ADD COLUMN "expiresAtField"  "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL',
  ADD COLUMN "documentField"   "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL';

ALTER TABLE "Member"
  ADD COLUMN "inboxSort" TEXT NOT NULL DEFAULT 'unreadFirst';
