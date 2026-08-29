-- Seals on checksheet sections.
--
-- A sealed section is checked by reading the number rather than opening it.
-- The number is recorded, not merely confirmed, so a seal changing between
-- checks is visible afterwards; and a section configured to carry a seal can
-- still be found without one, which is recorded rather than refused.

-- AlterTable
ALTER TABLE "ChecksheetSection" ADD COLUMN     "hasSeal" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ChecksheetSectionEntry" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "sealPresent" BOOLEAN NOT NULL DEFAULT false,
    "sealNumber" TEXT,
    "sealBroken" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,

    CONSTRAINT "ChecksheetSectionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChecksheetSectionEntry_sectionId_idx" ON "ChecksheetSectionEntry"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ChecksheetSectionEntry_runId_sectionId_key" ON "ChecksheetSectionEntry"("runId", "sectionId");

-- AddForeignKey
ALTER TABLE "ChecksheetSectionEntry" ADD CONSTRAINT "ChecksheetSectionEntry_runId_fkey" FOREIGN KEY ("runId") REFERENCES "ChecksheetRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetSectionEntry" ADD CONSTRAINT "ChecksheetSectionEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ChecksheetSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

