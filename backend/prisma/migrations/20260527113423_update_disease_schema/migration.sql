-- Hapus tabel lama beserta relasinya
TRUNCATE TABLE "Classification" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Disease" RESTART IDENTITY CASCADE;

-- Hapus kolom lama yang berubah tipe
ALTER TABLE "Disease" DROP COLUMN "symptoms";
ALTER TABLE "Disease" DROP COLUMN "treatment";

-- Tambah kolom baru
ALTER TABLE "Disease" ADD COLUMN "symptoms" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Disease" ADD COLUMN "treatment" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Disease" ADD COLUMN "preventiveMeasures" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Disease" ADD COLUMN "rootCauses" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Disease" ADD COLUMN "severity" TEXT NOT NULL DEFAULT 'low';

-- Hapus default setelah kolom dibuat
ALTER TABLE "Disease" ALTER COLUMN "symptoms" DROP DEFAULT;
ALTER TABLE "Disease" ALTER COLUMN "treatment" DROP DEFAULT;
ALTER TABLE "Disease" ALTER COLUMN "preventiveMeasures" DROP DEFAULT;
ALTER TABLE "Disease" ALTER COLUMN "rootCauses" DROP DEFAULT;
ALTER TABLE "Disease" ALTER COLUMN "severity" DROP DEFAULT;