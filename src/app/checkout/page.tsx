import { getServerAuthSession } from '@/server/auth';
import CheckoutContent from './CheckoutContent';
import { notFound } from 'next/navigation';

async function Checkout() {
  const session = await getServerAuthSession();
  if (!session) {
    notFound();
  }
  return <CheckoutContent />;
}

export default Checkout;
