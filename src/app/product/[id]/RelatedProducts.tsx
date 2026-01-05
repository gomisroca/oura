import ProductList from '@/app/_components/product/ProductList';
import { api } from '@/trpc/server';

async function RelatedProducts({ productId, categoryId }: { productId: string; categoryId: number }) {
  const products = await api.product.getByCategory({ categoryId: categoryId });

  const relatedProducts = products
    .filter((p) => p.id !== productId)
    .sort((a, b) => b.amountSold + b.views - (a.amountSold + a.views))
    .slice(0, 3);

  if (relatedProducts.length === 0) return null;
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-xl uppercase">Related Products</p>
      <ProductList products={relatedProducts} />
    </div>
  );
}

export default RelatedProducts;
