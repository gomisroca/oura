/**
 * Renders a product list component.
 *
 * @example
 * <ProductList />
 */

import React from 'react';
import ProductCard from './ProductCard';
import { type ProductWithSizes } from 'types';
import ProductListLoading from './ProductListLoading';

async function ProductList({ products }: { products: ProductWithSizes[] }) {
  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {products.map((product) => (
        <React.Suspense key={product.id} fallback={<ProductListLoading />}>
          <ProductCard key={product.id} product={product} />
        </React.Suspense>
      ))}
    </div>
  );
}

export default React.memo(ProductList);
