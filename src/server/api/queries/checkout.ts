import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

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
    },
  });
  return order;
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
