import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import uploadImage from '@/utils/uploadImage';
import { TRPCError } from '@trpc/server';

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
        const product = await tx.product.create({
          data: {
            name: input.name,
            description: input.description,
            basePrice: input.basePrice,
            onSalePrice: input.onSalePrice,
            gender: input.gender,
            subcategoryId: input.subcategory,
            categoryId: input.category,
            sportId: input.sport,
            image: imageLink,
          },
        });

        const sizes = await tx.size.createManyAndReturn({
          data: input.inventory.map((size) => ({ productId: product.id, name: size.name })),
        });

        await tx.color.createMany({
          data: input.inventory.flatMap((size) =>
            size.colors.map((color) => ({
              sizeId: sizes.find((s) => s.name === size.name)!.id,
              name: color.name,
              stock: color.stock,
            }))
          ),
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

  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return ctx.db.product.findMany({
        include: {
          sizes: {
            include: {
              colors: true,
            },
          },
          sales: true,
        },
      });
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

  visit: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      return ctx.db.product.update({
        where: { id: input.id },
        data: { views: { increment: 1 } },
        include: { sizes: { include: { colors: true } }, sales: true },
      });
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

  getByCategory: publicProcedure
    .input(z.object({ categoryId: z.number(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        return ctx.db.product.findMany({
          where: {
            categoryId: input.categoryId,
            gender: input.gender ? { has: input.gender } : undefined,
          },
          include: { sizes: { include: { colors: true } }, sales: true },
        });
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
        return ctx.db.product.findMany({
          where: {
            subcategoryId: input.subcategoryId,
            gender: input.gender ? { has: input.gender } : undefined,
          },
          include: { sizes: { include: { colors: true } }, sales: true },
        });
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
});
