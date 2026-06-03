-- DropIndex
DROP INDEX "Disease_name_key";

-- DropIndex
DROP INDEX "Disease_slug_key";

-- AlterTable
ALTER TABLE "Disease" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';
