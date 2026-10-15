-- CreateTable
CREATE TABLE "_ChecksheetRunCrew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChecksheetRunCrew_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChecksheetRunCrew_B_index" ON "_ChecksheetRunCrew"("B");

-- AddForeignKey
ALTER TABLE "_ChecksheetRunCrew" ADD CONSTRAINT "_ChecksheetRunCrew_A_fkey" FOREIGN KEY ("A") REFERENCES "ChecksheetRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChecksheetRunCrew" ADD CONSTRAINT "_ChecksheetRunCrew_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

