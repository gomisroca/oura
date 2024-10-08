import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import uploadImage from '@/utils/uploadImage';
import { TRPCError } from '@trpc/server';
import {
  createColors,
  createProduct,
  createSizes,
  getProducts,
  getProductsbyCategory,
  getProductsbySport,
  getProductsbySubcategory,
  updateProductVisits,
} from '../queries/product';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  basePrice: z.number().multipleOf(0.01),
  onSalePrice: z.number().multipleOf(0.01),
  gender: z.array(z.enum(['MALE', 'FEMALE', 'OTHER'])),
  subcategory: z.number(),
  category: z.number(),
  sport: z.number(),
  inventory: z.array(
    z.object({ name: z.string(), colors: z.array(z.object({ name: z.string(), stock: z.number() })) })
  ),
  image: z.string().optional(),
});

export const productRouter = createTRPCRouter({
  visit: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      const product = await updateProductVisits({ prisma: ctx.db, productId: input.id });
      return product;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to visit product:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to visit product' });
      }
    }
  }),

  getAll: publicProcedure.input(z.enum(['MALE', 'FEMALE', 'OTHER']).optional()).query(async ({ ctx, input }) => {
    try {
      const products = await getProducts({ prisma: ctx.db, gender: input });
      return products;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get all products:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get all products' });
      }
    }
  }),

  getBySport: publicProcedure
    .input(z.object({ sportId: z.number(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const products = await getProductsbySport({ prisma: ctx.db, sportId: input.sportId, gender: input.gender });
        return products;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to get products by category:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get products by category' });
        }
      }
    }),

  getByCategory: publicProcedure
    .input(z.object({ categoryId: z.number(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const products = await getProductsbyCategory({
          prisma: ctx.db,
          categoryId: input.categoryId,
          gender: input.gender,
        });
        return products;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to get products by category:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get products by category' });
        }
      }
    }),

  getBySubcategory: publicProcedure
    .input(z.object({ subcategoryId: z.number(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const products = await getProductsbySubcategory({
          prisma: ctx.db,
          subcategoryId: input.subcategoryId,
          gender: input.gender,
        });
        return products;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to get products by subcategory:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get products by subcategory' });
        }
      }
    }),

  create: protectedProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
    try {
      if (ctx.session.user?.role !== 'ADMIN')
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      let imageLink: string | undefined;
      if (input.image) {
        try {
          imageLink = await uploadImage(input.image);
        } catch (_error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
        }
      }

      return await ctx.db.$transaction(async (tx) => {
        const product = await createProduct({
          prisma: tx,
          name: input.name,
          description: input.description,
          basePrice: input.basePrice,
          onSalePrice: input.onSalePrice,
          gender: input.gender,
          subcategoryId: input.subcategory,
          categoryId: input.category,
          sportId: input.sport,
          imageLink: imageLink,
        });

        const sizes = await createSizes({
          prisma: tx,
          productId: product.id,
          inventory: input.inventory,
        });

        await createColors({
          prisma: tx,
          sizes: sizes,
          inventory: input.inventory,
        });

        return product;
      });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to create product:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create product' });
      }
    }
  }),
});
