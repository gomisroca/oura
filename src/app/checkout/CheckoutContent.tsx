import CheckoutButton from './CheckoutButton';
import CartList from '../_components/cart/CartList';

function CheckoutContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Cart Summary */}
      <CartList />
      {/* Checkout Button where the checkout logic resides */}
      <CheckoutButton />
    </div>
  );
}

export default CheckoutContent;
