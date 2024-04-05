/*
  Warnings:

  - Added the required column `sale` to the `HomepageSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleText` to the `HomepageSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HomepageSettings" ADD COLUMN     "sale" BOOLEAN NOT NULL,
ADD COLUMN     "saleText" TEXT NOT NULL;
