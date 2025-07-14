import { notFound } from 'next/navigation';

import ProductList from '@/app/_components/product/ProductList';
import BackButton from '@/app/_components/ui/BackButton';
import { api } from '@/trpc/server';

export default async function SportList({
  params,
  searchParams,
}: {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ gender: 'man' | 'woman' }>;
}) {
  const paramsData = await params;
  const searchParamsData = await searchParams;
  const gender =
    searchParamsData?.gender === 'man' ? 'MALE' : searchParamsData?.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const sale = await api.sale.getProductsBySport({ sportId: Number(paramsData.sport), gender: gender });

    if (!sale || sale.products.length === 0) notFound();
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-center md:absolute md:top-24 md:right-0 md:left-0">
          <BackButton>Sale</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-slate-800 dark:text-slate-400">{sale.products[0]?.product.sport?.name}</span>
          </div>
        </div>
        <ProductList products={sale.products.map((p) => p.product)} />
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
