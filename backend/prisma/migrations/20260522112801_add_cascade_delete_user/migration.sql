-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_userId_fkey";

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
