-- AlterTable
ALTER TABLE "AnnualTrainingRequirement" ADD COLUMN     "blocksScheduling" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Dispatch" (
    "id" SERIAL NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "determinant" TEXT,
    "complaint" TEXT,
    "location" TEXT,
    "business" TEXT,
    "additionalInfo" TEXT,
    "crossStreets" TEXT,
    "units" TEXT,
    "responseAreas" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "geocodedPlace" TEXT,
    "raw" JSONB NOT NULL,

    CONSTRAINT "Dispatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dispatch_receivedAt_idx" ON "Dispatch"("receivedAt");

