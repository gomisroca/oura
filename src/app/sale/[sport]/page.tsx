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
  const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const sale = await api.sale.getProductsBySport({ sportId: Number(params.sport), gender: gender });

    if (!sale || sale.products.length === 0) return <MessageWrapper message="No products found" popup={false} />;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-center md:absolute md:left-0 md:right-0 md:top-24">
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
