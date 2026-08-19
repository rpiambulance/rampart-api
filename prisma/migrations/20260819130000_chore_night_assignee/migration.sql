-- One night handed to someone else, without disturbing the standing
-- arrangement on the chore itself. Null means the chore's assignee applies.
ALTER TABLE "ChoreOccurrence" ADD COLUMN "assigneeId" INTEGER;

ALTER TABLE "ChoreOccurrence" ADD CONSTRAINT "ChoreOccurrence_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
