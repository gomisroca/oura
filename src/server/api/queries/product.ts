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
      sport: { select: { name: true, id: true } },
      category: { select: { name: true, id: true } },
      subcategory: { select: { name: true, id: true } },
      sales: true,
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

// Update Product
export const updateProduct = async ({
  prisma,
  productId,
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
  productId: string;
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
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    return null;
  }
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name: name,
      description: description,
      basePrice: basePrice,
      onSalePrice: onSalePrice,
      gender: gender,
      subcategoryId: subcategoryId,
      categoryId: categoryId,
      sportId: sportId,
      image: imageLink ?? product.image,
    },
  });
  return updatedProduct;
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

// Update Product Sizes
export const updateSizes = async ({
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
  // Fetch existing sizes from the database
  const existingSizes = await prisma.size.findMany({
    where: { productId },
  });

  // Get the names of existing sizes
  const existingSizeNames = existingSizes.map((size) => size.name);

  // Identify sizes to create and sizes to keep
  const sizesToCreate = inventory.filter((size) => !existingSizeNames.includes(size.name));
  const sizesToKeep = inventory.map((size) => size.name);

  // Create new sizes if they don't already exist
  if (sizesToCreate.length > 0) {
    await prisma.size.createMany({
      data: sizesToCreate.map((size) => ({
        productId,
        name: size.name,
      })),
    });
  }

  // Delete sizes that are no longer in the new inventory
  const sizesToDelete = existingSizes.filter((size) => !sizesToKeep.includes(size.name));

  if (sizesToDelete.length > 0) {
    await prisma.size.deleteMany({
      where: {
        productId,
        name: {
          in: sizesToDelete.map((size) => size.name),
        },
      },
    });
  }

  // Fetch and return the updated sizes
  const updatedSizes = await prisma.size.findMany({
    where: { productId },
  });

  return updatedSizes;
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

// Update Product Color
export const updateColors = async ({
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
  // Get all existing colors for the provided sizes
  const existingColors = await prisma.color.findMany({
    where: {
      sizeId: {
        in: sizes.map((size) => size.id),
      },
    },
  });

  // Create a mapping of size names to size IDs
  const sizeMap = sizes.reduce(
    (acc, size) => {
      acc[size.name] = size.id;
      return acc;
    },
    {} as Record<string, string>
  );

  // Track which colors to create, update, or delete
  const colorsToCreate: Prisma.ColorCreateManyInput[] = [];
  const colorsToUpdate: { id: string; data: Prisma.ColorUpdateInput }[] = [];
  const colorsToDelete: string[] = [];

  // Create a set to track existing color names for easy lookup
  const existingColorSet = new Set(existingColors.map((color) => `${color.sizeId}-${color.name}`));

  // Compare new inventory with existing colors
  inventory.forEach((size) => {
    size.colors.forEach((color) => {
      const sizeId = sizeMap[size.name];
      const colorIdentifier = `${sizeId}-${color.name}`;

      if (existingColorSet.has(colorIdentifier)) {
        // Color exists, so we update its stock
        const existingColor = existingColors.find((c) => c.sizeId === sizeId && c.name === color.name);
        if (existingColor?.stock !== color.stock) {
          colorsToUpdate.push({
            id: existingColor!.id,
            data: { stock: color.stock },
          });
        }
        // Remove from set to know what colors are not in the new inventory (those will be deleted)
        existingColorSet.delete(colorIdentifier);
      } else {
        // Color doesn't exist, so we create it
        colorsToCreate.push({
          sizeId: sizeId!,
          name: color.name,
          stock: color.stock,
        });
      }
    });
  });

  // Remaining colors in the set are those that are not in the new inventory, so they should be deleted
  existingColors.forEach((color) => {
    const colorIdentifier = `${color.sizeId}-${color.name}`;
    if (existingColorSet.has(colorIdentifier)) {
      colorsToDelete.push(color.id);
    }
  });

  // Create new colors
  if (colorsToCreate.length > 0) {
    await prisma.color.createMany({
      data: colorsToCreate,
    });
  }

  // Update existing colors
  for (const update of colorsToUpdate) {
    await prisma.color.update({
      where: { id: update.id },
      data: update.data,
    });
  }

  // Delete removed colors
  if (colorsToDelete.length > 0) {
    await prisma.color.deleteMany({
      where: {
        id: { in: colorsToDelete },
      },
    });
  }
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

// Delete Product
export const deleteProduct = async ({
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
  await prisma.product.delete({
    where: { id: id },
  });
};
