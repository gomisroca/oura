import { getServerAuthSession } from '@/server/auth';
import ProductForm from './_components/product/ProductForm';
import ProductList from './_components/product/ProductList';

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <div className="flex w-full flex-col gap-2">
      {session ? <p>You are signed in as {session.user.name}</p> : <p>You are not signed in</p>}
      <ProductForm />
      <ProductList />
    </div>
  );
}
