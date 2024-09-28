import ProductList from '@/app/_components/product/ProductList';
import { api } from '@/trpc/server';

export default async function SubcategoryList({
  params,
}: {
  params: { sport: string; category: string; subcategory: string };
}) {
  try {
    const products = await api.product.getBySubcategory({ subcategoryId: Number(params.subcategory) });
    return <ProductList products={products} />;
  } catch (_error) {
    return <div>Unable to fetch products at this time</div>;
  }
}
