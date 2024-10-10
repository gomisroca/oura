import { type GENDER, type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

// Get Unique Product
export const getUniqueProduct = async ({
  prisma,
  productId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  productId: string;
}) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      sizes: {
        include: {
          colors: true,
        },
      },
    },
  });
  return product;
};

// Get All Products
export const getProducts = async ({
  prisma,
  gender,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  gender?: GENDER;
}) => {
  const currentTime = new Date();

  const products = await prisma.product.findMany({
    where: {
      gender: gender ? { has: gender } : undefined,
    },
    include: {
      sizes: {
        include: {
          colors: true,
        },
      },
      sport: { select: { name: true, id: true } },
      category: { select: { name: true, id: true } },
      subcategory: { select: { name: true, id: true } },
      sales: {
        where: {
          sale: {
            startDate: {
              lte: currentTime,
            },
            endDate: {
              gte: currentTime,
            },
          },
        },
      },
    },
  });

  return products;
};

// Get Products by Sport
export const getProductsbySport = async ({
  prisma,
  sportId,
  gender,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  sportId: number;
  gender?: GENDER;
}) => {
  const currentTime = new Date();

  const products = await prisma.product.findMany({
    where: {
      sportId: sportId,
      gender: gender ? { has: gender } : undefined,
    },
    include: {
      sizes: { include: { colors: true } },
      sport: { select: { name: true, id: true } },
      category: { select: { name: true, id: true } },
      subcategory: { select: { name: true, id: true } },
      sales: {
        where: {
          sale: {
            startDate: {
              lte: currentTime,
            },
            endDate: {
              gte: currentTime,
            },
          },
        },
      },
    },
  });

  return products;
};

// Get Products by Category
export const getProductsbyCategory = async ({
  prisma,
  categoryId,
  gender,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  categoryId: number;
  gender?: GENDER;
}) => {
  const currentTime = new Date();

  const products = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      gender: gender ? { has: gender } : undefined,
    },
    include: {
      sizes: { include: { colors: true } },
      sport: { select: { name: true, id: true } },
      category: { select: { name: true, id: true } },
      subcategory: { select: { name: true, id: true } },
      sales: {
        where: {
          sale: {
            startDate: {
              lte: currentTime,
            },
            endDate: {
              gte: currentTime,
            },
          },
        },
      },
    },
  });

  return products;
};

// Get Products by Subcategory
export const getProductsbySubcategory = async ({
  prisma,
  subcategoryId,
  gender,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  subcategoryId: number;
  gender?: GENDER;
}) => {
  const currentTime = new Date();

  const products = await prisma.product.findMany({
    where: {
      subcategoryId: subcategoryId,
      gender: gender ? { has: gender } : undefined,
    },
    include: {
      sizes: { include: { colors: true } },
      sport: { select: { name: true, id: true } },
      category: { select: { name: true, id: true } },
      subcategory: { select: { name: true, id: true } },
      sales: {
        where: {
          sale: {
            startDate: {
              lte: currentTime,
            },
            endDate: {
              gte: currentTime,
            },
          },
        },
      },
    },
  });

  return products;
};

// Get Unique Color
export const getUniqueColor = async ({
  prisma,
  colorId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  colorId: string;
}) => {
  const color = await prisma.color.findUnique({
    where: { id: colorId },
  });
  return color;
};

// Create Product
export const createProduct = async ({
  prisma,
  name,
  description,
  basePrice,
  onSalePrice,
  gender,
  subcategoryId,
  categoryId,
  sportId,
  imageLink,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  name: string;
  description: string;
  basePrice: number;
  onSalePrice: number;
  gender: GENDER[];
  subcategoryId: number;
  categoryId: number;
  sportId: number;
  imageLink?: string;
}) => {
  const product = await prisma.product.create({
    data: {
      name: name,
      description: description,
      basePrice: basePrice,
      onSalePrice: onSalePrice,
      gender: gender,
      subcategoryId: subcategoryId,
      categoryId: categoryId,
      sportId: sportId,
      image: imageLink,
    },
  });
  return product;
};

// Create Product Sizes
export const createSizes = async ({
  prisma,
  productId,
  inventory,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  productId: string;
  inventory: {
    name: string;
    colors: {
      name: string;
      stock: number;
    }[];
  }[];
}) => {
  const sizes = await prisma.size.createManyAndReturn({
    data: inventory.map((size) => ({ productId: productId, name: size.name })),
  });
  return sizes;
};

// Create Product Color
export const createColors = async ({
  prisma,
  sizes,
  inventory,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  sizes: {
    id: string;
    name: string;
    productId: string;
  }[];
  inventory: {
    name: string;
    colors: {
      name: string;
      stock: number;
    }[];
  }[];
}) => {
  await prisma.color.createMany({
    data: inventory.flatMap((size) =>
      size.colors.map((color) => ({
        sizeId: sizes.find((s) => s.name === size.name)!.id,
        name: color.name,
        stock: color.stock,
      }))
    ),
  });
};

// Update Product Sales
export const updateProductSales = async ({
  prisma,
  productId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  productId: string;
}) => {
  const product = await prisma.product.update({
    where: { id: productId },
    data: { amountSold: { increment: 1 } },
  });
  return product;
};

// Update Color Stock
export const updateColorStock = async ({
  prisma,
  colorId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  colorId: string;
}) => {
  const color = await prisma.color.update({
    where: { id: colorId },
    data: { stock: { decrement: 1 } },
  });
  return color;
};

// Update Product Visits
export const updateProductVisits = async ({
  prisma,
  productId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  productId: string;
}) => {
  const currentTime = new Date();
  const product = await prisma.product.update({
    where: { id: productId },
    data: { views: { increment: 1 } },
    include: {
      sizes: { include: { colors: true } },
      sport: { select: { name: true, id: true } },
      category: { select: { name: true, id: true } },
      subcategory: { select: { name: true, id: true } },
      sales: {
        where: {
          sale: {
            startDate: {
              lte: currentTime,
            },
            endDate: {
              gte: currentTime,
            },
          },
        },
      },
    },
  });
  return product;
};
