import ProductCard from '@/app/_components/product/ProductCard';
import { api } from '@/trpc/server';

export default async function SubcategoryList({
  params,
}: {
  params: { sport: string; category: string; subcategory: string };
}) {
  const products = await api.product.getBySubcategory({ subcategoryId: Number(params.subcategory) });
  return (
    <div className="flex w-full flex-col gap-2">
      {/* Display the products */}
      <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
