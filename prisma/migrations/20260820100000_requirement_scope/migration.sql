-- Requirements split into what earns a credential and what keeps it.
CREATE TYPE "RequirementScope" AS ENUM ('PROMOTION', 'ONGOING', 'BOTH');

-- PROMOTION for everything that already exists: none of it was created with
-- the intent of suspending existing holders, and defaulting the other way
-- would do exactly that on the first nightly run after this deploys.
ALTER TABLE "CredentialRequirement"
  ADD COLUMN "scope" "RequirementScope" NOT NULL DEFAULT 'PROMOTION',
  ADD COLUMN "effectiveFrom" DATE;
