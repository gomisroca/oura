/*
  Warnings:

  - You are about to drop the column `admin` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'EDITOR', 'SUPER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "admin",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BASIC';
