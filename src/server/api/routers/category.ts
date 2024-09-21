import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const categoryRouter = createTRPCRouter({
  getSports: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.sport.findMany({
      include: {
        categories: {
          include: {
            subcategories: true,
          },
        },
      },
    });
  }),

  getCategories: publicProcedure.input(z.object({ sportId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.category.findMany({
      where: {
        sportId: input.sportId,
      },
      include: {
        subcategories: true,
      },
    });
  }),

  getSubcategories: publicProcedure.input(z.object({ categoryId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.subcategory.findMany({ where: { categoryId: input.categoryId } });
  }),
});
