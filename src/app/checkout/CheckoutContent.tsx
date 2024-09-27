'use client';

import CheckoutButton from './CheckoutButton';
import MockAddToCart from './MockAddToCart';
import CartList from '../_components/cart/CartList';
import { api } from '@/trpc/react';

function CheckoutContent() {
  const utils = api.useUtils();
  const { data: cart } = api.cart.get.useQuery();

  const handleUpdateCart = async () => {
    await utils.cart.get.refetch();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Mock Adding Products to the Cart */}
      <MockAddToCart handleUpdateCart={handleUpdateCart} />
      {/* Cart Summary */}
      {cart?.products && cart?.products.length > 0 && (
        <CartList products={cart.products} handleUpdateCart={handleUpdateCart} />
      )}
      {/* Checkout Button where the checkout logic resides */}
      {cart && <CheckoutButton />}
    </div>
  );
}

export default CheckoutContent;
