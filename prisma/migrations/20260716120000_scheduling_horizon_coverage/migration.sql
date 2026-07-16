-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'IF_NEEDED');

-- CreateEnum
CREATE TYPE "EventWorkflowStatus" AS ENUM ('DRAFT', 'AVAILABILITY_REQUESTED', 'PENDING_APPROVAL', 'APPROVED', 'DENIED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('FROM_REQUESTER', 'TO_REQUESTER');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "tierId" INTEGER,
ADD COLUMN     "workflowStatus" "EventWorkflowStatus" NOT NULL DEFAULT 'APPROVED';

-- CreateTable
CREATE TABLE "CrewAbsence" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrewAbsence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityPoll" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PollStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "AvailabilityPoll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityPollInvite" (
    "pollId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "AvailabilityPollInvite_pkey" PRIMARY KEY ("pollId","memberId")
);

-- CreateTable
CREATE TABLE "AvailabilityResponse" (
    "pollId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "weekday" INTEGER NOT NULL,
    "status" "AvailabilityStatus" NOT NULL,

    CONSTRAINT "AvailabilityResponse_pkey" PRIMARY KEY ("pollId","memberId","weekday")
);

-- CreateTable
CREATE TABLE "EventTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaults" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EventTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAvailability" (
    "eventId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "positions" TEXT[],
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAvailability_pkey" PRIMARY KEY ("eventId","memberId")
);

-- CreateTable
CREATE TABLE "CoverageRequest" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterOrg" TEXT,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT,
    "description" TEXT NOT NULL,
    "requestedDate" DATE,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER,

    CONSTRAINT "CoverageRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageMessage" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "body" TEXT NOT NULL,
    "authorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoverageMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CrewAbsence_date_idx" ON "CrewAbsence"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CrewAbsence_memberId_date_key" ON "CrewAbsence"("memberId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "EventTier_name_key" ON "EventTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CoverageRequest_token_key" ON "CoverageRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "CoverageRequest_eventId_key" ON "CoverageRequest"("eventId");

-- AddForeignKey
ALTER TABLE "CrewAbsence" ADD CONSTRAINT "CrewAbsence_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityPoll" ADD CONSTRAINT "AvailabilityPoll_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityPollInvite" ADD CONSTRAINT "AvailabilityPollInvite_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "AvailabilityPoll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityPollInvite" ADD CONSTRAINT "AvailabilityPollInvite_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityResponse" ADD CONSTRAINT "AvailabilityResponse_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "AvailabilityPoll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityResponse" ADD CONSTRAINT "AvailabilityResponse_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "EventTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAvailability" ADD CONSTRAINT "EventAvailability_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAvailability" ADD CONSTRAINT "EventAvailability_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageRequest" ADD CONSTRAINT "CoverageRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageMessage" ADD CONSTRAINT "CoverageMessage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CoverageRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageMessage" ADD CONSTRAINT "CoverageMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

