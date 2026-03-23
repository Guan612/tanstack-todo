/*
  Warnings:

  - You are about to drop the column `context` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "context",
ADD COLUMN     "description" TEXT;
