import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { productRouter } from './routers/product';
import { categoryRouter } from './routers/category';
import { checkoutRouter } from './routers/checkout';
import { cartRouter } from './routers/cart';
import { saleRouter } from './routers/sale';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  product: productRouter,
  checkout: checkoutRouter,
  cart: cartRouter,
  sale: saleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
