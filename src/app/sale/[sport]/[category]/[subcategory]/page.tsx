import ProductList from '@/app/_components/product/ProductList';
import BackButton from '@/app/_components/ui/BackButton';
import { api } from '@/trpc/server';
import { notFound } from 'next/navigation';

export default async function SubcategoryList({
  params,
  searchParams,
}: {
  params: { sport: string; category: string; subcategory: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const sale = await api.sale.getProductsBySubcategory({
      subcategoryId: Number(params.subcategory),
      gender: gender,
    });

    if (!sale || sale.products.length === 0) notFound();
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-center md:absolute md:left-0 md:right-0 md:top-24">
          <BackButton steps={-3}>Sale</BackButton>
          <BackButton steps={-2}>{sale.products[0]?.product.sport?.name ?? 'Sport'}</BackButton>
          <BackButton>{sale.products[0]?.product.category?.name ?? 'Category'}</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-slate-800 dark:text-slate-400">{sale.products[0]?.product.subcategory?.name}</span>
          </div>
        </div>
        <ProductList products={sale.products.map((p) => p.product)} />
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
