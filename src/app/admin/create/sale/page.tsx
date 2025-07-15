import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';

import SaleCreation from './SaleCreation';

export default async function Admin() {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <SaleCreation />;
  }
}
