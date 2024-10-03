import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const categoryRouter = createTRPCRouter({
  getSports: publicProcedure.query(async ({ ctx }) => {
    try {
      return ctx.db.sport.findMany({
        include: {
          categories: {
            include: {
              subcategories: true,
            },
          },
        },
      });
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
      return ctx.db.category.findMany({
        where: {
          sportId: input.sportId,
        },
        include: {
          subcategories: true,
        },
      });
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
    .input(z.object({ categoryId: z.number().optional(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        if (input.categoryId) {
          return ctx.db.subcategory.findMany({
            where: {
              categoryId: input.categoryId,
              products: {
                some: {
                  gender: input.gender ? { has: input.gender } : undefined,
                },
              },
            },
          });
        } else {
          return null;
        }
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
        return ctx.db.sport.findMany({
          where: {
            categories: {
              some: {
                subcategories: {
                  some: {
                    products: {
                      some: {
                        gender: {
                          has: input.gender,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          include: {
            categories: {
              where: {
                subcategories: {
                  some: {
                    products: {
                      some: {
                        gender: {
                          has: input.gender,
                        },
                      },
                    },
                  },
                },
              },
              include: {
                subcategories: {
                  where: {
                    products: {
                      some: {
                        gender: {
                          has: input.gender,
                        },
                      },
                    },
                  },
                  include: {
                    products: {
                      where: {
                        gender: {
                          has: input.gender,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
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

  createSport: protectedProcedure.input(z.object({ sport: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    try {
      if (ctx.session.user?.role !== 'ADMIN')
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });
      const sport = await ctx.db.sport.create({ data: { name: input.sport } });
      return sport;
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

        // First, try to find the sport
        const sport = await ctx.db.sport.findUnique({
          where: { id: input.sportId },
        });
        if (!sport) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Sport not found' });
        }

        // Next, try to find the category
        const category = await ctx.db.category.findFirst({
          where: { name: input.category, sportId: sport.id },
        });

        if (!category) {
          // If the category doesn't exist, create it
          const newCategory = await ctx.db.category.create({
            data: { name: input.category, sportId: sport.id },
          });
          return newCategory;
        }
        return category;
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

        // First, try to find the sport
        const sport = await ctx.db.sport.findUnique({
          where: { id: input.sportId },
        });
        if (!sport) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Sport not found' });
        }

        // Next, try to find the category
        const category = await ctx.db.category.findUnique({
          where: { id: input.categoryId },
        });
        if (!category) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' });
        }

        // Try to find the subcategory
        const subcategory = await ctx.db.subcategory.findFirst({
          where: { name: input.subcategory, categoryId: category.id },
        });
        if (!subcategory) {
          // If the subcategory doesn't exist, create it
          const newSubcategory = await ctx.db.subcategory.create({
            data: { name: input.subcategory, categoryId: category.id },
          });
          return newSubcategory;
        }

        return subcategory;
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
