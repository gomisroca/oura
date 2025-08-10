import { notFound } from 'next/navigation';

import ProductList from '@/app/_components/product/ProductList';
import BackButton from '@/app/_components/ui/BackButton';
import { api } from '@/trpc/server';

export default async function CategoryList({
  params,
  searchParams,
}: {
  params: Promise<{ sport: string; category: string }>;
  searchParams: Promise<{ gender: 'man' | 'woman' }>;
}) {
  const paramsData = await params;
  const searchParamsData = await searchParams;
  const gender =
    searchParamsData?.gender === 'man' ? 'MALE' : searchParamsData?.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const products = await api.product.getByCategory({ categoryId: Number(paramsData.category), gender: gender });

    if (products.length === 0) notFound();
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-center md:absolute md:top-24 md:right-0 md:left-0">
          <BackButton>{products[0]?.sport?.name ?? 'Sport'}</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-neutral-800 dark:text-neutral-400">{products[0]?.category?.name}</span>
          </div>
        </div>
        <ProductList products={products} />
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
