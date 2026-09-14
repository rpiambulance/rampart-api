-- CreateTable
CREATE TABLE "CalloutAudio" (
    "id" SERIAL NOT NULL,
    "calloutId" INTEGER,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "filename" TEXT,
    "slackFileId" TEXT,
    "slackPermalink" TEXT,

    CONSTRAINT "CalloutAudio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalloutAudio_receivedAt_idx" ON "CalloutAudio"("receivedAt");

-- AddForeignKey
ALTER TABLE "CalloutAudio" ADD CONSTRAINT "CalloutAudio_calloutId_fkey" FOREIGN KEY ("calloutId") REFERENCES "Callout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

