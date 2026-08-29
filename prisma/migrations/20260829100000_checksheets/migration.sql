-- Checksheets: the routine checks of trucks, bags and gear.
--
-- Assets are separate from vehicles because most of what gets checked is not
-- a vehicle, while the ones that are should not be entered twice.
--
-- Deficiencies live outside the run that found them, so the same missing item
-- reported on four nights is one problem with four sightings rather than four
-- problems nobody can close.

-- CreateEnum
CREATE TYPE "ChecksheetItemKind" AS ENUM ('PRESENCE', 'PAR');

-- CreateEnum
CREATE TYPE "ExpiryTracking" AS ENUM ('NONE', 'SINGLE', 'PER_UNIT');

-- CreateEnum
CREATE TYPE "ChecksheetCadence" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "AssetKind" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AssetKind_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "kindId" INTEGER NOT NULL,
    "vehicleId" INTEGER,
    "identifier" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecksheetTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "assetKindId" INTEGER,
    "cadence" "ChecksheetCadence" NOT NULL DEFAULT 'NONE',
    "expiryWarningDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecksheetTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecksheetSection" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ChecksheetSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecksheetItem" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "sectionId" INTEGER,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    "kind" "ChecksheetItemKind" NOT NULL DEFAULT 'PRESENCE',
    "parLevel" INTEGER,
    "expiryTracking" "ExpiryTracking" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "ChecksheetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecksheetRun" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "assetId" INTEGER,
    "completedById" INTEGER,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,

    CONSTRAINT "ChecksheetRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecksheetEntry" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "present" BOOLEAN,
    "countPresent" INTEGER,
    "note" TEXT,

    CONSTRAINT "ChecksheetEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecksheetExpiry" (
    "id" SERIAL NOT NULL,
    "entryId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATE NOT NULL,

    CONSTRAINT "ChecksheetExpiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecksheetDeficiency" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "assetId" INTEGER,
    "openedRunId" INTEGER NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detail" TEXT NOT NULL,
    "expected" INTEGER,
    "found" INTEGER,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" INTEGER,
    "resolvedRunId" INTEGER,
    "resolutionNote" TEXT,

    CONSTRAINT "ChecksheetDeficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChecksheetNotifyRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChecksheetNotifyRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetKind_name_key" ON "AssetKind"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_vehicleId_key" ON "Asset"("vehicleId");

-- CreateIndex
CREATE INDEX "Asset_active_idx" ON "Asset"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_kindId_name_key" ON "Asset"("kindId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ChecksheetTemplate_name_key" ON "ChecksheetTemplate"("name");

-- CreateIndex
CREATE INDEX "ChecksheetSection_templateId_idx" ON "ChecksheetSection"("templateId");

-- CreateIndex
CREATE INDEX "ChecksheetItem_templateId_idx" ON "ChecksheetItem"("templateId");

-- CreateIndex
CREATE INDEX "ChecksheetItem_sectionId_idx" ON "ChecksheetItem"("sectionId");

-- CreateIndex
CREATE INDEX "ChecksheetRun_templateId_completedAt_idx" ON "ChecksheetRun"("templateId", "completedAt");

-- CreateIndex
CREATE INDEX "ChecksheetRun_assetId_completedAt_idx" ON "ChecksheetRun"("assetId", "completedAt");

-- CreateIndex
CREATE INDEX "ChecksheetEntry_itemId_idx" ON "ChecksheetEntry"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ChecksheetEntry_runId_itemId_key" ON "ChecksheetEntry"("runId", "itemId");

-- CreateIndex
CREATE INDEX "ChecksheetExpiry_entryId_idx" ON "ChecksheetExpiry"("entryId");

-- CreateIndex
CREATE INDEX "ChecksheetExpiry_expiresAt_idx" ON "ChecksheetExpiry"("expiresAt");

-- CreateIndex
CREATE INDEX "ChecksheetDeficiency_resolvedAt_idx" ON "ChecksheetDeficiency"("resolvedAt");

-- CreateIndex
CREATE INDEX "ChecksheetDeficiency_assetId_resolvedAt_idx" ON "ChecksheetDeficiency"("assetId", "resolvedAt");

-- CreateIndex
CREATE INDEX "_ChecksheetNotifyRoles_B_index" ON "_ChecksheetNotifyRoles"("B");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_kindId_fkey" FOREIGN KEY ("kindId") REFERENCES "AssetKind"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetTemplate" ADD CONSTRAINT "ChecksheetTemplate_assetKindId_fkey" FOREIGN KEY ("assetKindId") REFERENCES "AssetKind"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetSection" ADD CONSTRAINT "ChecksheetSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecksheetTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetItem" ADD CONSTRAINT "ChecksheetItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecksheetTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetItem" ADD CONSTRAINT "ChecksheetItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ChecksheetSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetRun" ADD CONSTRAINT "ChecksheetRun_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecksheetTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetRun" ADD CONSTRAINT "ChecksheetRun_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetRun" ADD CONSTRAINT "ChecksheetRun_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetEntry" ADD CONSTRAINT "ChecksheetEntry_runId_fkey" FOREIGN KEY ("runId") REFERENCES "ChecksheetRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetEntry" ADD CONSTRAINT "ChecksheetEntry_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ChecksheetItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetExpiry" ADD CONSTRAINT "ChecksheetExpiry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ChecksheetEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetDeficiency" ADD CONSTRAINT "ChecksheetDeficiency_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecksheetTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetDeficiency" ADD CONSTRAINT "ChecksheetDeficiency_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ChecksheetItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetDeficiency" ADD CONSTRAINT "ChecksheetDeficiency_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetDeficiency" ADD CONSTRAINT "ChecksheetDeficiency_openedRunId_fkey" FOREIGN KEY ("openedRunId") REFERENCES "ChecksheetRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetDeficiency" ADD CONSTRAINT "ChecksheetDeficiency_resolvedRunId_fkey" FOREIGN KEY ("resolvedRunId") REFERENCES "ChecksheetRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetDeficiency" ADD CONSTRAINT "ChecksheetDeficiency_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChecksheetNotifyRoles" ADD CONSTRAINT "_ChecksheetNotifyRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "ChecksheetTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChecksheetNotifyRoles" ADD CONSTRAINT "_ChecksheetNotifyRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

