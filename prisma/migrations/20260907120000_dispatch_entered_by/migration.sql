-- AlterTable
ALTER TABLE "Dispatch" ADD COLUMN     "enteredById" INTEGER;

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_enteredById_fkey" FOREIGN KEY ("enteredById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
