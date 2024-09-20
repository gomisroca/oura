/**
 * Renders a product list component.
 *
 * @example
 * <ProductList />
 */

import { api } from '@/trpc/server';
import React from 'react';
import ProductCard from './ProductCard';

async function ProductList() {
  const products = await api.product.getAll();

  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
