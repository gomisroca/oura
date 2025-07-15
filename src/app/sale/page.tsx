import { notFound } from 'next/navigation';

import { api } from '@/trpc/server';

import SportList from '../_components/ui/SportList';

export default async function SaleList({ searchParams }: { searchParams: Promise<{ gender: 'man' | 'woman' }> }) {
  const searchParamsData = await searchParams;
  const gender =
    searchParamsData?.gender === 'man' ? 'MALE' : searchParamsData?.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const [sale, saleSports] = await Promise.all([api.sale.get(gender), api.category.getSportsInSale()]);

    if (!sale || sale.products.length === 0) notFound();

    if (saleSports) {
      return <SportList products={sale.products.map((p) => p.product)} sports={saleSports.sports} sale={true} />;
    } else {
      notFound();
    }
  } catch (_error) {
    notFound();
  }
}
