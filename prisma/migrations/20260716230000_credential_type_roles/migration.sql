-- CreateTable
CREATE TABLE "CredentialTypeRole" (
    "credentialTypeId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "CredentialTypeRole_pkey" PRIMARY KEY ("credentialTypeId","roleId")
);

-- AddForeignKey
ALTER TABLE "CredentialTypeRole" ADD CONSTRAINT "CredentialTypeRole_credentialTypeId_fkey" FOREIGN KEY ("credentialTypeId") REFERENCES "CredentialType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialTypeRole" ADD CONSTRAINT "CredentialTypeRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

