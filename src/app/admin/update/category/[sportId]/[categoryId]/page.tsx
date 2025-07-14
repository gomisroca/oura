import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';

import CategoryUpdate from './CategoryUpdate';

export default async function Admin({ params }: { params: { sportId: string; categoryId: string } }) {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <CategoryUpdate id={params.categoryId} />;
  }
}
