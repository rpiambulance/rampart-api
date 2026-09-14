-- Three lists of the same places become one.
--
-- Venue (where a standby is worked), RunNumberLocation (where the numbering
-- counts) and the free text on an event were three answers to "where". They
-- are merged into Place, where the tiers are properties: every place can be
-- an event's location, a place with an abbreviation is a counter, and a
-- place without one files under a place that has it.
--
-- Written by hand rather than generated, because the generated version drops
-- the tables — and with them a counter that is 53 numbers deep and the only
-- record of the agency's numbering history.

-- Venue becomes Place, keeping its ids so every standby still points at the
-- right row.
ALTER TABLE "Venue" RENAME TO "Place";
ALTER TABLE "Place" RENAME CONSTRAINT "Venue_pkey" TO "Place_pkey";
ALTER INDEX "Venue_name_key" RENAME TO "Place_name_key";

ALTER TABLE "Place" ADD COLUMN "abbr" TEXT;
ALTER TABLE "Place" ADD COLUMN "nextRun" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Place" ADD COLUMN "parentId" INTEGER;

-- The counters. A counter whose name already exists as a venue is the same
-- place named twice, so it lands on the existing row rather than beside it.
UPDATE "Place" p
SET "abbr" = l."abbr", "nextRun" = l."nextRun"
FROM "RunNumberLocation" l
WHERE p."name" = l."name";

INSERT INTO "Place" ("name", "active", "abbr", "nextRun", "createdAt")
SELECT l."name", l."active", l."abbr", l."nextRun", CURRENT_TIMESTAMP
FROM "RunNumberLocation" l
WHERE NOT EXISTS (SELECT 1 FROM "Place" p WHERE p."name" = l."name");

-- Numbers already issued keep counting against the same place under its new
-- id. Done before the old table goes, while the abbreviation can still match
-- the two together.
ALTER TABLE "RunNumber" RENAME COLUMN "locationId" TO "placeId";
UPDATE "RunNumber" r
SET "placeId" = p."id"
FROM "RunNumberLocation" l, "Place" p
WHERE r."placeId" = l."id" AND p."abbr" = l."abbr";

-- Everything that is not itself a counter files under one, when there is
-- exactly one to file under. That is the rule as it stands: a standby always
-- resolves to a counter. With several counters an officer says which.
UPDATE "Place"
SET "parentId" = (SELECT "id" FROM "Place" WHERE "abbr" IS NOT NULL LIMIT 1)
WHERE "abbr" IS NULL
  AND (SELECT COUNT(*) FROM "Place" WHERE "abbr" IS NOT NULL) = 1;

ALTER TABLE "RunNumber" DROP CONSTRAINT "RunNumber_locationId_fkey";
DROP TABLE "RunNumberLocation";

-- The spots inside a place.
ALTER TABLE "VenueLocation" RENAME TO "PlaceSpot";
ALTER TABLE "PlaceSpot" RENAME CONSTRAINT "VenueLocation_pkey" TO "PlaceSpot_pkey";
ALTER TABLE "PlaceSpot" RENAME COLUMN "venueId" TO "placeId";
ALTER INDEX "VenueLocation_venueId_name_key" RENAME TO "PlaceSpot_placeId_name_key";

-- A standby is worked at a place.
ALTER TABLE "StandbyLog" RENAME COLUMN "venueId" TO "placeId";
ALTER TABLE "StandbyLog" RENAME COLUMN "venueText" TO "placeText";

-- An event points at one, and keeps its typed text for the one-offs.
ALTER TABLE "Event" ADD COLUMN "placeId" INTEGER;

-- The keys, renamed to match and repointed where the target moved.
ALTER TABLE "PlaceSpot" DROP CONSTRAINT "VenueLocation_venueId_fkey";
ALTER TABLE "PlaceSpot" ADD CONSTRAINT "PlaceSpot_placeId_fkey"
  FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StandbyLog" DROP CONSTRAINT "StandbyLog_venueId_fkey";
ALTER TABLE "StandbyLog" ADD CONSTRAINT "StandbyLog_placeId_fkey"
  FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RunNumber" ADD CONSTRAINT "RunNumber_placeId_fkey"
  FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Place" ADD CONSTRAINT "Place_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "Place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Event" ADD CONSTRAINT "Event_placeId_fkey"
  FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Place_abbr_key" ON "Place"("abbr");
ALTER INDEX "RunNumber_locationId_sequence_idx" RENAME TO "RunNumber_placeId_sequence_idx";
