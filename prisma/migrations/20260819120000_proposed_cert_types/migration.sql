-- A certification type suggested by a member submitting something the list
-- did not have. It works like any other type, but is marked until somebody
-- with settings permission has vetted how it is configured.
ALTER TABLE "CertificationType"
  ADD COLUMN "proposed" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "proposedById" INTEGER,
  ADD COLUMN "proposedAt" TIMESTAMP(3);

ALTER TABLE "CertificationType" ADD CONSTRAINT "CertificationType_proposedById_fkey" FOREIGN KEY ("proposedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
