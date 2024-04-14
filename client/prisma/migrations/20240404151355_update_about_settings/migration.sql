/*
  Warnings:

  - Added the required column `image` to the `AboutSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `AboutValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AboutSettings" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AboutValue" ADD COLUMN     "icon" TEXT NOT NULL;
