import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import uploadImage from '@/utils/uploadImage';

const createSchema = z.object({
  name: z.string().min(1),
  startDate: z.date().min(new Date()),
  endDate: z.date().min(new Date()),
  image: z.string().optional(),
  selectedProducts: z.array(z.string()).min(1),
});

export const saleRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    try {
      return ctx.db.sale.findFirst({
        where: {
          startDate: {
            lte: new Date(),
          },
          endDate: {
            gte: new Date(),
          },
        },
        include: {
          products: true,
        },
      });
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
  create: protectedProcedure.input(createSchema).mutation(async ({ ctx, input }) => {
    try {
      if (ctx.session.user?.role !== 'ADMIN')
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      return await ctx.db.$transaction(async (tx) => {
        const overlappingSale = await ctx.db.sale.findFirst({
          where: {
            AND: [
              {
                endDate: {
                  gte: new Date(), // Ensure we only check future or ongoing sales
                },
              },
              {
                OR: [
                  {
                    startDate: {
                      lte: input.endDate, // Overlaps with the new sale's end date
                    },
                    endDate: {
                      gte: input.startDate, // Overlaps with the new sale's start date
                    },
                  },
                ],
              },
            ],
          },
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
        const sale = await tx.sale.create({
          data: {
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
            image: imageLink,
            products: {
              connect: input.selectedProducts.map((id) => ({ id })),
            },
          },
        });

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
});
