-- CreateEnum
CREATE TYPE "EncounterVoid" AS ENUM ('UNFOUNDED', 'CREATED_IN_ERROR');

-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "voidNote" TEXT,
ADD COLUMN     "voidedAs" "EncounterVoid",
ADD COLUMN     "voidedAt" TIMESTAMP(3),
ADD COLUMN     "voidedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_voidedById_fkey" FOREIGN KEY ("voidedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

