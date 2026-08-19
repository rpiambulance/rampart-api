-- Run numbers for standby events, ported from strng. Each location counts
-- independently, and every issued number is recorded so one on a report can
-- be traced back to who took it and what for.

-- CreateTable
CREATE TABLE "RunNumberLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "nextRun" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RunNumberLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RunNumber" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "division" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "note" TEXT,
    "eventId" INTEGER,
    "issuedById" INTEGER,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RunNumberLocation_abbr_key" ON "RunNumberLocation"("abbr");
CREATE UNIQUE INDEX "RunNumber_number_key" ON "RunNumber"("number");
CREATE INDEX "RunNumber_issuedAt_idx" ON "RunNumber"("issuedAt");
CREATE INDEX "RunNumber_locationId_sequence_idx" ON "RunNumber"("locationId", "sequence");

-- AddForeignKey
ALTER TABLE "RunNumber" ADD CONSTRAINT "RunNumber_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "RunNumberLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RunNumber" ADD CONSTRAINT "RunNumber_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RunNumber" ADD CONSTRAINT "RunNumber_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
