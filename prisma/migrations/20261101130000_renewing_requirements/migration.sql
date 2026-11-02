-- Requirements met by something that lapses: a fixed cut-off for everybody,
-- or any session of a class series, each session good for the series' length.
CREATE TABLE "ClassSeries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "validityMonths" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClassSeries_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ClassSeries_name_key" ON "ClassSeries"("name");

ALTER TABLE "TrainingClass" ADD COLUMN "seriesId" INTEGER;
ALTER TABLE "TrainingClass" ADD CONSTRAINT "TrainingClass_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "ClassSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ClassAttendance" ADD COLUMN "completedAt" TIMESTAMP(3);

ALTER TABLE "CredentialRequirement" ADD COLUMN "validThrough" DATE;
ALTER TABLE "CredentialRequirement" ADD COLUMN "classSeriesId" INTEGER;
ALTER TABLE "CredentialRequirement" ADD CONSTRAINT "CredentialRequirement_classSeriesId_fkey" FOREIGN KEY ("classSeriesId") REFERENCES "ClassSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
