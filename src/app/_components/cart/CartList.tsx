'use client';

/**
 * Renders a cart list component.
 *
 * @props
 *  products: The products to be rendered
 *  orderView: Whether the list is in the order view or not, which controls whether the remove button is displayed
 *
 * @example
 * <CartList />
 */

import React, { useMemo } from 'react';
import CartItem from './CartItem';
import { api } from '@/trpc/react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import MessageWrapper from '../ui/MessageWrapper';
import CartListLoading from './CartListLoading';

function CartList({ orderView = false, foldableView = false }: { orderView?: boolean; foldableView?: boolean }) {
  const router = useRouter();
  const { data: cart, status } = api.cart.get.useQuery();

  const products = useMemo(() => cart?.products, [cart?.products]);

  return status === 'pending' ? (
    <CartListLoading foldableView={foldableView} />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch your cart at this time" />
  ) : (
    <div
      className={`mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-xl bg-slate-200/90 p-4 shadow-md dark:bg-slate-800/90 ${foldableView ? 'flex-col' : ''}`}
      role="list">
      <div
        className={`flex flex-col items-center gap-2 ${foldableView ? 'mb-2 max-h-[40vh] overflow-y-auto overflow-x-hidden rounded-xl' : ''}`}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <CartItem key={product.id} product={product} orderView={orderView} foldableView={foldableView} />
          ))
        ) : (
          <div>No products in cart</div>
        )}
      </div>
      {foldableView && products && products.length > 0 && (
        <Button onClick={() => router.push('/checkout')}>Go to Checkout</Button>
      )}
    </div>
  );
}

export default CartList;
