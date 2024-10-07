import Image from 'next/image';
import { env } from '@/env';
import { api } from '@/trpc/server';
import LandingContent from './LandingContent';
import { type ProductWithSizes } from 'types';

async function LandingHero() {
  // Get ongoing sale info
  const sale = await api.sale.get();

  // Get products in the sale, if there is one, otherwise get all products
  let products: ProductWithSizes[] | undefined;
  if (sale) {
    products = sale?.products;
  } else {
    products = await api.product.getAll();
  }
  // Sort products by popularity (views + sales)
  products = products.sort((a, b) => b.amountSold + b.views - (a.amountSold + a.views));

  return (
    <>
      {/* Landing Image */}
      <Image
        src={
          sale
            ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${sale.image}`
            : '/landing.jpg'
        }
        alt="sale"
        width={1920}
        height={1080}
        className={`pointer-events-none absolute bottom-0 left-0 right-0 top-0 min-h-screen w-full object-cover object-center xl:h-full ${!sale ? 'opacity-50 grayscale dark:brightness-50' : ''}`}
      />
      {products && <LandingContent sale={sale ?? undefined} products={products} />}
    </>
  );
}

export default LandingHero;
