-- CreateTable
CREATE TABLE "AboutValue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "aboutId" TEXT NOT NULL,

    CONSTRAINT "AboutValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "aboutId" TEXT NOT NULL,

    CONSTRAINT "AboutPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutSettings" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AboutSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AboutValue" ADD CONSTRAINT "AboutValue_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "AboutSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutPartner" ADD CONSTRAINT "AboutPartner_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "AboutSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
