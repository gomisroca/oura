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
  getUniqueProduct,
  updateProduct,
  updateProductVisits,
  updateSizes,
  updateColors,
  deleteProduct,
} from '../queries/product';

const createSchema = z.object({
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

const updateSchema = z.object({
  id: z.string(),
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

  getUnique: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const product = await getUniqueProduct({ prisma: ctx.db, productId: input });
      return product;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get unique product:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get unique product' });
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

  create: protectedProcedure.input(createSchema).mutation(async ({ ctx, input }) => {
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

  update: protectedProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
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
        const product = await updateProduct({
          prisma: tx,
          productId: input.id,
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
        if (product === null) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }

        const sizes = await updateSizes({
          prisma: tx,
          productId: product.id,
          inventory: input.inventory,
        });

        await updateColors({
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
        console.error('Failed to update product:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update product' });
      }
    }
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    try {
      if (ctx.session.user?.role !== 'ADMIN')
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      await deleteProduct({ prisma: ctx.db, id: input.id });
      return true;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to delete product:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete product' });
      }
    }
  }),
});
