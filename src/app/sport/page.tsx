import { notFound } from 'next/navigation';

import { api } from '@/trpc/server';

import SportList from '../_components/ui/SportList';

export default async function SportsList({ searchParams }: { searchParams: Promise<{ gender: 'man' | 'woman' }> }) {
  const searchParamsData = await searchParams;
  const gender =
    searchParamsData.gender === 'man' ? 'MALE' : searchParamsData.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const [products, sports] = await Promise.all([api.product.getAll(gender), api.category.getSports()]);

    if (products.length === 0) {
      notFound();
    }

    return <SportList products={products} sports={sports} />;
  } catch (_error) {
    notFound();
  }
}
