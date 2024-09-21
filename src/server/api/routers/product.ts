import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import uploadImage from '@/utils/uploadImage';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  basePrice: z.number().multipleOf(0.01),
  onSalePrice: z.number().multipleOf(0.01),
  image: z.string().optional(),
  inventory: z.array(
    z.object({ name: z.string(), colors: z.array(z.object({ name: z.string(), stock: z.number() })) })
  ),
});

export const productRouter = createTRPCRouter({
  create: publicProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
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
    return ctx.db.product.findMany({ include: { sizes: { include: { colors: true } } } });
  }),

  getBySubcategory: publicProcedure.input(z.object({ subcategoryId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.product.findMany({
      where: { subcategoryId: input.subcategoryId },
      include: { sizes: { include: { colors: true } } },
    });
  }),
});
