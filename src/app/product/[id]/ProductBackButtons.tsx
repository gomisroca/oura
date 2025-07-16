'use client';

import { useRouter } from 'next/navigation';
import { type ProductWithSizes } from 'types';

function ProductBackButton({ product }: { product: ProductWithSizes }) {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center justify-center">
      <div
        onClick={() => router.push('/sport/' + product.sport?.id)}
        className="group mr-2 flex cursor-pointer flex-row items-center justify-center text-sm uppercase">
        <span className="transition-colors duration-200 group-hover:text-slate-700 dark:group-hover:text-slate-300">
          {product.sport?.name ?? 'Sport'}
        </span>
        <span className="pl-1">/</span>
      </div>
      <div
        onClick={() => router.push('/sport/' + product.category?.id + '/' + product.category?.id)}
        className="group mr-2 flex cursor-pointer flex-row items-center justify-center text-sm uppercase">
        <span className="transition-colors duration-200 group-hover:text-slate-700 dark:group-hover:text-slate-300">
          {product.category?.name ?? 'Category'}
        </span>
        <span className="pl-1">/</span>
      </div>
      <div
        onClick={() =>
          router.push('/sport/' + product.sport?.id + '/' + product.category?.id + '/' + product.subcategory?.id)
        }
        className="group mr-2 flex cursor-pointer flex-row items-center justify-center text-sm uppercase">
        <span className="transition-colors duration-200 group-hover:text-slate-700 dark:group-hover:text-slate-300">
          {product.subcategory?.name ?? 'Subcategory'}
        </span>
      </div>
    </div>
  );
}

export default ProductBackButton;
