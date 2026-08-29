-- A task can now say what it is about, and who dealt with it. Together these
-- let one person's action close the same task in everybody else's inbox, and
-- say by whom, rather than the copies sitting there until each person opens
-- one and finds the work already done.

ALTER TABLE "InboxMessage"
  ADD COLUMN "completedById" INTEGER,
  ADD COLUMN "subjectType"   TEXT,
  ADD COLUMN "subjectId"     INTEGER;

ALTER TABLE "InboxMessage"
  ADD CONSTRAINT "InboxMessage_completedById_fkey"
  FOREIGN KEY ("completedById") REFERENCES "Member"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "InboxMessage_subjectType_subjectId_idx"
  ON "InboxMessage"("subjectType", "subjectId");
