import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import CategoryCreation from './CategoryCreation';

export default async function Admin() {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return <CategoryCreation />;
  }
}
