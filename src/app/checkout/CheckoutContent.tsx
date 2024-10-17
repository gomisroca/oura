import CheckoutForm from './CheckoutForm';
import CartList from '../_components/cart/CartList';

function CheckoutContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <CartList />
      <CheckoutForm />
    </div>
  );
}

export default CheckoutContent;
