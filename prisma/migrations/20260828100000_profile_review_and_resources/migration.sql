-- Asking a member to check their own details, and a shared list of links.
--
-- A review is outstanding when the request is newer than the confirmation,
-- so there is no separate flag to keep in step and a confirmation given
-- between two requests cannot be lost.

ALTER TABLE "Member"
  ADD COLUMN "profileConfirmedAt"         TIMESTAMP(3),
  ADD COLUMN "profileReviewRequestedAt"   TIMESTAMP(3),
  ADD COLUMN "profileReviewRequestedById" INTEGER,
  ADD COLUMN "profileReviewNote"          TEXT;

ALTER TABLE "Member"
  ADD CONSTRAINT "Member_profileReviewRequestedById_fkey"
  FOREIGN KEY ("profileReviewRequestedById") REFERENCES "Member"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Resource" (
  "id"          SERIAL NOT NULL,
  "title"       TEXT NOT NULL,
  "url"         TEXT NOT NULL,
  "description" TEXT,
  "position"    INTEGER NOT NULL DEFAULT 0,
  "createdById" INTEGER,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Resource_position_idx" ON "Resource"("position");

ALTER TABLE "Resource"
  ADD CONSTRAINT "Resource_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "Member"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
