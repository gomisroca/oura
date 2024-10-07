import Image from 'next/image';
import { env } from '@/env';
import { api } from '@/trpc/server';
import MessageWrapper from './_components/ui/MessageWrapper';
import LandingContent from './LandingContent';
import { type ProductWithSizes } from 'types';

async function LandingHero() {
  const sale = await api.sale.get();
  const products: ProductWithSizes[] | undefined = sale?.products.sort(
    (a, b) => b.amountSold + b.views - (a.amountSold + a.views)
  );

  // If there is no sale, it should go back to some defaults, a default image, default sale name 'Hottest Deals' or whatever, and the most populart products (sales+views)
  if (!sale) return <MessageWrapper message="Unable to fetch sale at this time" />;
  return (
    <>
      {/* Sale Image */}
      <Image
        src={`https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${sale.image}`}
        alt="sale"
        width={1920}
        height={1080}
        className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 min-h-screen w-full object-cover object-center xl:h-full"
      />
      {products && <LandingContent sale={sale} products={products} />}
    </>
  );
}

export default LandingHero;
