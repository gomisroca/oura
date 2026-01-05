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

import { type OrderAddress } from 'generated/prisma';
import { Suspense } from 'react';
import { type OrderItem } from 'types';

import CartItem from '@/app/_components/cart/CartItem';
import CartListSkeleton from '@/app/_components/skeletons/CartListSkeleton';

function OrderList({
  products,
  id,
  createdAt,
  address,
}: {
  products: OrderItem[];
  id: string;
  createdAt: Date;
  address?: OrderAddress;
}) {
  return (
    <Suspense fallback={<CartListSkeleton foldableView={false} />}>
      <div
        className="mx-auto flex w-full flex-col items-center justify-center gap-2 rounded-sm bg-neutral-200/90 p-4 shadow-md dark:bg-neutral-800/90"
        role="list">
        <div className="flex w-full flex-row items-start justify-evenly">
          <div className="flex flex-col items-start justify-center gap-2">
            <p>{createdAt.toLocaleString()}</p>
            <p>{id}</p>
          </div>
          {address && (
            <div className="flex flex-col items-end justify-center gap-2">
              <p>
                {address.name}, {address.street}
              </p>
              <p>
                {address.postalCode}, {address.country}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2" role="listitem">
          {products && products.length > 0 ? (
            products.map((product) => (
              <CartItem key={product.id} product={product} orderView={true} foldableView={false} />
            ))
          ) : (
            <div>No products in order</div>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default OrderList;
