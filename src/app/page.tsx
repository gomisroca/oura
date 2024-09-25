import { api } from '@/trpc/server';
import ProductList from './_components/product/ProductList';

export default async function Home() {
  const products = await api.product.getAll();
  return (
    <div className="flex w-full flex-col gap-2">
      <ProductList products={products} />
    </div>
  );
}
