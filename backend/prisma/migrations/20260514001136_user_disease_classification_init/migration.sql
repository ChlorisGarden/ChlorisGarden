-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "scientificName" TEXT,
    "description" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "diseaseId" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_name_key" ON "Disease"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_slug_key" ON "Disease"("slug");

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE SET NULL ON UPDATE CASCADE;
