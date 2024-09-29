import ProductList from '@/app/_components/product/ProductList';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/server';

export default async function CategoryList({ params }: { params: { sport: string; category: string } }) {
  try {
    const products = await api.product.getByCategory({ categoryId: Number(params.category) });
    if (products.length === 0) return <MessageWrapper message="No products found" popup={false} />;
    return <ProductList products={products} />;
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" popup={false} />;
  }
}
