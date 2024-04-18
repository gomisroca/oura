-- CreateTable
CREATE TABLE "CategorySettings" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "CategorySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageSettings" (
    "id" TEXT NOT NULL,
    "categories" TEXT[],
    "image" TEXT NOT NULL,

    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavbarSettings" (
    "id" TEXT NOT NULL,
    "categories" TEXT[],

    CONSTRAINT "NavbarSettings_pkey" PRIMARY KEY ("id")
);
