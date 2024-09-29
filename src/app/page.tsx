import { api } from '@/trpc/server';
import ProductList from './_components/product/ProductList';
import MessageWrapper from './_components/ui/MessageWrapper';

export default async function Home() {
  try {
    const products = await api.product.getAll();

    return (
      <div className="flex w-full flex-col gap-2">
        <ProductList products={products} />
      </div>
    );
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" />;
  }
}
