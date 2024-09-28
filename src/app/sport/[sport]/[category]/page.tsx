import ProductList from '@/app/_components/product/ProductList';
import { api } from '@/trpc/server';

export default async function CategoryList({ params }: { params: { sport: string; category: string } }) {
  try {
    const products = await api.product.getByCategory({ categoryId: Number(params.category) });
    return <ProductList products={products} />;
  } catch (_error) {
    return <div>Unable to fetch products at this time</div>;
  }
}
