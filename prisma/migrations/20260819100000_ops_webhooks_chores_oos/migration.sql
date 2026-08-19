-- CreateEnum
CREATE TYPE "ChoreCadence" AS ENUM ('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable: a night the agency is not running a crew. The duty supervisor
-- seat is kept regardless, so this marks the night rather than emptying it.
ALTER TABLE "Crew"
  ADD COLUMN "outOfService" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "outOfServiceReason" TEXT,
  ADD COLUMN "outOfServiceAt" TIMESTAMP(3),
  ADD COLUMN "outOfServiceById" INTEGER;

-- AlterTable: requirements sharing a group are alternatives.
ALTER TABLE "CredentialRequirement" ADD COLUMN "alternativeGroup" TEXT;

-- CreateTable
CREATE TABLE "Webhook" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT[],
    "secret" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "lastStatus" INTEGER,
    "lastAt" TIMESTAMP(3),
    "lastError" TEXT,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookDelivery" (
    "id" BIGSERIAL NOT NULL,
    "webhookId" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER,
    "error" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Chore" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cadence" "ChoreCadence" NOT NULL DEFAULT 'WEEKLY',
    "dayOfWeek" INTEGER,
    "dayOfMonth" INTEGER,
    "noticeDays" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "assigneeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChoreOccurrence" (
    "id" SERIAL NOT NULL,
    "choreId" INTEGER NOT NULL,
    "dueOn" DATE NOT NULL,
    "completedAt" TIMESTAMP(3),
    "completedById" INTEGER,
    "note" TEXT,
    "slackChannel" TEXT,
    "slackTs" TEXT,
    "postedAt" TIMESTAMP(3),

    CONSTRAINT "ChoreOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebhookDelivery_webhookId_createdAt_idx" ON "WebhookDelivery"("webhookId", "createdAt");
CREATE UNIQUE INDEX "ChoreOccurrence_choreId_dueOn_key" ON "ChoreOccurrence"("choreId", "dueOn");
CREATE INDEX "ChoreOccurrence_dueOn_idx" ON "ChoreOccurrence"("dueOn");

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_outOfServiceById_fkey" FOREIGN KEY ("outOfServiceById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Chore" ADD CONSTRAINT "Chore_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChoreOccurrence" ADD CONSTRAINT "ChoreOccurrence_choreId_fkey" FOREIGN KEY ("choreId") REFERENCES "Chore"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChoreOccurrence" ADD CONSTRAINT "ChoreOccurrence_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
