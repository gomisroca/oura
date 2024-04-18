/*
  Warnings:

  - You are about to drop the column `category` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `subtype` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ProductCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[size]` on the table `ProductSize` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `ProductSize` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sizeId]` on the table `SizeColor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_productId_fkey";

-- DropIndex
DROP INDEX "ProductCategory_productId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "category",
DROP COLUMN "productId",
DROP COLUMN "subcategory",
DROP COLUMN "subtype",
DROP COLUMN "type",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "parentCategoryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProductSize_size_key" ON "ProductSize"("size");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSize_productId_key" ON "ProductSize"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SizeColor_sizeId_key" ON "SizeColor"("sizeId");

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
