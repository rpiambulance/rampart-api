-- A preferred first name alongside the legal one.
--
-- firstName keeps its meaning and its name: it is the legal one, referenced
-- in a hundred places, and renaming it would be a large change for no gain.
-- What is new is the one people actually go by.

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "preferredFirstName" TEXT;
