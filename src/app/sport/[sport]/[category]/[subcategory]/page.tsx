import { notFound } from 'next/navigation';

import ProductList from '@/app/_components/product/ProductList';
import BackButton from '@/app/_components/ui/BackButton';
import { api } from '@/trpc/server';

export default async function SubcategoryList({
  params,
  searchParams,
}: {
  params: { sport: string; category: string; subcategory: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const products = await api.product.getBySubcategory({ subcategoryId: Number(params.subcategory), gender: gender });

    if (products.length === 0) notFound();
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-center md:absolute md:top-24 md:right-0 md:left-0">
          <BackButton steps={-2}>{products[0]?.sport?.name ?? 'Sport'}</BackButton>
          <BackButton>{products[0]?.category?.name ?? 'Category'}</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-slate-800 dark:text-slate-400">{products[0]?.subcategory?.name}</span>
          </div>
        </div>
        <ProductList products={products} />
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
