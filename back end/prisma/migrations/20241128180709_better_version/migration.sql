-- DropForeignKey
ALTER TABLE "Forms" DROP CONSTRAINT "Forms_typRId_fkey";

-- AlterTable
ALTER TABLE "Forms" ALTER COLUMN "typRId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_typRId_fkey" FOREIGN KEY ("typRId") REFERENCES "Response"("responseId") ON DELETE SET NULL ON UPDATE CASCADE;
