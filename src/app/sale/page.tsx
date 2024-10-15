import { api } from '@/trpc/server';
import SportList from '../_components/ui/SportList';
import { notFound } from 'next/navigation';

export default async function SaleList({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

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
