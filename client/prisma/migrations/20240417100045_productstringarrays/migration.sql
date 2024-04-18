/*
  Warnings:

  - The `category` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subcategory` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "category" TEXT[],
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT[],
DROP COLUMN "subcategory",
ADD COLUMN     "subcategory" TEXT[];
