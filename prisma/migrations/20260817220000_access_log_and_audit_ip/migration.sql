-- AlterTable
ALTER TABLE "AuditLog"
  ADD COLUMN "ip" TEXT,
  ADD COLUMN "userAgent" TEXT;

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" BIGSERIAL NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" TEXT NOT NULL DEFAULT 'API',
    "memberId" INTEGER,
    "apiTokenId" INTEGER,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "status" INTEGER,
    "durationMs" INTEGER,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessLog_at_idx" ON "AccessLog"("at");
CREATE INDEX "AccessLog_memberId_at_idx" ON "AccessLog"("memberId", "at");
CREATE INDEX "AccessLog_path_idx" ON "AccessLog"("path");
