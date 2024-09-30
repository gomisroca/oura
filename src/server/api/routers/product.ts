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
    if (ctx.session.user?.role !== 'ADMIN') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    let imageLink;
    if (input.image) {
      imageLink = await uploadImage(input.image);
    }

    const product = await ctx.db.product.create({
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

    const sizes = await ctx.db.size.createManyAndReturn({
      data: input.inventory.map((size) => ({ productId: product.id, name: size.name })),
    });

    await ctx.db.color.createMany({
      data: input.inventory.flatMap((size) =>
        size.colors.map((color) => ({
          sizeId: sizes.find((s) => s.name === size.name)!.id,
          name: color.name,
          stock: color.stock,
        }))
      ),
    });

    return product;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
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
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.product.findUnique({
      where: { id: input.id },
      include: { sizes: { include: { colors: true } }, sales: true },
    });
  }),

  getByCategory: publicProcedure.input(z.object({ categoryId: z.number() })).query(async ({ ctx, input }) => {
    return ctx.db.product.findMany({
      where: { categoryId: input.categoryId },
      include: { sizes: { include: { colors: true } }, sales: true },
    });
  }),

  getBySubcategory: publicProcedure.input(z.object({ subcategoryId: z.number() })).query(async ({ ctx, input }) => {
    return ctx.db.product.findMany({
      where: { subcategoryId: input.subcategoryId },
      include: { sizes: { include: { colors: true } }, sales: true },
    });
  }),
});
