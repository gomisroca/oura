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

import React from 'react';
import { type OrderItem } from 'types';
import CartItem from './CartItem';

function CartList({
  products,
  orderView = false,
  handleUpdateCart,
}: {
  products: OrderItem[];
  orderView?: boolean;
  handleUpdateCart: () => void;
}) {
  if (!products) return <div>No products in cart</div>;
  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {products.map((product) => (
        <CartItem key={product.id} product={product} orderView={orderView} handleUpdateCart={handleUpdateCart} />
      ))}
    </div>
  );
}

export default CartList;
