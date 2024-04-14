/*
  Warnings:

  - You are about to drop the `AboutPartner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AboutValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AboutPartner" DROP CONSTRAINT "AboutPartner_aboutId_fkey";

-- DropForeignKey
ALTER TABLE "AboutValue" DROP CONSTRAINT "AboutValue_aboutId_fkey";

-- DropTable
DROP TABLE "AboutPartner";

-- DropTable
DROP TABLE "AboutValue";
