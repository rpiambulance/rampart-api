-- CreateEnum
CREATE TYPE "EvalOutcome" AS ENUM ('NEEDS_IMPROVEMENT', 'PASSED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ScoreType" ADD VALUE 'OPTIONS';
ALTER TYPE "ScoreType" ADD VALUE 'HEADING';

-- AlterTable
ALTER TABLE "EvalFormItem" ADD COLUMN     "options" JSONB;

-- AlterTable
ALTER TABLE "EvalScore" ADD COLUMN     "optionValue" TEXT;

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "outcome" "EvalOutcome",
ADD COLUMN     "readyForPromotion" BOOLEAN;
