-- The account request now asks for what a member keeps on their own profile,
-- so approving one does not start with an officer emailing to ask for a
-- phone number.

-- Renamed rather than dropped and re-added: same end state, but it carries
-- any numbers already collected instead of discarding them.
ALTER TABLE "AccountRequest" RENAME COLUMN "phone" TO "cellPhone";

ALTER TABLE "AccountRequest"
  ADD COLUMN "preferredFirstName" TEXT,
  ADD COLUMN "personalEmail" TEXT,
  ADD COLUMN "homePhone" TEXT,
  ADD COLUMN "localAddress" TEXT,
  ADD COLUMN "homeAddress" TEXT,
  ADD COLUMN "dob" DATE;
