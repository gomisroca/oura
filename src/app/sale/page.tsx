import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/server';
import SportList from '../_components/ui/SportList';

export default async function SaleList({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  try {
    const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

    const sale = await api.sale.get(gender);
    const sports = await api.category.getSportsInSale();
    if (!sale || sale.products.length === 0) return <MessageWrapper message="No products found" popup={false} />;

    if (sports) {
      return <SportList products={sale.products.map((p) => p.product)} sports={sports} sale={true} />;
    } else {
      return <MessageWrapper message="Unable to fetch sports in sale at this time" popup={false} />;
    }
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" popup={false} />;
  }
}
