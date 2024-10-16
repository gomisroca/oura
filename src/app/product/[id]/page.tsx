import { api } from '@/trpc/server';
import { type ProductWithSizes } from 'types';
import ProductContent from './ProductContent';
import ProductBackButtons from './ProductBackButtons';
import RelatedProducts from './RelatedProducts';
import { notFound } from 'next/navigation';

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
