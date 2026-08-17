-- CreateEnum
CREATE TYPE "TemplateKind" AS ENUM ('EVALUATION', 'CHECKLIST');

-- AlterEnum
-- Postgres will not let a value added to an enum be used in the same
-- transaction, and Prisma runs each migration in one. These are only written
-- by later migrations/runtime, so the split is safe.
ALTER TYPE "ScoreType" ADD VALUE 'SHORT_TEXT';
ALTER TYPE "ScoreType" ADD VALUE 'NUMBER';
ALTER TYPE "ScoreType" ADD VALUE 'MULTI_SELECT';
ALTER TYPE "ScoreType" ADD VALUE 'SIGNOFF';

-- AlterEnum
ALTER TYPE "RequirementKind" ADD VALUE 'CHECKLIST';

-- AlterTable
ALTER TABLE "EvalFormTemplate"
  ADD COLUMN "kind" "TemplateKind" NOT NULL DEFAULT 'EVALUATION',
  ADD COLUMN "signoffCredentialTypeId" INTEGER;

-- CreateTable
CREATE TABLE "EvalFormGroup" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "EvalFormGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvalFormGroup_templateId_idx" ON "EvalFormGroup"("templateId");

-- AlterTable
ALTER TABLE "EvalFormItem"
  ADD COLUMN "groupId" INTEGER,
  ADD COLUMN "minValue" DOUBLE PRECISION,
  ADD COLUMN "maxValue" DOUBLE PRECISION,
  ADD COLUMN "unit" TEXT,
  ADD COLUMN "signoffCredentialTypeId" INTEGER;

-- DropIndex
-- Order is now read within a group, so the same number recurs down a form.
DROP INDEX IF EXISTS "EvalFormItem_templateId_order_key";

-- CreateIndex
CREATE INDEX "EvalFormItem_templateId_idx" ON "EvalFormItem"("templateId");
CREATE INDEX "EvalFormItem_groupId_idx" ON "EvalFormItem"("groupId");

-- AlterTable
ALTER TABLE "EvalScore"
  ADD COLUMN "optionValues" TEXT[],
  ADD COLUMN "numberValue" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "ChecklistSignoff" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "signedById" INTEGER NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revokedById" INTEGER,
    "revokeReason" TEXT,

    CONSTRAINT "ChecklistSignoff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChecklistSignoff_memberId_itemId_idx" ON "ChecklistSignoff"("memberId", "itemId");
CREATE INDEX "ChecklistSignoff_itemId_idx" ON "ChecklistSignoff"("itemId");

-- AddForeignKey
ALTER TABLE "EvalFormTemplate" ADD CONSTRAINT "EvalFormTemplate_signoffCredentialTypeId_fkey" FOREIGN KEY ("signoffCredentialTypeId") REFERENCES "CredentialType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EvalFormGroup" ADD CONSTRAINT "EvalFormGroup_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EvalFormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EvalFormItem" ADD CONSTRAINT "EvalFormItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "EvalFormGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EvalFormItem" ADD CONSTRAINT "EvalFormItem_signoffCredentialTypeId_fkey" FOREIGN KEY ("signoffCredentialTypeId") REFERENCES "CredentialType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChecklistSignoff" ADD CONSTRAINT "ChecklistSignoff_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChecklistSignoff" ADD CONSTRAINT "ChecklistSignoff_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "EvalFormItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChecklistSignoff" ADD CONSTRAINT "ChecklistSignoff_signedById_fkey" FOREIGN KEY ("signedById") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChecklistSignoff" ADD CONSTRAINT "ChecklistSignoff_revokedById_fkey" FOREIGN KEY ("revokedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
