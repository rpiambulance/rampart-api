-- Whether the trainee fills an item in themselves when asking for an
-- evaluation.
CREATE TYPE "TraineeInput" AS ENUM ('NONE', 'OPTIONAL', 'REQUIRED');

ALTER TABLE "EvalFormItem"
  ADD COLUMN "traineeInput" "TraineeInput" NOT NULL DEFAULT 'NONE';

-- "Eval date" is what it is called: the day being evaluated, which is not
-- always a night crew shift.
ALTER TABLE "Evaluation" RENAME COLUMN "shiftDate" TO "evalDate";

-- Set when the trainee asked for the evaluation rather than the trainer
-- starting one.
ALTER TABLE "Evaluation"
  ADD COLUMN "requestedById" INTEGER,
  ADD COLUMN "requestedAt" TIMESTAMP(3);

ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
