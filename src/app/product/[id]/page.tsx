import { api } from '@/trpc/server';
import { type ProductWithSizes } from 'types';
import ProductContent from './ProductContent';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';

export default async function ProductView({ params }: { params: { id: string } }) {
  try {
    const product: ProductWithSizes | null = await api.product.visit({ id: params.id });
    if (!product) {
      return <MessageWrapper message="Product not found" />;
    }

    // Add a link to the sport/category/subcategory of the product
    // Add a list of similar products below the product
    return <ProductContent product={product} />;
  } catch (_error) {
    return <MessageWrapper message="Unable to fetch product at this time" />;
  }
}
