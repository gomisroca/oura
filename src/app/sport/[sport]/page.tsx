import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProductList from '@/app/_components/product/ProductList';
import BackButton from '@/app/_components/ui/BackButton';
import { api } from '@/trpc/server';

export default async function SportList({
  params,
  searchParams,
}: {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ gender: 'man' | 'woman' }>;
}) {
  const paramsData = await params;
  const searchParamsData = await searchParams;
  const gender =
    searchParamsData?.gender === 'man' ? 'MALE' : searchParamsData?.gender === 'woman' ? 'FEMALE' : undefined;

  try {
    const products = await api.product.getBySport({ sportId: Number(paramsData.sport), gender: gender });
    const categories = await api.category.getCategories({ sportId: Number(paramsData.sport) });

    if (products.length === 0) return <p>No products found in this category.</p>;
    return (
      <div className="flex h-full flex-col justify-start gap-4">
        <div className="flex flex-row items-center justify-center md:absolute md:top-24 md:right-0 md:left-0">
          <BackButton>Sports</BackButton>
          <div className="cursor-not-allowed items-center justify-center text-sm uppercase">
            <span className="text-neutral-800 dark:text-neutral-400">{products[0]?.sport?.name}</span>
          </div>
        </div>
        {categories && categories.length > 0 && (
          <div className="flex flex-row items-center justify-center gap-x-4 md:absolute md:top-34 md:right-0 md:left-0">
            {categories?.map((category) => (
              <Link href={`/sport/${paramsData.sport}/${category.id}`} key={category.id}>
                <h2 className="cursor-pointer text-sm uppercase transition-colors duration-200 hover:text-neutral-700 dark:hover:text-neutral-300">
                  {category.name}
                </h2>
              </Link>
            ))}
          </div>
        )}
        <ProductList products={products} />
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
