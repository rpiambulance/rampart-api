-- AlterTable
ALTER TABLE "FuelLogEntry" ADD COLUMN     "vehicleId" INTEGER;

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "plate" TEXT,
    "vin" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_name_key" ON "Vehicle"("name");

-- AddForeignKey
ALTER TABLE "FuelLogEntry" ADD CONSTRAINT "FuelLogEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

