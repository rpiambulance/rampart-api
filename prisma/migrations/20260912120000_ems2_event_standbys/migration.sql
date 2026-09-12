-- CreateEnum
CREATE TYPE "StandbyRole" AS ENUM ('EES_IC', 'EES', 'CREW', 'SUPPORT');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'AT_PATIENT', 'TRANSPORTING', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "EncounterCategory" AS ENUM ('MINOR_INJURY', 'MAJOR_INJURY', 'MINOR_ILLNESS', 'MAJOR_ILLNESS');

-- CreateEnum
CREATE TYPE "EncounterDisposition" AS ENUM ('RMA', 'TRANSPORTED', 'TURNOVER', 'TREATED_RELEASED', 'NO_PATIENT_FOUND', 'DECEASED');

-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueLocation" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VenueLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitDesignator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UnitDesignator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandbyLog" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "venueId" INTEGER,
    "venueText" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "totalAttendance" INTEGER,
    "totalEstimated" BOOLEAN NOT NULL DEFAULT false,
    "peakAttendance" INTEGER,
    "peakEstimated" BOOLEAN NOT NULL DEFAULT false,
    "sponsorOperator" TEXT,
    "unusualOccurrences" TEXT,
    "completedByName" TEXT,
    "completedByTitle" TEXT,
    "completedByPhone" TEXT,
    "completedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "closedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandbyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandbyPersonnel" (
    "id" SERIAL NOT NULL,
    "standbyId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "role" "StandbyRole" NOT NULL DEFAULT 'CREW',
    "fromSignup" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" INTEGER,
    "removedAt" TIMESTAMP(3),
    "removedById" INTEGER,
    "note" TEXT,

    CONSTRAINT "StandbyPersonnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandbyUnit" (
    "id" SERIAL NOT NULL,
    "standbyId" INTEGER NOT NULL,
    "designatorId" INTEGER,
    "name" TEXT NOT NULL,
    "kind" TEXT,
    "status" "UnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "currentLocationId" INTEGER,
    "currentLocationText" TEXT,
    "stagingLocationId" INTEGER,
    "stagingLocationText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "retiredAt" TIMESTAMP(3),

    CONSTRAINT "StandbyUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitAssignment" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "personnelId" INTEGER NOT NULL,
    "position" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "UnitAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" SERIAL NOT NULL,
    "standbyId" INTEGER NOT NULL,
    "unitId" INTEGER,
    "sequence" INTEGER NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "patientInitials" TEXT,
    "patientAge" INTEGER,
    "patientAgeUnit" TEXT DEFAULT 'years',
    "category" "EncounterCategory" NOT NULL,
    "died" BOOLEAN NOT NULL DEFAULT false,
    "intoxicationSigns" BOOLEAN NOT NULL DEFAULT false,
    "chiefComplaint" TEXT,
    "treatment" TEXT,
    "narrative" TEXT,
    "disposition" "EncounterDisposition" NOT NULL,
    "hospitalId" INTEGER,
    "turnoverAgency" TEXT,
    "firstAidOnly" BOOLEAN NOT NULL DEFAULT false,
    "runNumberId" INTEGER,
    "countyRunNumber" TEXT,
    "prid" TEXT,
    "locationId" INTEGER,
    "locationText" TEXT,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandbyTimelineEntry" (
    "id" BIGSERIAL NOT NULL,
    "standbyId" INTEGER NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" TEXT NOT NULL,
    "unitId" INTEGER,
    "encounterId" INTEGER,
    "memberId" INTEGER,
    "actorId" INTEGER,
    "detail" JSONB,

    CONSTRAINT "StandbyTimelineEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_key" ON "Venue"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VenueLocation_venueId_name_key" ON "VenueLocation"("venueId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitDesignator_name_key" ON "UnitDesignator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_name_key" ON "Hospital"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StandbyLog_eventId_key" ON "StandbyLog"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "StandbyPersonnel_standbyId_memberId_key" ON "StandbyPersonnel"("standbyId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "StandbyUnit_standbyId_name_key" ON "StandbyUnit"("standbyId", "name");

-- CreateIndex
CREATE INDEX "UnitAssignment_unitId_idx" ON "UnitAssignment"("unitId");

-- CreateIndex
CREATE INDEX "UnitAssignment_personnelId_idx" ON "UnitAssignment"("personnelId");

-- CreateIndex
CREATE INDEX "Encounter_standbyId_idx" ON "Encounter"("standbyId");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_standbyId_sequence_key" ON "Encounter"("standbyId", "sequence");

-- CreateIndex
CREATE INDEX "StandbyTimelineEntry_standbyId_at_idx" ON "StandbyTimelineEntry"("standbyId", "at");

-- AddForeignKey
ALTER TABLE "VenueLocation" ADD CONSTRAINT "VenueLocation_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyLog" ADD CONSTRAINT "StandbyLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyLog" ADD CONSTRAINT "StandbyLog_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyLog" ADD CONSTRAINT "StandbyLog_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyLog" ADD CONSTRAINT "StandbyLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyPersonnel" ADD CONSTRAINT "StandbyPersonnel_standbyId_fkey" FOREIGN KEY ("standbyId") REFERENCES "StandbyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyPersonnel" ADD CONSTRAINT "StandbyPersonnel_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyPersonnel" ADD CONSTRAINT "StandbyPersonnel_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyPersonnel" ADD CONSTRAINT "StandbyPersonnel_removedById_fkey" FOREIGN KEY ("removedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyUnit" ADD CONSTRAINT "StandbyUnit_standbyId_fkey" FOREIGN KEY ("standbyId") REFERENCES "StandbyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyUnit" ADD CONSTRAINT "StandbyUnit_designatorId_fkey" FOREIGN KEY ("designatorId") REFERENCES "UnitDesignator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyUnit" ADD CONSTRAINT "StandbyUnit_currentLocationId_fkey" FOREIGN KEY ("currentLocationId") REFERENCES "VenueLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyUnit" ADD CONSTRAINT "StandbyUnit_stagingLocationId_fkey" FOREIGN KEY ("stagingLocationId") REFERENCES "VenueLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyUnit" ADD CONSTRAINT "StandbyUnit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAssignment" ADD CONSTRAINT "UnitAssignment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StandbyUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAssignment" ADD CONSTRAINT "UnitAssignment_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "StandbyPersonnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_standbyId_fkey" FOREIGN KEY ("standbyId") REFERENCES "StandbyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StandbyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_runNumberId_fkey" FOREIGN KEY ("runNumberId") REFERENCES "RunNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "VenueLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyTimelineEntry" ADD CONSTRAINT "StandbyTimelineEntry_standbyId_fkey" FOREIGN KEY ("standbyId") REFERENCES "StandbyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandbyTimelineEntry" ADD CONSTRAINT "StandbyTimelineEntry_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
