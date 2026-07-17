-- CreateEnum
CREATE TYPE "AdjustmentKind" AS ENUM ('WAIVER', 'ADDITIONAL');

-- CreateTable
CREATE TABLE "PromotionRequirementAdjustment" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "credentialTypeId" INTEGER NOT NULL,
    "kind" "AdjustmentKind" NOT NULL,
    "requirementId" INTEGER,
    "reqKind" "RequirementKind",
    "certificationTypeId" INTEGER,
    "evalTemplateId" INTEGER,
    "count" INTEGER,
    "classId" INTEGER,
    "note" TEXT,
    "satisfiedAt" TIMESTAMP(3),
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionRequirementAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromotionRequirementAdjustment_memberId_credentialTypeId_idx" ON "PromotionRequirementAdjustment"("memberId", "credentialTypeId");

-- AddForeignKey
ALTER TABLE "PromotionRequirementAdjustment" ADD CONSTRAINT "PromotionRequirementAdjustment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequirementAdjustment" ADD CONSTRAINT "PromotionRequirementAdjustment_credentialTypeId_fkey" FOREIGN KEY ("credentialTypeId") REFERENCES "CredentialType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequirementAdjustment" ADD CONSTRAINT "PromotionRequirementAdjustment_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "CredentialRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequirementAdjustment" ADD CONSTRAINT "PromotionRequirementAdjustment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequirementAdjustment" ADD CONSTRAINT "PromotionRequirementAdjustment_certificationTypeId_fkey" FOREIGN KEY ("certificationTypeId") REFERENCES "CertificationType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequirementAdjustment" ADD CONSTRAINT "PromotionRequirementAdjustment_evalTemplateId_fkey" FOREIGN KEY ("evalTemplateId") REFERENCES "EvalFormTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequirementAdjustment" ADD CONSTRAINT "PromotionRequirementAdjustment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "TrainingClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

