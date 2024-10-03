import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

const product = z.object({
  name: z.string().min(1),
  price: z.number().min(0.01),
  productId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
});

export const cartRouter = createTRPCRouter({
  // Add a product to the user's cart
  add: protectedProcedure.input(product).mutation(async ({ input, ctx }) => {
    if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Get the user cart using the user id
    let cart = await ctx.db.cart.findUnique({ where: { userId: ctx.session.user.id } });
    if (!cart) {
      cart = await ctx.db.cart.create({
        data: {
          userId: ctx.session.user.id,
        },
      });
    }

    // Check if the product exists and has a price, otherwise error
    const product = await ctx.db.product.findUnique({
      where: { id: input.productId },
      include: {
        sizes: {
          include: {
            colors: true,
          },
        },
      },
    });
    if (!product) throw new TRPCError({ code: 'NOT_FOUND' });
    const color = await ctx.db.color.findUnique({
      where: { id: input.colorId },
    });
    if (!color || color.stock <= 0) throw new TRPCError({ code: 'NOT_FOUND' });

    await ctx.db.cart.update({
      where: {
        id: cart.id,
      },
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
  }),

  // Remove a product from the user's cart
  remove: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Get the user cart using the user id
    const cart = await ctx.db.cart.findUnique({ where: { userId: ctx.session.user.id }, include: { products: true } });
    if (!cart || cart.products.length === 0 || cart.products.filter((p) => p.id === input.id).length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    await ctx.db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        products: {
          delete: {
            id: input.id,
          },
        },
      },
    });
  }),

  // Get the user's cart
  get: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Get the user cart using the user id
    const cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
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
  }),
});
