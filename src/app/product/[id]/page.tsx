import { notFound } from 'next/navigation';
import { type ProductWithSizes } from 'types';

import { api } from '@/trpc/server';

import ProductBackButtons from './ProductBackButtons';
import ProductContent from './ProductContent';
import RelatedProducts from './RelatedProducts';

export default async function ProductView({ params }: { params: { id: string } }) {
  try {
    const product: ProductWithSizes | null = await api.product.visit({ id: params.id });
    if (!product) {
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <ProductBackButtons product={product} />
        <ProductContent product={product} />
        {product.categoryId && <RelatedProducts productId={params.id} categoryId={product.categoryId} />}
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
