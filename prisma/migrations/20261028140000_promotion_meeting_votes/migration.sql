-- CreateTable
CREATE TABLE "PromotionMeetingVote" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "meetingDate" DATE NOT NULL,
    "approve" INTEGER NOT NULL,
    "deny" INTEGER NOT NULL,
    "abstain" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "recordedById" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionMeetingVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromotionMeetingVote_requestId_key" ON "PromotionMeetingVote"("requestId");

-- AddForeignKey
ALTER TABLE "PromotionMeetingVote" ADD CONSTRAINT "PromotionMeetingVote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PromotionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionMeetingVote" ADD CONSTRAINT "PromotionMeetingVote_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

