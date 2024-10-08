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
          return ctx.db.subcategory.findMany({
            where: {
              categoryId: input.categoryId,
              products: {
                some: {
                  gender: input.gender ? { has: input.gender } : undefined,
                  sales: input.sale
                    ? {
                        some: {
                          sale: {
                            startDate: {
                              lte: new Date(),
                            },
                            endDate: {
                              gte: new Date(),
                            },
                          },
                        },
                      }
                    : undefined,
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

  getSportsInSale: publicProcedure.query(async ({ ctx }) => {
    try {
      const sale = await ctx.db.sale.findFirst({
        where: {
          startDate: {
            lte: new Date(),
          },
          endDate: {
            gte: new Date(),
          },
        },
      });
      if (sale) {
        return ctx.db.sport.findMany({
          where: {
            categories: {
              some: {
                subcategories: {
                  some: {
                    products: {
                      some: {
                        sales: {
                          some: {
                            sale: {
                              id: sale.id,
                            },
                          },
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
                        sales: {
                          some: {
                            sale: {
                              id: sale.id,
                            },
                          },
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
                        sales: {
                          some: {
                            sale: {
                              id: sale.id,
                            },
                          },
                        },
                      },
                    },
                  },
                  include: {
                    products: {
                      where: {
                        sales: {
                          some: {
                            sale: {
                              id: sale.id,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
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

      const sport = await ctx.db.sport.findFirst({
        where: { name: input.sport },
      });
      if (sport) return sport;

      const newSport = await ctx.db.sport.create({ data: { name: input.sport } });
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
          const sport = await tx.sport.findUnique({
            where: { id: input.sportId },
          });

          if (!sport) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Sport not found' });
          }

          // Try to find the category associated with the sport
          let category = await tx.category.findFirst({
            where: { name: input.category, sportId: sport.id },
          });

          // If the category doesn't exist, create it
          if (!category) {
            category = await tx.category.create({
              data: {
                name: input.category,
                sportId: sport.id,
              },
            });
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
          const sport = await tx.sport.findUnique({
            where: { id: input.sportId },
          });
          if (!sport) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Sport not found' });
          }

          // Next, try to find the category
          const category = await tx.category.findUnique({
            where: { id: input.categoryId },
          });
          if (!category) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' });
          }

          // Try to find the subcategory associated with the category
          let subcategory = await tx.subcategory.findFirst({
            where: { name: input.subcategory, categoryId: category.id },
          });

          // If the subcategory doesn't exist, create it
          if (!subcategory) {
            subcategory = await tx.subcategory.create({
              data: {
                name: input.subcategory,
                categoryId: category.id,
              },
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
