import { notFound } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';

import CheckoutContent from './CheckoutContent';

async function Checkout() {
  const session = await getServerAuthSession();
  if (!session) {
    notFound();
  }
  return <CheckoutContent />;
}

export default Checkout;
