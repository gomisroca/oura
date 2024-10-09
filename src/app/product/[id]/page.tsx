import { api } from '@/trpc/server';
import { type ProductWithSizes } from 'types';
import ProductContent from './ProductContent';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import ProductBackButtons from './ProductBackButtons';
import RelatedProducts from './RelatedProducts';

export default async function ProductView({ params }: { params: { id: string } }) {
  try {
    const product: ProductWithSizes | null = await api.product.visit({ id: params.id });
    if (!product) {
      return <MessageWrapper message="Product not found" />;
    }

    return (
      <div className="flex flex-col gap-4">
        <ProductBackButtons product={product} />
        <ProductContent product={product} />
        {product.categoryId && <RelatedProducts productId={params.id} categoryId={product.categoryId} />}
      </div>
    );
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch product at this time" />;
  }
}
