-- A certification document's id addresses somebody's personal paperwork, so
-- it stops being a sequence anyone can count through. Existing rows keep
-- their file, and are given a random id in the same format Prisma will
-- generate for new ones. Nothing references this table, so there are no
-- foreign keys to carry across.

ALTER TABLE "CertificationDocument" ADD COLUMN "uuid" TEXT;

UPDATE "CertificationDocument" SET "uuid" = gen_random_uuid()::text;

ALTER TABLE "CertificationDocument" ALTER COLUMN "uuid" SET NOT NULL;

ALTER TABLE "CertificationDocument" DROP CONSTRAINT "CertificationDocument_pkey";
ALTER TABLE "CertificationDocument" DROP COLUMN "id";
ALTER TABLE "CertificationDocument" RENAME COLUMN "uuid" TO "id";
ALTER TABLE "CertificationDocument" ADD CONSTRAINT "CertificationDocument_pkey" PRIMARY KEY ("id");
