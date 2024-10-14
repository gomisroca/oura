import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import ProductUpdate from './ProductUpdate';

export default async function Admin({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <ProductUpdate productId={params.id} />;
  }
}
