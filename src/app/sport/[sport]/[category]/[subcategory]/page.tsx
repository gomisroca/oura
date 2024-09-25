import ProductList from '@/app/_components/product/ProductList';
import { api } from '@/trpc/server';

export default async function SubcategoryList({
  params,
}: {
  params: { sport: string; category: string; subcategory: string };
}) {
  const products = await api.product.getBySubcategory({ subcategoryId: Number(params.subcategory) });
  return <ProductList products={products} />;
}
