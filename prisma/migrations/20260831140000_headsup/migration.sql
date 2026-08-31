-- CreateTable
CREATE TABLE "HeadsupLink" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "lastSeenAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedById" INTEGER,

    CONSTRAINT "HeadsupLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadsupNote" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "removedAt" TIMESTAMP(3),
    "removedById" INTEGER,

    CONSTRAINT "HeadsupNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchMishap" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "removedAt" TIMESTAMP(3),
    "removedById" INTEGER,

    CONSTRAINT "DispatchMishap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadsupCounterReset" (
    "id" SERIAL NOT NULL,
    "counter" TEXT NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetById" INTEGER,
    "previousCount" INTEGER NOT NULL,

    CONSTRAINT "HeadsupCounterReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeadsupLink_token_key" ON "HeadsupLink"("token");

-- CreateIndex
CREATE INDEX "HeadsupNote_removedAt_idx" ON "HeadsupNote"("removedAt");

-- CreateIndex
CREATE INDEX "DispatchMishap_occurredAt_idx" ON "DispatchMishap"("occurredAt");

-- CreateIndex
CREATE INDEX "HeadsupCounterReset_counter_resetAt_idx" ON "HeadsupCounterReset"("counter", "resetAt");

-- AddForeignKey
ALTER TABLE "HeadsupLink" ADD CONSTRAINT "HeadsupLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadsupLink" ADD CONSTRAINT "HeadsupLink_revokedById_fkey" FOREIGN KEY ("revokedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadsupNote" ADD CONSTRAINT "HeadsupNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadsupNote" ADD CONSTRAINT "HeadsupNote_removedById_fkey" FOREIGN KEY ("removedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchMishap" ADD CONSTRAINT "DispatchMishap_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchMishap" ADD CONSTRAINT "DispatchMishap_removedById_fkey" FOREIGN KEY ("removedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadsupCounterReset" ADD CONSTRAINT "HeadsupCounterReset_resetById_fkey" FOREIGN KEY ("resetById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
