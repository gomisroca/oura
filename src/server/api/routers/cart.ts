import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { addProductToCart, createCart, getCart, removeProductFromCart } from '../queries/cart';
import { getUniqueColor, getUniqueProduct } from '../queries/product';

const product = z.object({
  name: z.string().min(1),
  price: z.number().min(0.01),
  productId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
});

export const cartRouter = createTRPCRouter({
  // Get the user's cart
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      // Get the user cart using the user id
      const cart = await getCart({ prisma: ctx.db, userId: ctx.session.user.id });

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

  // Add a product to the user's cart
  add: protectedProcedure.input(product).mutation(async ({ input, ctx }) => {
    try {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      // Get the user cart using the user id
      let cart = await getCart({ prisma: ctx.db, userId: ctx.session.user.id });
      if (!cart) {
        // If the user has no cart, create one for them
        cart = await createCart({ prisma: ctx.db, userId: ctx.session.user.id });
      }

      return await ctx.db.$transaction(async (tx) => {
        // Fetch the product with sizes and colors included
        const product = await getUniqueProduct({ prisma: tx, productId: input.productId });

        // If the product is not found, throw an error
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }

        // Fetch the color and check its stock
        const color = await getUniqueColor({ prisma: tx, colorId: input.colorId });

        // If the color is not found or stock is insufficient, throw an error
        if (!color || color.stock <= 0) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product out of stock' });
        }

        // Update the cart with the new product, size, and color
        const updatedCart = await addProductToCart({ prisma: tx, cartId: cart.id, input: input });

        return updatedCart;
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

      return await ctx.db.$transaction(async (tx) => {
        // Get the user cart using the user ID
        const cart = await getCart({ prisma: tx, userId: ctx.session.user.id });

        // If the cart or the product isn't found, throw an error
        if (!cart || cart.products.length === 0 || !cart.products.some((p) => p.id === input.id)) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found in cart' });
        }

        // Delete the product from the cart
        const updatedCart = await removeProductFromCart({ prisma: tx, cartId: cart.id, productId: input.id });

        return updatedCart;
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
});
