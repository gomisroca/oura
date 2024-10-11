'use client';

import { type Sport } from '@prisma/client';
import React from 'react';
import { type ProductWithSizes } from 'types';
import Carousel from './Carousel';
import { useRouter } from 'next/navigation';

function SportList({
  products,
  sports,
  sale = false
}: {
  products: ProductWithSizes[];
  sports: Sport[];
  sale?: boolean; // Use lowercase 'boolean'
}) {
  const router = useRouter();

  // Organize products by sport ID for better performance
  const productsBySport = products.reduce<Record<number, ProductWithSizes[]>>((acc, product) => {
    const sportId = product.sportId; // Local variable for easier access
    if (sportId !== undefined && sportId !== null) { // Check if sportId is defined and not null
      if (!acc[sportId]) {
        acc[sportId] = [];
      }
      acc[sportId].push(product);
    }
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 overflow-x-hidden">
      {sports.map((sport) => {
        const sportProducts = productsBySport[sport.id];
        if (sportProducts && sportProducts.length > 0) {
          return (
            <div key={sport.id} className="relative flex items-center justify-center">
              <h2
                onClick={() => router.push(`${sale ? '/sale/' + sport.id : '/sport/' + sport.id}`)}
                className="absolute z-[1] cursor-pointer border-4 border-slate-200 bg-slate-950/20 p-4 text-4xl font-bold uppercase text-slate-200 drop-shadow-lg transition duration-200 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] hover:border-slate-300 hover:bg-slate-950/30"
                aria-label={`View products for ${sport.name}`}>
                {sport.name}
              </h2>
              <Carousel products={sportProducts} sportListView={true} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default SportList;
