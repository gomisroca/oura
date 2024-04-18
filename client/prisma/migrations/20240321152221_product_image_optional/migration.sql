/*
  Warnings:

  - You are about to drop the `_ProductToProductSize` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `ProductSize` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProductToProductSize" DROP CONSTRAINT "_ProductToProductSize_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToProductSize" DROP CONSTRAINT "_ProductToProductSize_B_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductSize" ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProductToProductSize";

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
