-- CreateTable
CREATE TABLE "SeededReference" (
    "kind" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "seededAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeededReference_pkey" PRIMARY KEY ("kind","key")
);
