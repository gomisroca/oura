import ProductList from '@/app/_components/product/ProductList';
import { api } from '@/trpc/server';

async function RelatedProducts({ productId, categoryId }: { productId: string; categoryId: number }) {
  let products = await api.product.getByCategory({ categoryId: categoryId });

  if (products) {
    products = products
      .filter((p) => p.id !== productId)
      .sort((a, b) => b.amountSold + b.views - (a.amountSold + a.views))
      .slice(0, 3);
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <title className="text-xl">Related Products</title>
        <ProductList products={products} />
      </div>
    );
  }
}

export default RelatedProducts;
