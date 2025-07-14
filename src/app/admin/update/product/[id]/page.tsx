import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';

import ProductUpdate from './ProductUpdate';

export default async function Admin({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <ProductUpdate productId={params.id} />;
  }
}
