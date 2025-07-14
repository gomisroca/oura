import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';

import SportUpdate from './SportUpdate';

export default async function Admin({ params }: { params: { sportId: string } }) {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <SportUpdate id={params.sportId} />;
  }
}
