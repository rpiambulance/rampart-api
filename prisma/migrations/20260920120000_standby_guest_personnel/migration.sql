-- DropForeignKey
ALTER TABLE "StandbyPersonnel" DROP CONSTRAINT "StandbyPersonnel_memberId_fkey";

-- AlterTable
ALTER TABLE "StandbyPersonnel" ADD COLUMN     "name" TEXT,
ALTER COLUMN "memberId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StandbyPersonnel" ADD CONSTRAINT "StandbyPersonnel_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

