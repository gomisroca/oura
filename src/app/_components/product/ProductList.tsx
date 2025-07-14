/**
 * Renders a product list component.
 *
 * @example
 * <ProductList />
 */

import React, { useMemo } from 'react';
import { type ProductWithSizes } from 'types';

import ProductListSkeleton from '../skeletons/ProductListSkeleton';
import ProductCard from './ProductCard';

async function ProductList({ products }: { products: ProductWithSizes[] }) {
  const memoizedProducts = useMemo(() => products, [products]);
  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {memoizedProducts.map((product) => (
        <div role="listitem" key={product.id}>
          <React.Suspense fallback={<ProductListSkeleton />}>
            <ProductCard key={product.id} product={product} />
          </React.Suspense>
        </div>
      ))}
    </div>
  );
}

export default React.memo(ProductList);
