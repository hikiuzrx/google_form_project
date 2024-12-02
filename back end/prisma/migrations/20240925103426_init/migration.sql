/*
  Warnings:

  - A unique constraint covering the columns `[method]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RM" AS ENUM ('Google', 'Local');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "method" "RM" NOT NULL DEFAULT 'Local';

-- CreateIndex
CREATE UNIQUE INDEX "User_method_key" ON "User"("method");
