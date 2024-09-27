import { getServerAuthSession } from '@/server/auth';
import CheckoutContent from './CheckoutContent';

async function Checkout() {
  const session = await getServerAuthSession();
  if (!session) {
    return <div>Please sign in</div>;
  }
  return <CheckoutContent />;
}

export default Checkout;
