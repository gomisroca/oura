import CheckoutButton from './CheckoutButton';
import MockAddToCart from './MockAddToCart';
import CartList from '../_components/cart/CartList';

function CheckoutContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Mock Adding Products to the Cart */}
      <MockAddToCart />
      {/* Cart Summary */}
      <CartList />
      {/* Checkout Button where the checkout logic resides */}
      <CheckoutButton />
    </div>
  );
}

export default CheckoutContent;
