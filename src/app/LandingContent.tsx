'use client';

import { type Sale } from '@prisma/client';
import { type ProductWithSizes } from 'types';
import Button from './_components/ui/Button';
import Carousel from './_components/ui/Carousel';
import { useRouter } from 'next/navigation';

export default function LandingContent({ sale, products }: { sale?: Sale; products: ProductWithSizes[] }) {
  const router = useRouter();
  const handleBrowse = (type: 'sale' | 'all') => () => {
    if (type === 'sale') {
      router.push('/sale');
    } else {
      router.push('/sport');
    }
  };
  return (
    <div className="absolute left-0 right-0 top-0 flex min-h-screen flex-col items-center justify-evenly overflow-hidden">
      {/* Sale Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-center text-5xl font-bold drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(255_255_255_/_40%)] dark:[text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] md:text-7xl">
          {sale ? sale.name.toUpperCase() : 'OURA'}
        </h1>
        <p className="text-center text-sm font-bold uppercase drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(255_255_255_/_40%)] dark:[text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
          {sale
            ? `${sale.startDate.toLocaleDateString()} - ${sale.endDate.toLocaleDateString()}`
            : 'Sports with a purpose'}
        </p>
      </div>
      {products && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Button
            onClick={sale ? handleBrowse('sale') : handleBrowse('all')}
            className="w-[80vw] md:w-[25vw] 2xl:w-[10vw]">
            {sale ? 'Browse Sale' : 'Browse Products'}
          </Button>
          <Carousel products={products} />
        </div>
      )}
    </div>
  );
}
