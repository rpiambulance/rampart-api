-- AlterTable
ALTER TABLE "CoverageRequest" ADD COLUMN     "declineReason" TEXT,
ADD COLUMN     "declinedAt" TIMESTAMP(3);
