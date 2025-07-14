import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';

import SubcategoryUpdate from './SubcategoryUpdate';

export default async function Admin({
  params,
}: {
  params: Promise<{ sportId: string; categoryId: string; subcategoryId: string }>;
}) {
  const paramsData = await params;

  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return (
      <SubcategoryUpdate
        id={paramsData.subcategoryId}
        categoryId={paramsData.categoryId}
        sportId={paramsData.sportId}
      />
    );
  }
}
