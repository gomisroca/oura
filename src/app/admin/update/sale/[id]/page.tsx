import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import SaleUpdate from './SaleUpdate';

export default async function Admin({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <SaleUpdate id={params.id} />;
  }
}
