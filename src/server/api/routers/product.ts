import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import supabase from '@/supabase';

async function uploadImage(image: File) {
  const { data, error } = await supabase.storage.from('products').upload('public/product1.png', image, {
    cacheControl: '3600',
    upsert: false,
  });
  console.log(data, error);
  return data?.fullPath;
}

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  basePrice: z.number().multipleOf(0.01),
  onSalePrice: z.number().multipleOf(0.01),
  image: z.instanceof(File).optional(),
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
      const imageUrl = await uploadImage(input.image);
      imageLink = imageUrl;
    }
    return ctx.db.product.create({
      data: {
        name: input.name,
        description: input.description,
        basePrice: input.basePrice,
        onSalePrice: input.onSalePrice,
        image: imageLink,
      },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),
});
