import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import SubcategoryUpdate from './SubcategoryUpdate';

export default async function Admin({
  params,
}: {
  params: { sportId: string; categoryId: string; subcategoryId: string };
}) {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <SubcategoryUpdate id={params.subcategoryId} categoryId={params.categoryId} sportId={params.sportId} />;
  }
}
