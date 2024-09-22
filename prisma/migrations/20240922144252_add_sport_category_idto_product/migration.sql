/*
  Warnings:

  - The `gender` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "sportId" TEXT,
DROP COLUMN "gender",
ADD COLUMN     "gender" "GENDER"[] DEFAULT ARRAY['MALE', 'FEMALE', 'OTHER']::"GENDER"[];
