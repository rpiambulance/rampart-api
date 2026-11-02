-- A requirement that stops applying after a date, that only accepts evidence
-- from a date on, and the advance reminders sent before it takes effect.
ALTER TABLE "CredentialRequirement" ADD COLUMN "effectiveUntil" DATE;
ALTER TABLE "CredentialRequirement" ADD COLUMN "countsFrom" DATE;
ALTER TABLE "CredentialRequirement" ADD COLUMN "announcedAt" TIMESTAMP(3);
ALTER TABLE "CredentialRequirement" ADD COLUMN "remindersSent" INTEGER NOT NULL DEFAULT 0;
