import { type Prisma, type PrismaClient } from 'generated/prisma';
import { type DefaultArgs } from 'generated/prisma/runtime/library';

// Get existing Cart
export const getCart = async ({
  prisma,
  userId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  userId: string;
}) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: userId },
    include: {
      products: {
        include: {
          product: true,
          size: true,
          color: true,
        },
      },
    },
  });
  return cart;
};

// Create initial user Cart
export const createCart = async ({
  prisma,
  userId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  userId: string;
}) => {
  const cart = await prisma.cart.create({
    data: {
      userId: userId,
    },
    include: {
      products: {
        include: {
          product: true,
          size: true,
          color: true,
        },
      },
    },
  });
  return cart;
};

// Update Cart with a new Product
export const addProductToCart = async ({
  prisma,
  cartId,
  input,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  cartId: string;
  input: {
    price: number;
    productId: string;
    sizeId: string;
    colorId: string;
  };
}) => {
  const updatedCart = await prisma.cart.update({
    where: { id: cartId },
    data: {
      products: {
        create: {
          price: input.price,
          product: { connect: { id: input.productId } },
          size: { connect: { id: input.sizeId } },
          color: { connect: { id: input.colorId } },
        },
      },
    },
  });

  return updatedCart;
};

// Remove Product from Cart
export const removeProductFromCart = async ({
  prisma,
  cartId,
  productId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  cartId: string;
  productId: number;
}) => {
  const updatedCart = await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      products: {
        delete: {
          id: productId,
        },
      },
    },
  });

  return updatedCart;
};
