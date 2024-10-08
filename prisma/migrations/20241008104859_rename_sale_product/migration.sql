/*
  Warnings:

  - You are about to drop the `ProductOnSale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductOnSale" DROP CONSTRAINT "ProductOnSale_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOnSale" DROP CONSTRAINT "ProductOnSale_saleId_fkey";

-- DropTable
DROP TABLE "ProductOnSale";

-- CreateTable
CREATE TABLE "SaleProduct" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaleProduct" ADD CONSTRAINT "SaleProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleProduct" ADD CONSTRAINT "SaleProduct_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
