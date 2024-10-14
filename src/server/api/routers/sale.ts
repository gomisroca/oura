import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import uploadImage from '@/utils/uploadImage';
import {
  checkOverlappingSale,
  createSale,
  createSaleProduct,
  deleteSaleProduct,
  getAllSales,
  getOngoingSaleWithDetails,
  getProductsOnSaleByCategory,
  getProductsOnSaleBySport,
  getProductsOnSaleBySubcategory,
  getUniqueSale,
  updateSale,
} from '../queries/sale';

const createSchema = z.object({
  name: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().min(new Date()),
  image: z.string().optional(),
  selectedProducts: z.array(z.string()).min(1),
});

const updateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().min(new Date()),
  image: z.string().optional(),
  selectedProducts: z.array(z.string()).min(1),
});

export const saleRouter = createTRPCRouter({
  getUnique: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const sale = await getUniqueSale({ prisma: ctx.db, saleId: input });
      return sale;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get sale:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get sale' });
      }
    }
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const sales = await getAllSales({ prisma: ctx.db });
      return sales;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get sale:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get sale' });
      }
    }
  }),

  get: publicProcedure.input(z.enum(['MALE', 'FEMALE', 'OTHER']).optional()).query(async ({ ctx, input }) => {
    try {
      const sale = await getOngoingSaleWithDetails({ prisma: ctx.db, gender: input });
      return sale;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get sale:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get sale' });
      }
    }
  }),

  getProductsBySport: publicProcedure
    .input(z.object({ sportId: z.number(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const sale = await getProductsOnSaleBySport({ prisma: ctx.db, sportId: input.sportId, gender: input.gender });
        return sale;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to get products by sport:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get products by sport' });
        }
      }
    }),

  getProductsByCategory: publicProcedure
    .input(z.object({ categoryId: z.number(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const sale = await getProductsOnSaleByCategory({
          prisma: ctx.db,
          categoryId: input.categoryId,
          gender: input.gender,
        });
        return sale;
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

  getProductsBySubcategory: publicProcedure
    .input(z.object({ subcategoryId: z.number(), gender: z.enum(['MALE', 'FEMALE']).optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const sale = await getProductsOnSaleBySubcategory({
          prisma: ctx.db,
          subcategoryId: input.subcategoryId,
          gender: input.gender,
        });
        return sale;
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

      return await ctx.db.$transaction(async (tx) => {
        const overlappingSale = await checkOverlappingSale({
          prisma: tx,
          startDate: input.startDate,
          endDate: input.endDate,
        });
        if (overlappingSale) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A sale is already ongoing or scheduled during the selected period.',
          });
        }

        let imageLink: string | undefined;
        if (input.image) {
          try {
            imageLink = await uploadImage(input.image, 'sales');
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }
        const sale = await createSale({
          prisma: tx,
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          imageLink: imageLink!,
        });

        for (const product of input.selectedProducts) {
          await createSaleProduct({
            prisma: tx,
            productId: product,
            saleId: sale.id,
          });
        }

        return sale;
      });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to create sale:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create sale' });
      }
    }
  }),

  update: protectedProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
    try {
      if (ctx.session.user?.role !== 'ADMIN')
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      return await ctx.db.$transaction(async (tx) => {
        let imageLink: string | undefined;
        if (input.image) {
          try {
            imageLink = await uploadImage(input.image, 'sales');
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }
        const sale = await updateSale({
          prisma: tx,
          id: input.id,
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          imageLink: imageLink,
        });

        // Create new sale products if they don't exist
        for (const product of input.selectedProducts) {
          const saleProduct = sale.products.find((sp) => sp.productId === product);

          if (!saleProduct) {
            await createSaleProduct({
              prisma: tx,
              productId: product,
              saleId: sale.id,
            });
          }
        }
        // Delete products that are no longer in selectedProducts
        const saleProductsToDelete = sale.products.filter((sp) => !input.selectedProducts.includes(sp.productId));
        if (saleProductsToDelete.length > 0) {
          for (const saleProduct of saleProductsToDelete) {
            await deleteSaleProduct({
              prisma: tx,
              saleProductId: saleProduct.id,
            });
          }
        }

        return sale;
      });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to update sale:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update sale' });
      }
    }
  }),
});
