import { getServerAuthSession } from '@/server/auth';
import ProductForm from '../_components/product/ProductForm';
import { redirect } from 'next/navigation';

export default async function Admin() {
  const session = await getServerAuthSession();
  if (!session || session?.user?.role !== 'ADMIN') {
    return redirect('/');
  } else if (session?.user?.role === 'ADMIN') {
    return (
      <div className="flex w-full flex-col gap-2">
        Welcome, {session.user.name}!
        <ProductForm />
      </div>
    );
  }
}
