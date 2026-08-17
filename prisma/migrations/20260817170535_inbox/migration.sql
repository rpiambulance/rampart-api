-- CreateTable
CREATE TABLE "InboxMessage" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isTask" BOOLEAN NOT NULL DEFAULT false,
    "actionLabel" TEXT,
    "actionUrl" TEXT,
    "completedAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InboxMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InboxMessage_memberId_readAt_idx" ON "InboxMessage"("memberId", "readAt");

-- CreateIndex
CREATE INDEX "InboxMessage_memberId_isTask_completedAt_idx" ON "InboxMessage"("memberId", "isTask", "completedAt");

-- AddForeignKey
ALTER TABLE "InboxMessage" ADD CONSTRAINT "InboxMessage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
