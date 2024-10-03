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
    try {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

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
      if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
      const color = await ctx.db.color.findUnique({
        where: { id: input.colorId },
      });
      if (!color || color.stock <= 0) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product out of stock' });

      return await ctx.db.cart.update({
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
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Add product to cart failed:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add product to cart' });
      }
    }
  }),

  // Remove a product from the user's cart
  remove: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    try {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      // Get the user cart using the user id
      const cart = await ctx.db.cart.findUnique({
        where: { userId: ctx.session.user.id },
        include: { products: true },
      });
      if (!cart || cart.products.length === 0 || cart.products.filter((p) => p.id === input.id).length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found in cart' });
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
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Remove product from cart failed:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove product from cart' });
      }
    }
  }),

  // Get the user's cart
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

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
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Cart retrieval failed:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve cart' });
      }
    }
  }),
});
