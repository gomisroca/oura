import { z } from 'zod';
import Stripe from 'stripe';
import { env } from '@/env';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const createSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1),
      price: z.number().min(0.01),
      productId: z.string().min(1),
      sizeId: z.string().min(1),
      colorId: z.string().min(1),
    })
  ),
});

export const checkoutRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure.input(createSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.session?.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Init an order with the user and product details
    const order = await ctx.db.order.create({
      data: {
        userId: ctx.session.user.id,
        products: {
          create: input.items.map((item) => ({
            price: item.price,
            product: { connect: { id: item.productId } },
            size: { connect: { id: item.sizeId } },
            color: { connect: { id: item.colorId } },
          })),
        },
      },
    });

    // Give shape to the line items used during the checkout session
    const lineItems = input.items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
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
        productIds: JSON.stringify(input.items.map((item) => item.productId)), // Store productIds in metadata
      },
    });

    return { sessionId: session.id, orderId: order.id };
  }),

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

  getCheckoutSession: protectedProcedure.input(z.object({ sessionId: z.string() })).query(async ({ input }) => {
    const session = await stripe.checkout.sessions.retrieve(input.sessionId, { expand: ['line_items'] });
    return session;
  }),

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
});
