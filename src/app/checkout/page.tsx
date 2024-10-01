import { getServerAuthSession } from '@/server/auth';
import CheckoutContent from './CheckoutContent';
import MessageWrapper from '../_components/ui/MessageWrapper';

async function Checkout() {
  const session = await getServerAuthSession();
  if (!session) {
    return <MessageWrapper message="Must be signed in to checkout" />;
  }
  return <CheckoutContent />;
}

export default Checkout;
