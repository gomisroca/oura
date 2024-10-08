import ProductList from '@/app/_components/product/ProductList';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/server';
import BackButton from '@/app/_components/ui/BackButton';

export default async function SportList({
  params,
  searchParams,
}: {
  params: { sport: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  try {
    const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

    const sale = await api.sale.getProductsBySport({ sportId: Number(params.sport), gender: gender });
    if (!sale || sale.products.length === 0) return <MessageWrapper message="No products found" popup={false} />;
    return (
      <div className="flex flex-col gap-4">
        <div className="absolute left-0 right-0 top-24 z-10 flex flex-row items-center justify-center">
          <BackButton>Sale</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-slate-800 dark:text-slate-400">{sale.products[0]?.product.sport?.name}</span>
          </div>
        </div>
        <ProductList products={sale.products.map((p) => p.product)} />
      </div>
    );
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" popup={false} />;
  }
}
