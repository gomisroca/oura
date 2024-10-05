import { z } from 'zod';
import Stripe from 'stripe';
import { env } from '@/env';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const checkoutRouter = createTRPCRouter({
  // Get the order for future viewing
  getOrder: protectedProcedure.input(z.object({ orderId: z.string() })).query(async ({ input, ctx }) => {
    try {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
        include: {
          products: {
            include: {
              product: true,
              size: true,
              color: true,
            },
          },
        },
      });

      if (!order) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
      if (!ctx.session?.user?.id || ctx.session.user.id !== order.userId)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

      return order;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Order retrieval failed:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get order' });
      }
    }
  }),

  // Using the user's cart, start a cart and checkout session
  createSession: publicProcedure.mutation(async ({ ctx }) => {
    try {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });
      // Get the user cart using the user id
      const cart = await ctx.db.cart.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          products: {
            include: {
              product: true,
              size: true,
              color: true,
            },
          },
        },
      });

      // Check if the cart exists and has products, otherwise error
      if (!cart || !cart.products.length) throw new TRPCError({ code: 'NOT_FOUND', message: 'No products in cart' });

      // And then we use those products to create the order
      const order = await ctx.db.order.create({
        data: {
          userId: ctx.session.user.id,
        },
      });

      await ctx.db.$transaction(async (tx) => {
        // First check if all products have sufficient stock
        for (const product of cart.products) {
          const color = await tx.color.findUnique({
            where: { id: product.colorId },
          });

          if (!color || color.stock <= 0) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Product ${product.product.name} is out of stock`,
            });
          }
        }

        // If the stock check passes, update the products' orderId and cartId
        for (const product of cart.products) {
          await tx.orderProduct.update({
            where: { id: product.id },
            data: {
              orderId: order.id,
              cartId: null,
            },
          });
        }
      });

      // Give shape to the line items used during the checkout session
      const lineItems = cart.products.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.ceil(item.price * 100),
        },
        quantity: 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${env.NEXTAUTH_URL}/checkout/confirmation?sessionId={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
        cancel_url: `${env.NEXTAUTH_URL}`,
        metadata: {
          orderId: order.id,
          productIds: JSON.stringify(cart.products.map((item) => item.productId)), // Store productIds in metadata
        },
      });

      return { sessionId: session.id, orderId: order.id };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        // eslint-disable-next-line no-console
        console.error('Checkout session creation failed:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create checkout session' });
      }
    }
  }),

  // After the checkout session is completed, confirm the order and attach the stripe session id to it
  confirmOrder: protectedProcedure
    .input(z.object({ sessionId: z.string(), orderId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Try to retrieve the order, if it doesn't exist, throw an error
        const order = await ctx.db.order.findUnique({
          where: { id: input.orderId },
          include: {
            products: true,
          },
        });

        if (!order) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });

        // Check that the user is actually the owner of the order
        if (!ctx.session?.user?.id || ctx.session.user.id !== order.userId)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        // Check the status of the session, if it's not paid, destroy the order and throw an error
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        if (!session || session.payment_status !== 'paid') {
          await ctx.db.order.delete({ where: { id: input.orderId } });
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Payment was not successful' });
        }

        // If all checks pass, update the order
        const updatedOrder = await ctx.db.order.update({
          where: {
            id: input.orderId,
          },
          data: {
            stripeSessionId: session.id,
            confirmed: true,
          },
          include: {
            products: true,
          },
        });

        // Update stock and amountSold for the products
        await ctx.db.$transaction(async (tx) => {
          for (const product of updatedOrder.products) {
            // Update product's amountSold
            await tx.product.update({
              where: { id: product.productId },
              data: { amountSold: { increment: 1 } },
            });

            // Update product color's stock
            await tx.color.update({
              where: { id: product.colorId },
              data: { stock: { decrement: 1 } },
            });
          }
        });

        return updatedOrder;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          // eslint-disable-next-line no-console
          console.error('Order confirmation failed:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to confirm order' });
        }
      }
    }),
});
