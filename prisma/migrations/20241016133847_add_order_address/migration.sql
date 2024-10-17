-- CreateTable
CREATE TABLE "OrderAdress" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderAdress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderAdress_orderId_key" ON "OrderAdress"("orderId");

-- AddForeignKey
ALTER TABLE "OrderAdress" ADD CONSTRAINT "OrderAdress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
