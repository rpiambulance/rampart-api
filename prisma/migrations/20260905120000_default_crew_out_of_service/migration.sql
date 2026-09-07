-- CreateTable
CREATE TABLE "DefaultCrewOutOfService" (
    "weekday" INTEGER NOT NULL,
    "reason" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "DefaultCrewOutOfService_pkey" PRIMARY KEY ("weekday")
);

-- AddForeignKey
ALTER TABLE "DefaultCrewOutOfService" ADD CONSTRAINT "DefaultCrewOutOfService_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
