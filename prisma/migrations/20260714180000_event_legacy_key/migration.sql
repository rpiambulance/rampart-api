-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "legacyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_legacyKey_key" ON "Event"("legacyKey");

