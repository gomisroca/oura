import Image from 'next/image';
import { env } from '@/env';
import { api } from '@/trpc/server';
import { type ProductWithSizes } from 'types';
import LandingContent from './LandingContent';
import { notFound } from 'next/navigation';

async function LandingHero() {
  // Fetch ongoing sale info, wrapped in try-catch for error handling
  let sale;
  let products: ProductWithSizes[] | undefined;

  try {
    sale = await api.sale.get();

    // Fetch products based on sale existence
    products = sale ? sale.products.map((p) => p.product) : await api.product.getAll();

    // Sort products by popularity (views + sales)
    products = products?.sort((a, b) => b.amountSold + b.views - (a.amountSold + a.views));
  } catch (_error) {
    notFound();
  }

  // Set the landing image source, using the sale image if available
  const landingImageSrc = sale
    ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${sale.image}`
    : '/landing.jpg';

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0">
      {/* Landing Image */}
      <Image
        src={landingImageSrc}
        alt={sale ? 'Current Sale' : 'Default Landing'}
        priority
        fill
        loading="eager"
        className={`pointer-events-none absolute bottom-0 left-0 right-0 top-0 min-h-screen w-full object-cover object-center dark:brightness-50 xl:h-full ${!sale && 'opacity-50 grayscale'}`}
      />

      {/* Render content only if products are available */}
      <LandingContent sale={sale ?? undefined} products={products ?? undefined} />
    </div>
  );
}

export default LandingHero;
