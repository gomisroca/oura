import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type ProductWithSizes } from 'types';

import { env } from '@/env';
import { api } from '@/trpc/server';

import LandingContent from './LandingContent';

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
    <div className="absolute top-0 right-0 bottom-0 left-0">
      {/* Landing Image */}
      <Image
        src={landingImageSrc}
        alt={sale ? 'Current Sale' : 'Default Landing'}
        priority
        fill
        loading="eager"
        className={`pointer-events-none absolute top-0 right-0 bottom-0 left-0 min-h-screen w-full object-cover object-center xl:h-full dark:brightness-50 ${!sale && 'opacity-50 grayscale'}`}
      />

      {/* Render content only if products are available */}
      <LandingContent sale={sale ?? undefined} products={products ?? undefined} />
    </div>
  );
}

export default LandingHero;
