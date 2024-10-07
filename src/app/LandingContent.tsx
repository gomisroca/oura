'use client';

import { type Sale } from '@prisma/client';
import { type ProductWithSizes } from 'types';
import Button from './_components/ui/Button';
import Carousel from './_components/ui/Carousel';

export default function LandingContent({ sale, products }: { sale: Sale; products: ProductWithSizes[] }) {
  return (
    <div className="absolute left-0 right-0 top-0 flex min-h-screen flex-col items-center justify-evenly overflow-hidden">
      {/* Sale Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-center text-5xl font-bold drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(255_255_255_/_40%)] dark:[text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] md:text-7xl">
          {sale.name.toUpperCase()}
        </h1>
        <h6 className="text-center font-bold drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(255_255_255_/_40%)] dark:[text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
          {sale.startDate.toLocaleDateString()} - {sale.endDate.toLocaleDateString()}
        </h6>
      </div>
      {products && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Button onClick={() => alert('Browse Sale')} className="w-[80vw] md:w-[25vw] 2xl:w-[10vw]">
            Browse Sale
          </Button>
          <Carousel products={products} />
        </div>
      )}
    </div>
  );
}
