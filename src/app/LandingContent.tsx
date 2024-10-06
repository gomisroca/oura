'use client';

import { type Sale } from '@prisma/client';
import { type ProductWithSizes } from 'types';
import Button from './_components/ui/Button';
import Carousel from './_components/ui/Carousel';

export default function LandingContent({ sale, products }: { sale: Sale; products: ProductWithSizes[] }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 mb-14 flex flex-col items-center justify-end gap-10">
      {/* Sale Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-7xl font-bold drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(255_255_255_/_40%)] dark:[text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
          {sale.name.toUpperCase()}
        </h1>
        <h6 className="font-bold drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(255_255_255_/_40%)] dark:[text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
          {sale.startDate.toLocaleDateString()} - {sale.endDate.toLocaleDateString()}
        </h6>
      </div>
      <Button onClick={() => alert('Browse Sale')}>Browse Sale</Button>

      {products && <Carousel products={products} />}
    </div>
  );
}
