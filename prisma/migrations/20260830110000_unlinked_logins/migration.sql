-- Logins that reached Keycloak but match no member.
--
-- Recorded rather than only announced: the auth guard runs on every request,
-- so something has to remember who has already been reported, and an officer
-- needs the address in front of them to link the account.

-- CreateTable
CREATE TABLE "UnlinkedLogin" (
    "id" SERIAL NOT NULL,
    "keycloakSubject" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" INTEGER,
    "resolvedMemberId" INTEGER,

    CONSTRAINT "UnlinkedLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnlinkedLogin_keycloakSubject_key" ON "UnlinkedLogin"("keycloakSubject");

-- CreateIndex
CREATE INDEX "UnlinkedLogin_resolvedAt_idx" ON "UnlinkedLogin"("resolvedAt");

-- AddForeignKey
ALTER TABLE "UnlinkedLogin" ADD CONSTRAINT "UnlinkedLogin_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

