import { type Prisma, type PrismaClient } from 'generated/prisma';
import { type DefaultArgs } from 'generated/prisma/runtime/library';

// Get Order
export const getOrder = async ({
  prisma,
  orderId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  orderId: string;
}) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: {
        include: {
          product: true,
          size: true,
          color: true,
        },
      },
      address: true,
    },
  });
  return order;
};

export const getAllOrders = async ({
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
  const orders = await prisma.order.findMany({
    where: { userId: userId },
    include: {
      products: {
        include: {
          product: true,
          size: true,
          color: true,
        },
      },
      address: true,
    },
  });
  return orders;
};

// Create Order
export const createOrder = async ({
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
  const order = await prisma.order.create({
    data: {
      userId: userId,
    },
  });
  return order;
};

export const createAddress = async ({
  prisma,
  orderId,
  name,
  street,
  postalCode,
  country,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  orderId: string;
  name: string;
  street: string;
  postalCode: string;
  country: string;
}) => {
  const address = await prisma.orderAddress.create({
    data: {
      orderId: orderId,
      name: name,
      street: street,
      postalCode: postalCode,
      country: country,
    },
  });
  return address;
};

// Delete Order
export const deleteOrder = async ({
  prisma,
  orderId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  orderId: string;
}) => {
  await prisma.order.delete({ where: { id: orderId } });
  return true;
};

// Confirm Order
export const confirmOrder = async ({
  prisma,
  orderId,
  sessionId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  orderId: string;
  sessionId: string;
}) => {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      stripeSessionId: sessionId,
      confirmed: true,
    },
    include: {
      products: true,
    },
  });
  return order;
};

// Transfer products from cart to order
export const transferProductsToOrder = async ({
  prisma,
  productId,
  orderId,
}: {
  prisma:
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    | PrismaClient;
  productId: number;
  orderId: string;
}) => {
  const updatedOrder = await prisma.orderProduct.update({
    where: { id: productId },
    data: {
      orderId: orderId,
      cartId: null,
    },
  });

  return updatedOrder;
};
