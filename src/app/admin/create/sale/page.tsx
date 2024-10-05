import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import SaleCreation from './SaleCreation';

export default async function Admin() {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <SaleCreation />;
  }
}
