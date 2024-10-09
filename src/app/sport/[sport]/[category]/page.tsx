import ProductList from '@/app/_components/product/ProductList';
import BackButton from '@/app/_components/ui/BackButton';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/server';

export default async function CategoryList({
  params,
  searchParams,
}: {
  params: { sport: string; category: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  try {
    const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

    const products = await api.product.getByCategory({ categoryId: Number(params.category), gender: gender });
    if (products.length === 0) return <MessageWrapper message="No products found" popup={false} />;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-center md:absolute md:left-0 md:right-0 md:top-24">
          <BackButton>{products[0]?.sport?.name ?? 'Sport'}</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-slate-800 dark:text-slate-400">{products[0]?.category?.name}</span>
          </div>
        </div>
        <ProductList products={products} />
      </div>
    );
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" popup={false} />;
  }
}
