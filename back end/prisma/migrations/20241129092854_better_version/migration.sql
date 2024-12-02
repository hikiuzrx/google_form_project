/*
  Warnings:

  - You are about to drop the column `typRId` on the `Forms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[typicalResponseId]` on the table `Forms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Forms" DROP CONSTRAINT "Forms_typRId_fkey";

-- DropIndex
DROP INDEX "Answer_number_key";

-- DropIndex
DROP INDEX "Forms_typRId_key";

-- DropIndex
DROP INDEX "Question_number_key";

-- DropIndex
DROP INDEX "Response_ownerId_key";

-- AlterTable
ALTER TABLE "Forms" DROP COLUMN "typRId",
ADD COLUMN     "typicalResponseId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Forms_typicalResponseId_key" ON "Forms"("typicalResponseId");

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_typicalResponseId_fkey" FOREIGN KEY ("typicalResponseId") REFERENCES "Response"("responseId") ON DELETE SET NULL ON UPDATE CASCADE;
