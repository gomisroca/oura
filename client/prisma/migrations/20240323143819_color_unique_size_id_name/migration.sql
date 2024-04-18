/*
  Warnings:

  - A unique constraint covering the columns `[sizeId,name]` on the table `SizeColor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SizeColor_sizeId_name_key" ON "SizeColor"("sizeId", "name");
