'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { type ProductWithSizes } from 'types';

import { env } from '@/env';

function ProductCard({
  product,
  className,
  loadingMethod = 'lazy',
}: {
  product: ProductWithSizes;
  className?: string;
  loadingMethod?: 'lazy' | 'eager';
}) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails((prev) => !prev);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggleDetails}
      onKeyDown={(e) => e.key === 'Enter' && toggleDetails()}
      className={twMerge(
        'group relative flex h-[25rem] w-[20rem] flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-neutral-600/10 bg-neutral-200/30 shadow-md transition duration-500 ease-in-out hover:border-neutral-600/40 hover:bg-neutral-300/30 dark:border-neutral-400/10 dark:bg-neutral-800/30 dark:shadow-neutral-500/10 hover:dark:border-neutral-400/40 dark:hover:bg-neutral-700/30',
        className
      )}
      aria-label={`Product Card for ${product.name}`}>
      <Image
        unoptimized
        className="cursor-pointer rounded-sm duration-200 ease-in-out group-hover:contrast-[1.05]"
        src={
          product.image
            ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}?width=200&height=250`
            : `/ph_item.png`
        }
        alt={product.name}
        fill
        blurDataURL="/ph_item.png"
        placeholder="blur"
        priority={loadingMethod === 'eager'}
        loading={loadingMethod}
      />
      <div
        className={`absolute bottom-[-10rem] flex w-full flex-col items-center justify-center gap-2 bg-neutral-200/90 p-4 opacity-0 duration-500 ease-in-out group-hover:translate-y-[-10rem] group-hover:opacity-100 dark:bg-neutral-800/90 ${showDetails ? 'translate-y-[-10rem] opacity-100' : 'opacity-0'}`}>
        <Link href={`/product/${product.id}`} aria-label={`View details for ${product.name}`}>
          <h2 className="line-clamp-1 text-center text-lg font-semibold underline underline-offset-4 hover:scale-105 md:line-clamp-2">
            {product.name}
          </h2>
        </Link>
        <p className="line-clamp-2 text-sm text-ellipsis md:line-clamp-3">{product.description}</p>
        <div className="relative items-center justify-center text-center">
          {product.sales.length > 0 ? (
            <>
              <div className="flex flex-row gap-2">
                <p className="text-sm line-through">{product.basePrice}€</p>
                <p className="text-sm font-bold text-red-600 uppercase">ON SALE</p>
              </div>
              <p className="text-xl font-bold">{product.onSalePrice}€</p>
            </>
          ) : (
            <p className="text-xl font-bold"> {product.basePrice}€</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
