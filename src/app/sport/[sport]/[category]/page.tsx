import ProductCard from '@/app/_components/product/ProductCard';
import { api } from '@/trpc/server';

export default async function CategoryList({ params }: { params: { sport: string; category: string } }) {
  const products = await api.product.getByCategory({ categoryId: Number(params.category) });
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
