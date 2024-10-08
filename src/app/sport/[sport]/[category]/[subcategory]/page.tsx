import ProductList from '@/app/_components/product/ProductList';
import BackButton from '@/app/_components/ui/BackButton';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/server';

export default async function SubcategoryList({
  params,
  searchParams,
}: {
  params: { sport: string; category: string; subcategory: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  try {
    const gender = searchParams?.gender === 'man' ? 'MALE' : searchParams?.gender === 'woman' ? 'FEMALE' : undefined;

    const products = await api.product.getBySubcategory({ subcategoryId: Number(params.subcategory), gender: gender });
    if (products.length === 0) return <MessageWrapper message="No products found" popup={false} />;
    return (
      <div className="flex flex-col gap-4">
        <div className="absolute left-0 right-0 top-24 z-10 flex flex-row items-center justify-center">
          <BackButton steps={-2}>{products[0]?.sport?.name ?? 'Sport'}</BackButton>
          <BackButton>{products[0]?.category?.name ?? 'Category'}</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-slate-800 dark:text-slate-400">{products[0]?.subcategory?.name}</span>
          </div>
        </div>
        <ProductList products={products} />
      </div>
    );
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch products at this time" popup={false} />;
  }
}
