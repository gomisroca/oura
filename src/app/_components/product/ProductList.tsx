/**
 * Renders a product list component.
 *
 * @example
 * <ProductList />
 */

import React from 'react';
import ProductCard from './ProductCard';
import { type ProductWithSizes } from 'types';

async function ProductList({ products }: { products: ProductWithSizes[] }) {
  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
