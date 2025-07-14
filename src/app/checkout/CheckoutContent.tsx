import CartList from '../_components/cart/CartList';
import CheckoutForm from './CheckoutForm';

function CheckoutContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <CartList />
      <CheckoutForm />
    </div>
  );
}

export default CheckoutContent;
