-- CreateTable
CREATE TABLE "CertificationSupersession" (
    "higherTypeId" INTEGER NOT NULL,
    "lowerTypeId" INTEGER NOT NULL,

    CONSTRAINT "CertificationSupersession_pkey" PRIMARY KEY ("higherTypeId","lowerTypeId")
);

-- CreateIndex
CREATE INDEX "CertificationSupersession_lowerTypeId_idx" ON "CertificationSupersession"("lowerTypeId");

-- AddForeignKey
ALTER TABLE "CertificationSupersession" ADD CONSTRAINT "CertificationSupersession_higherTypeId_fkey" FOREIGN KEY ("higherTypeId") REFERENCES "CertificationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationSupersession" ADD CONSTRAINT "CertificationSupersession_lowerTypeId_fkey" FOREIGN KEY ("lowerTypeId") REFERENCES "CertificationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
