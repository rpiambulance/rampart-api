-- Attachments on evaluations.
--
-- A form takes none, may take some, or insists on at least one. Each file
-- carries a title in the evaluator words — a list of filenames is not a
-- record anybody can read a year later — and an optional warning before the
-- picker says what must not be in them.

-- CreateEnum
CREATE TYPE "AttachmentRequirement" AS ENUM ('NONE', 'OPTIONAL', 'REQUIRED');

-- AlterTable
ALTER TABLE "EvalFormTemplate" ADD COLUMN     "attachments" "AttachmentRequirement" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "phiWarning" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EvalAttachment" (
    "id" TEXT NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedById" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvalAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvalAttachment_evaluationId_idx" ON "EvalAttachment"("evaluationId");

-- AddForeignKey
ALTER TABLE "EvalAttachment" ADD CONSTRAINT "EvalAttachment_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalAttachment" ADD CONSTRAINT "EvalAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

