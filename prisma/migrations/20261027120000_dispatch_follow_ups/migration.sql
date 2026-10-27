-- AlterTable
ALTER TABLE "Callout" ADD COLUMN     "mirrorChannel" TEXT,
ADD COLUMN     "mirrorTs" TEXT;

-- AlterTable
ALTER TABLE "Dispatch" ADD COLUMN     "arrivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "primaryId" INTEGER;

-- CreateIndex
CREATE INDEX "Dispatch_arrivedAt_idx" ON "Dispatch"("arrivedAt");

-- CreateIndex
CREATE INDEX "Dispatch_primaryId_idx" ON "Dispatch"("primaryId");

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_primaryId_fkey" FOREIGN KEY ("primaryId") REFERENCES "Dispatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Everything already here arrived when it was received, as far as anybody
-- can now say; the column's default would claim it all arrived today.
UPDATE "Dispatch" SET "arrivedAt" = "receivedAt";
