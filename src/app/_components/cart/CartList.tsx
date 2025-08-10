'use client';

/**
 * Renders a cart list component.
 *
 * @props
 *  products: The products to be rendered
 *
 * @example
 * <CartList />
 */

import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import { api } from '@/trpc/react';

import CartListSkeleton from '../skeletons/CartListSkeleton';
import Button from '../ui/Button';
import MessageWrapper from '../ui/MessageWrapper';
import CartItem from './CartItem';

function CartList({ foldableView = false }: { foldableView?: boolean }) {
  const router = useRouter();
  const { data: cart, status } = api.cart.get.useQuery();

  const products = useMemo(() => cart?.products, [cart?.products]);

  return status === 'pending' ? (
    <CartListSkeleton foldableView={foldableView} />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch your cart at this time" />
  ) : (
    <div
      className={`mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-sm bg-neutral-200/90 p-4 shadow-md dark:bg-neutral-800/90 ${foldableView ? 'flex-col' : ''}`}
      role="list">
      <div
        role="listitem"
        className={`flex flex-col items-center gap-2 ${foldableView ? 'mb-2 max-h-[40vh] overflow-x-hidden overflow-y-auto rounded-sm' : ''}`}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <CartItem key={product.id} product={product} orderView={false} foldableView={foldableView} />
          ))
        ) : (
          <div>No products in cart</div>
        )}
      </div>
      {foldableView && products && products.length > 0 && (
        // If an item has no stock, the button should be disabled and show a warning
        <>
          {products.some((product) => product.color.stock <= 0) && (
            <p className="text-red-600">One or more products are out of stock</p>
          )}
          <Button
            disabled={!products.every((product) => product.color.stock > 0)}
            onClick={() => router.push('/checkout')}>
            Checkout
          </Button>
        </>
      )}
    </div>
  );
}

export default CartList;
