import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import uploadImage from '@/utils/uploadImage';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  basePrice: z.number().multipleOf(0.01),
  onSalePrice: z.number().multipleOf(0.01),
  image: z.string().optional(),
});

export const productRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),

  create: publicProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
    let imageLink;
    if (input.image) {
      imageLink = await uploadImage(input.image);
    }
    return ctx.db.product.create({
      data: { ...input, image: imageLink },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),
});
