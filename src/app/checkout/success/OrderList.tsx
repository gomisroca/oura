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

import CartItem from '@/app/_components/cart/CartItem';
import { type OrderItem } from 'types';

function OrderList({ products }: { products: OrderItem[] }) {
  return (
    <div
      className="mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-xl bg-slate-200/90 p-4 shadow-md dark:bg-slate-800/90"
      role="list">
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
  );
}

export default OrderList;
