import { type GENDER, type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

// Get Unique Sport
export const getUniqueSport = async ({
  prisma,
  sportName,
  sportId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  sportName?: string;
  sportId?: number;
}) => {
  const sport = await prisma.sport.findFirst({
    where: { name: sportName ?? undefined, id: sportId ?? undefined },
  });
  return sport;
};

// Get All Sports
export const getSports = async ({
  prisma,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
}) => {
  const sports = await prisma.sport.findMany({
    include: {
      categories: {
        include: {
          subcategories: true,
          products: true,
        },
      },
      products: true,
    },
  });
  return sports;
};

// Get Sports by Gender
export const getSportsByGender = async ({
  prisma,
  gender,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}) => {
  const sports = await prisma.sport.findMany({
    where: {
      categories: {
        some: {
          subcategories: {
            some: {
              products: {
                some: {
                  gender: {
                    has: gender,
                  },
                },
              },
            },
          },
        },
      },
    },
    include: {
      products: true,
      categories: {
        where: {
          subcategories: {
            some: {
              products: {
                some: {
                  gender: {
                    has: gender,
                  },
                },
              },
            },
          },
        },
        include: {
          products: true,
          subcategories: {
            where: {
              products: {
                some: {
                  gender: {
                    has: gender,
                  },
                },
              },
            },
            include: {
              products: {
                where: {
                  gender: {
                    has: gender,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return sports;
};

// Get Sports in Sale
export const getSportsInSale = async ({
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
  const sports = await prisma.sport.findMany({
    where: {
      categories: {
        some: {
          subcategories: {
            some: {
              products: {
                some: {
                  sales: {
                    some: {
                      sale: {
                        id: saleId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    include: {
      categories: {
        where: {
          subcategories: {
            some: {
              products: {
                some: {
                  sales: {
                    some: {
                      sale: {
                        id: saleId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          subcategories: {
            where: {
              products: {
                some: {
                  sales: {
                    some: {
                      sale: {
                        id: saleId,
                      },
                    },
                  },
                },
              },
            },
            include: {
              products: {
                where: {
                  sales: {
                    some: {
                      sale: {
                        id: saleId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return sports;
};

// Get Unique Category
export const getUniqueCategory = async ({
  prisma,
  categoryName,
  categoryId,
  sportId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  categoryName?: string;
  categoryId?: number;
  sportId?: number;
}) => {
  const category = await prisma.category.findFirst({
    where: { name: categoryName ?? undefined, sportId: sportId ?? undefined, id: categoryId ?? undefined },
  });
  return category;
};

// Get Categories in Sport
export const getCategoriesInSport = async ({
  prisma,
  sportId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  sportId: number;
}) => {
  const categories = await prisma.category.findMany({
    where: {
      sportId: sportId,
    },
    include: {
      subcategories: true,
    },
  });
  return categories;
};

// Get Unique Subcategory
export const getUniqueSubcategory = async ({
  prisma,
  subcategoryName,
  subcategoryId,
  categoryId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  subcategoryName?: string;
  subcategoryId?: number;
  categoryId?: number;
}) => {
  const subcategory = await prisma.subcategory.findFirst({
    where: { name: subcategoryName ?? undefined, id: subcategoryId ?? undefined, categoryId: categoryId ?? undefined },
    include: { products: true },
  });
  return subcategory;
};

// Get Subcategories in Category
export const getSubcategoriesInCategory = async ({
  prisma,
  categoryId,
  gender,
  sale,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  categoryId: number;
  gender?: GENDER;
  sale?: boolean;
}) => {
  const currentTime = new Date();
  const subcategories = await prisma.subcategory.findMany({
    where: {
      categoryId: categoryId,
      products: {
        some: {
          gender: gender ? { has: gender } : undefined,
          sales: sale
            ? {
                some: {
                  sale: {
                    startDate: {
                      lte: currentTime,
                    },
                    endDate: {
                      gte: currentTime,
                    },
                  },
                },
              }
            : undefined,
        },
      },
    },
  });
  return subcategories;
};

// Create Sport
export const createSport = async ({
  prisma,
  sportName,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  sportName: string;
}) => {
  const sport = await prisma.sport.create({
    data: { name: sportName },
  });
  return sport;
};

// Create Category
export const createCategory = async ({
  prisma,
  categoryName,
  sportId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  categoryName: string;
  sportId: number;
}) => {
  const category = await prisma.category.create({
    data: {
      name: categoryName,
      sportId: sportId,
    },
  });
  return category;
};

// Create Subcategory
export const createSubcategory = async ({
  prisma,
  subcategoryName,
  categoryId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  subcategoryName: string;
  categoryId: number;
}) => {
  const subcategory = await prisma.subcategory.create({
    data: {
      name: subcategoryName,
      categoryId: categoryId,
    },
  });
  return subcategory;
};

// Update Sport
export const updateSport = async ({
  prisma,
  sportId,
  sportName,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  sportId: number;
  sportName: string;
}) => {
  await prisma.sport.update({
    where: {
      id: sportId,
    },
    data: {
      name: sportName,
    },
  });
};

// Update Category
export const updateCategory = async ({
  prisma,
  categoryId,
  categoryName,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  categoryId: number;
  categoryName: string;
}) => {
  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: categoryName,
    },
  });
};

// Update Subcategory
export const updateSubcategory = async ({
  prisma,
  subcategoryId,
  subcategoryName,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  subcategoryId: number;
  subcategoryName: string;
}) => {
  const subcategory = await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      name: subcategoryName,
    },
    include: {
      products: true,
    },
  });
  return subcategory;
};

// Add Product to Subcategory
export const addProductToSubcategory = async ({
  prisma,
  productId,
  subcategoryId,
  categoryId,
  sportId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  productId: string;
  subcategoryId: number;
  categoryId: number;
  sportId: number;
}) => {
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      subcategoryId: subcategoryId,
      categoryId: categoryId,
      sportId: sportId,
    },
  });
};

// Remove Product from Subcategory
export const RemoveProductFromSubcategory = async ({
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
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      subcategoryId: null,
      categoryId: null,
      sportId: null,
    },
  });
};

// Delete Sport
export const deleteSport = async ({
  prisma,
  sportId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  sportId: number;
}) => {
  await prisma.sport.delete({
    where: {
      id: sportId,
    },
  });
};

// Delete Category
export const deleteCategory = async ({
  prisma,
  categoryId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  categoryId: number;
}) => {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

// Delete Subcategory
export const deleteSubcategory = async ({
  prisma,
  subcategoryId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  subcategoryId: number;
}) => {
  await prisma.subcategory.delete({
    where: {
      id: subcategoryId,
    },
  });
};
