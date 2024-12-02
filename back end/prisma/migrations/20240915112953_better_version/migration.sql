/*
  Warnings:

  - Added the required column `type` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('SimpleQuestion', 'QCM', 'MultyQCM');

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "content" TEXT[];

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "options" TEXT[],
ADD COLUMN     "type" "Type" NOT NULL;
