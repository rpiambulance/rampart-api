-- CreateEnum
CREATE TYPE "CalloutKind" AS ENUM ('DISPATCH', 'LONGTONE');

-- CreateTable
CREATE TABLE "Callout" (
    "id" SERIAL NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" "CalloutKind" NOT NULL DEFAULT 'DISPATCH',
    "pageText" TEXT,
    "pagedAt" TIMESTAMP(3),
    "dispatchId" INTEGER,
    "asked" BOOLEAN NOT NULL DEFAULT false,
    "closesAt" TIMESTAMP(3) NOT NULL,
    "slackChannel" TEXT,
    "slackTs" TEXT,

    CONSTRAINT "Callout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalloutResponse" (
    "id" SERIAL NOT NULL,
    "calloutId" INTEGER NOT NULL,
    "memberId" INTEGER,
    "slackUserId" TEXT NOT NULL,
    "slackName" TEXT,
    "responding" BOOLEAN NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalloutResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Callout_dispatchId_key" ON "Callout"("dispatchId");

-- CreateIndex
CREATE INDEX "Callout_openedAt_idx" ON "Callout"("openedAt");

-- CreateIndex
CREATE INDEX "CalloutResponse_memberId_idx" ON "CalloutResponse"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "CalloutResponse_calloutId_slackUserId_key" ON "CalloutResponse"("calloutId", "slackUserId");

-- AddForeignKey
ALTER TABLE "Callout" ADD CONSTRAINT "Callout_dispatchId_fkey" FOREIGN KEY ("dispatchId") REFERENCES "Dispatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalloutResponse" ADD CONSTRAINT "CalloutResponse_calloutId_fkey" FOREIGN KEY ("calloutId") REFERENCES "Callout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalloutResponse" ADD CONSTRAINT "CalloutResponse_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

