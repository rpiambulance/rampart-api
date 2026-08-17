-- Signing authority becomes a set: holding any one of the named credentials,
-- or anything above it on the ladder, is enough.

-- CreateTable
CREATE TABLE "_ChecklistSignoffLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChecklistSignoffLevel_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE TABLE "_ChecklistItemSignoffLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChecklistItemSignoffLevel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChecklistSignoffLevel_B_index" ON "_ChecklistSignoffLevel"("B");
CREATE INDEX "_ChecklistItemSignoffLevel_B_index" ON "_ChecklistItemSignoffLevel"("B");

-- Carry over the single credential each checklist and item already named.
-- Prisma orders the two sides of an implicit relation alphabetically by model
-- name: CredentialType before EvalFormTemplate, and before EvalFormItem.
INSERT INTO "_ChecklistSignoffLevel" ("A", "B")
SELECT "signoffCredentialTypeId", "id"
FROM "EvalFormTemplate"
WHERE "signoffCredentialTypeId" IS NOT NULL;

INSERT INTO "_ChecklistItemSignoffLevel" ("A", "B")
SELECT "signoffCredentialTypeId", "id"
FROM "EvalFormItem"
WHERE "signoffCredentialTypeId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "EvalFormTemplate" DROP CONSTRAINT IF EXISTS "EvalFormTemplate_signoffCredentialTypeId_fkey";
ALTER TABLE "EvalFormItem" DROP CONSTRAINT IF EXISTS "EvalFormItem_signoffCredentialTypeId_fkey";

-- AlterTable
ALTER TABLE "EvalFormTemplate" DROP COLUMN "signoffCredentialTypeId";
ALTER TABLE "EvalFormItem" DROP COLUMN "signoffCredentialTypeId";

-- AddForeignKey
ALTER TABLE "_ChecklistSignoffLevel" ADD CONSTRAINT "_ChecklistSignoffLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "CredentialType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ChecklistSignoffLevel" ADD CONSTRAINT "_ChecklistSignoffLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "EvalFormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ChecklistItemSignoffLevel" ADD CONSTRAINT "_ChecklistItemSignoffLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "CredentialType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ChecklistItemSignoffLevel" ADD CONSTRAINT "_ChecklistItemSignoffLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "EvalFormItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
