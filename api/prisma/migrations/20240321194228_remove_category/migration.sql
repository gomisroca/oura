/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategory` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "subcategory" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductCategory";
