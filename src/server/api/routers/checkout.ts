import { z } from 'zod';
import Stripe from 'stripe';
import { env } from '@/env';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const checkoutRouter = createTRPCRouter({
  // Get the order for future viewing
  getOrder: protectedProcedure.input(z.object({ orderId: z.string() })).query(async ({ input, ctx }) => {
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

    if (!order) throw new TRPCError({ code: 'NOT_FOUND' });
    if (!ctx.session?.user?.id || ctx.session.user.id !== order.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return order;
  }),

  // Using the user's cart, start a cart and checkout session
  createSession: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });
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
    if (!cart || !cart.products.length) throw new TRPCError({ code: 'NOT_FOUND' });

    // And then we use those products to create the order
    const order = await ctx.db.order.create({
      data: {
        userId: ctx.session.user.id,
      },
    });

    for (const product of cart?.products) {
      await ctx.db.orderProduct.update({
        where: {
          id: product.id,
        },
        data: {
          orderId: order.id,
          cartId: null,
        },
      });
    }

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
  }),

  // After the checkout session is completed, confirm the order and attach the stripe session id to it
  confirmOrder: protectedProcedure
    .input(z.object({ sessionId: z.string(), orderId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Try to retrieve the order, if it doesn't exist, throw an error
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
      });
      if (!order) throw new TRPCError({ code: 'NOT_FOUND' });

      // Check that the user is actually the owner of the order
      if (!ctx.session?.user?.id || ctx.session.user.id !== order.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      // Check the status of the session, if it's not paid, destroy the order and throw an error
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      if (session.payment_status !== 'paid') {
        await ctx.db.order.delete({ where: { id: input.orderId } });
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      // If all checks have passed, confirm the order and attach the stripe session id to it
      await ctx.db.order.update({
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

      return order;
    }),
});
