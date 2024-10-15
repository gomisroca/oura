import { type GENDER, type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

// Get unique Sale
export const getUniqueSale = async ({
  prisma,
  saleId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  saleId: string;
}) => {
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  return sale;
};

// Get all Sales
export const getAllSales = async ({
  prisma,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
}) => {
  const sales = await prisma.sale.findMany();

  return sales;
};

// Get ongoing Sale
export const getOngoingSale = async ({
  prisma,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
}) => {
  const currentTime = new Date();

  const sale = await prisma.sale.findFirst({
    where: {
      startDate: {
        lte: currentTime,
      },
      endDate: {
        gte: currentTime,
      },
    },
  });

  return sale;
};

// Get ongoing Sale with full product details
export const getOngoingSaleWithDetails = async ({
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

  const sale = await prisma.sale.findFirst({
    where: {
      startDate: {
        lte: currentTime,
      },
      endDate: {
        gte: currentTime,
      },
    },
    include: {
      products: {
        where: {
          product: {
            gender: gender ? { has: gender } : undefined,
          },
        },
        include: {
          product: {
            include: {
              sizes: {
                include: {
                  colors: true,
                },
              },
              sport: { select: { name: true, id: true } },
              category: { select: { name: true, id: true } },
              subcategory: { select: { name: true, id: true } },
              sales: true,
            },
          },
        },
      },
    },
  });

  return sale;
};

// Get products on sale by sport
export const getProductsOnSaleBySport = async ({
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

  const sale = await prisma.sale.findFirst({
    where: {
      startDate: {
        lte: currentTime,
      },
      endDate: {
        gte: currentTime,
      },
    },
    include: {
      products: {
        where: {
          product: {
            sportId: sportId,
            gender: gender ? { has: gender } : undefined,
          },
        },
        include: {
          product: {
            include: {
              sizes: {
                include: {
                  colors: true,
                },
              },
              sport: { select: { name: true, id: true } },
              category: { select: { name: true, id: true } },
              subcategory: { select: { name: true, id: true } },
              sales: true,
            },
          },
        },
      },
    },
  });

  return sale;
};

// Get products on sale by category
export const getProductsOnSaleByCategory = async ({
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

  const sale = await prisma.sale.findFirst({
    where: {
      startDate: {
        lte: currentTime,
      },
      endDate: {
        gte: currentTime,
      },
    },
    include: {
      products: {
        where: {
          product: {
            categoryId: categoryId,
            gender: gender ? { has: gender } : undefined,
          },
        },
        include: {
          product: {
            include: {
              sizes: {
                include: {
                  colors: true,
                },
              },
              sport: { select: { name: true, id: true } },
              category: { select: { name: true, id: true } },
              subcategory: { select: { name: true, id: true } },
              sales: true,
            },
          },
        },
      },
    },
  });

  return sale;
};

// Get products on sale by subcategory
export const getProductsOnSaleBySubcategory = async ({
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

  const sale = await prisma.sale.findFirst({
    where: {
      startDate: {
        lte: currentTime,
      },
      endDate: {
        gte: currentTime,
      },
    },
    include: {
      products: {
        where: {
          product: {
            subcategoryId: subcategoryId,
            gender: gender ? { has: gender } : undefined,
          },
        },
        include: {
          product: {
            include: {
              sizes: {
                include: {
                  colors: true,
                },
              },
              sport: { select: { name: true, id: true } },
              category: { select: { name: true, id: true } },
              subcategory: { select: { name: true, id: true } },
              sales: true,
            },
          },
        },
      },
    },
  });

  return sale;
};

// Check if there is an overlapping sale
export const checkOverlappingSale = async ({
  prisma,
  startDate,
  endDate,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  startDate: Date;
  endDate: Date;
}) => {
  const currentTime = new Date();

  const sale = await prisma.sale.findFirst({
    where: {
      AND: [
        {
          endDate: {
            gte: currentTime, // Ensure we only check future or ongoing sales
          },
        },
        {
          OR: [
            {
              startDate: {
                lte: endDate, // Overlaps with the new sale's end date
              },
              endDate: {
                gte: startDate, // Overlaps with the new sale's start date
              },
            },
          ],
        },
      ],
    },
  });

  return sale ? true : false;
};

// Create Sale
export const createSale = async ({
  prisma,
  name,
  startDate,
  endDate,
  imageLink,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  name: string;
  startDate: Date;
  endDate: Date;
  imageLink: string;
}) => {
  const sale = await prisma.sale.create({
    data: {
      name: name,
      startDate: startDate,
      endDate: endDate,
      image: imageLink,
    },
  });

  return sale;
};

// Create Sale Product
export const createSaleProduct = async ({
  prisma,
  productId,
  saleId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  productId: string;
  saleId: string;
}) => {
  const sale = await prisma.saleProduct.create({
    data: {
      productId: productId,
      saleId: saleId,
    },
  });

  return sale;
};

// Delete Sale Product
export const deleteSaleProduct = async ({
  prisma,
  saleProductId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  saleProductId: number;
}) => {
  await prisma.saleProduct.delete({
    where: {
      id: saleProductId,
    },
  });
};

// Update Sale
export const updateSale = async ({
  prisma,
  id,
  name,
  startDate,
  endDate,
  imageLink,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  imageLink?: string;
}) => {
  const sale = await prisma.sale.update({
    where: { id: id },
    data: {
      name: name,
      startDate: startDate,
      endDate: endDate,
      image: imageLink,
    },
    include: {
      products: true,
    },
  });

  return sale;
};

// Delete Sale
export const deleteSale = async ({
  prisma,
  id,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  id: string;
}) => {
  await prisma.sale.delete({
    where: { id: id },
  });
};
