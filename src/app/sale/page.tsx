import ProductList from '@/app/_components/product/ProductList';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/server';

export default async function SaleList({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  try {
    const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

    const sale = await api.sale.get(gender);
    if (!sale || sale.products.length === 0) return <MessageWrapper message="No products found" popup={false} />;
    return <ProductList products={sale.products.map((p) => p.product)} />;
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" popup={false} />;
  }
}
