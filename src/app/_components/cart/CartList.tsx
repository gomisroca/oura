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
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import MessageWrapper from '../ui/MessageWrapper';

function CartList({ orderView = false, foldableView = false }: { orderView?: boolean; foldableView?: boolean }) {
  const router = useRouter();
  const { data: cart, status } = api.cart.get.useQuery();

  const products = useMemo(() => cart?.products, [cart?.products]);

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch your cart at this time" />
  ) : (
    <div
      className={`mx-auto flex w-full flex-wrap items-center justify-center gap-2 ${foldableView ? 'flex-col' : ''}`}
      role="list">
      {products ? (
        products.map((product) => <CartItem key={product.id} product={product} orderView={orderView} />)
      ) : (
        <div>No products in cart</div>
      )}
      {foldableView && <Button onClick={() => router.push('/checkout')}>Go to Checkout</Button>}
    </div>
  );
}

export default CartList;
