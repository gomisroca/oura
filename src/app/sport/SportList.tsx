'use client';

import { type Sport } from 'generated/prisma';
import { useRouter } from 'next/navigation';
import React from 'react';
import { type ProductWithSizes } from 'types';

import Button from '../_components/ui/Button';
import Carousel from '../_components/ui/Carousel';

function SportList({
  products,
  sports,
  sale = false,
}: {
  products: ProductWithSizes[];
  sports: Sport[];
  sale?: boolean; // Use lowercase 'boolean'
}) {
  const router = useRouter();

  // Organize products by sport ID for better performance
  const productsBySport = products.reduce<Record<number, ProductWithSizes[]>>((acc, product) => {
    const sportId = product.sportId; // Local variable for easier access
    if (sportId !== undefined && sportId !== null) {
      // Check if sportId is defined and not null
      acc[sportId] ??= [];
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
            <div key={sport.id} className="relative flex items-center justify-center overflow-x-hidden">
              <Button
                onClick={() => router.push(`${sale ? '/sale/' + sport.id : '/sport/' + sport.id}`)}
                className="absolute z-[1] w-full cursor-pointer p-4 text-4xl font-bold uppercase drop-shadow-lg"
                aria-label={`View products for ${sport.name}`}>
                {sport.name}
              </Button>
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
