import { api } from '@/trpc/server';
import ProductList from './_components/product/ProductList';
import Message from './_components/ui/Message';

export default async function Home() {
  try {
    const products = await api.product.getAll();

    return (
      <div className="flex w-full flex-col gap-2">
        <ProductList products={products} />
      </div>
    );
  } catch (_error) {
    return <Message>Unable to fetch products at this time</Message>;
  }
}
