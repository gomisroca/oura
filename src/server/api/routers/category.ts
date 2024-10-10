import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import {
  createCategory,
  createSport,
  createSubcategory,
  getCategoriesInSport,
  getSports,
  getSportsByGender,
  getSportsInSale,
  getSubcategoriesInCategory,
  getUniqueCategory,
  getUniqueSport,
  getUniqueSubcategory,
} from '../queries/category';
import { getOngoingSale } from '../queries/sale';

export const categoryRouter = createTRPCRouter({
  getSports: publicProcedure.query(async ({ ctx }) => {
    try {
      const sports = await getSports({ prisma: ctx.db });
      return sports;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get sports:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get sports' });
      }
    }
  }),

  getCategories: publicProcedure.input(z.object({ sportId: z.number() })).query(async ({ ctx, input }) => {
    try {
      const categories = await getCategoriesInSport({ prisma: ctx.db, sportId: input.sportId });
      return categories;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get categories:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get categories' });
      }
    }
  }),

  getSubcategories: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        gender: z.enum(['MALE', 'FEMALE']).optional(),
        sale: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        if (input.categoryId) {
          const subcategories = await getSubcategoriesInCategory({
            prisma: ctx.db,
            categoryId: input.categoryId,
            gender: input.gender,
            sale: input.sale,
          });
          return subcategories;
        }
        return null;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to get subcategories:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get subcategories' });
        }
      }
    }),

  getSportsByGender: publicProcedure
    .input(z.object({ gender: z.enum(['MALE', 'FEMALE', 'OTHER']) }))
    .query(async ({ ctx, input }) => {
      try {
        const sports = await getSportsByGender({ prisma: ctx.db, gender: input.gender });
        return sports;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to get sports by gender:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get sports by gender' });
        }
      }
    }),

  getSportsInSale: publicProcedure.query(async ({ ctx }) => {
    try {
      const sale = await getOngoingSale({ prisma: ctx.db });
      if (sale) {
        const sports = await getSportsInSale({ prisma: ctx.db, saleId: sale.id });
        return sports;
      }
      return undefined;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get sports with active sales:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get sports with active sales' });
      }
    }
  }),

  createSport: protectedProcedure.input(z.object({ sport: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    try {
      if (ctx.session.user?.role !== 'ADMIN')
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      const sport = await getUniqueSport({ prisma: ctx.db, sportName: input.sport });
      if (sport) return sport;

      const newSport = await createSport({ prisma: ctx.db, sportName: input.sport });
      return newSport;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to create sport:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create sport' });
      }
    }
  }),

  createCategory: protectedProcedure
    .input(z.object({ sportId: z.number(), category: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user?.role !== 'ADMIN')
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        return await ctx.db.$transaction(async (tx) => {
          // First, try to find the sport
          const sport = await getUniqueSport({ prisma: tx, sportId: input.sportId });

          if (!sport) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Sport not found' });
          }

          // Try to find the category associated with the sport
          let category = await getUniqueCategory({ prisma: tx, categoryName: input.category, sportId: input.sportId });

          // If the category doesn't exist, create it
          if (!category) {
            category = await createCategory({ prisma: tx, categoryName: input.category, sportId: input.sportId });
          }

          return category;
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to create category:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create category' });
        }
      }
    }),

  createSubcategory: protectedProcedure
    .input(z.object({ sportId: z.number(), categoryId: z.number(), subcategory: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user?.role !== 'ADMIN')
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        return await ctx.db.$transaction(async (tx) => {
          // First, try to find the sport
          const sport = await getUniqueSport({ prisma: tx, sportId: input.sportId });
          if (!sport) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Sport not found' });
          }

          // Next, try to find the category
          const category = await getUniqueCategory({
            prisma: tx,
            categoryId: input.categoryId,
            sportId: input.sportId,
          });
          if (!category) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' });
          }

          // Try to find the subcategory associated with the category
          let subcategory = await getUniqueSubcategory({
            prisma: tx,
            subcategoryName: input.subcategory,
            categoryId: input.categoryId,
          });

          // If the subcategory doesn't exist, create it
          if (!subcategory) {
            subcategory = await createSubcategory({
              prisma: tx,
              subcategoryName: input.subcategory,
              categoryId: input.categoryId,
            });
          }

          return subcategory;
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to create category:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create subcategory' });
        }
      }
    }),
});
