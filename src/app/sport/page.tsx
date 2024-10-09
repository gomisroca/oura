import SportList from '../_components/ui/SportList';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/server';

export default async function SportsList({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  try {
    const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

    const products = await api.product.getAll(gender);
    const sports = await api.category.getSports();
    if (products.length === 0) return <MessageWrapper message="No products found" popup={false} />;

    return <SportList products={products} sports={sports} />;
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" popup={false} />;
  }
}
