-- DropIndex
DROP INDEX "PromotionVote_requestId_voterId_proxyForId_key";

-- AlterTable
ALTER TABLE "PromotionVote" ADD COLUMN     "rescindNote" TEXT,
ADD COLUMN     "rescindedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "PromotionVote_requestId_idx" ON "PromotionVote"("requestId");

