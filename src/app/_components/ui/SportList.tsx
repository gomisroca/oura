'use client';

import { type Sport } from '@prisma/client';
import React from 'react';
import { type ProductWithSizes } from 'types';
import Carousel from './Carousel';
import { useRouter } from 'next/navigation';

function SportList({ products, sports, sale = false }: { products: ProductWithSizes[]; sports: Sport[]; sale?: Boolean }) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 overflow-x-hidden">
      {sports.map(
        (sport) =>
          products.filter((product) => product.sportId === sport.id).length > 0 && (
            <div key={sport.id} className="relative flex items-center justify-center">
              <h2
                onClick={() => router.push(`${sale ? '/sale/' + sport.id : '/sport/' + sport.id}`)}
                className="absolute z-[1] cursor-pointer border-4 border-slate-200 bg-slate-950/20 p-4 text-4xl font-bold uppercase text-slate-200 drop-shadow-lg transition duration-200 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] hover:border-slate-300 hover:bg-slate-950/30">
                {sport.name}
              </h2>
              <Carousel products={products.filter((product) => product.sportId === sport.id)} sportListView={true} />
            </div>
          )
      )}
    </div>
  );
}

export default SportList;
