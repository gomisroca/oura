'use client';

/**
 * Renders a product card component.
 *
 * @param {{ product: Product; }} props - The props for the ProductCard component.
 *
 * @example
 * <ProductCard product={product} />
 *
 */

import { env } from '@/env';
import Image from 'next/image';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { type ProductWithSizes } from 'types';
import ColorBubble from '../ui/ColorBubble';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Button from '../ui/Button';

function ProductCard({ product, className }: { product: ProductWithSizes; className?: string }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div
      onClick={() => setShowDetails(!showDetails)}
      key={product.id}
      className={twMerge(
        'group relative flex h-[25rem] w-[20rem] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md transition duration-500 ease-in-out hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10 hover:dark:border-slate-400/40 dark:hover:bg-slate-700/30',
        className
      )}>
      <Image
        className="h-full w-full cursor-pointer rounded-t-xl object-cover duration-200 ease-in-out group-hover:contrast-[1.05]"
        src={
          product.image
            ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}`
            : '/ph_item.png'
        }
        alt={product.name}
        width={400}
        height={400}
      />
      <div
        className={`absolute bottom-[-10rem] flex w-full flex-col items-center justify-center gap-2 bg-slate-200/90 p-4 opacity-0 duration-500 ease-in-out group-hover:translate-y-[-10rem] group-hover:opacity-100 dark:bg-slate-800/90 ${showDetails ? 'translate-y-[-10rem] opacity-100' : 'opacity-0'}`}>
        {/* Basic Information */}
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="relative items-center justify-center text-center">
          {product.sales.length > 0 && (
            <div className="flex flex-row gap-2">
              <p className="text-sm line-through">{product.basePrice}€</p>
              <p className="text-sm font-bold uppercase text-red-600">ON SALE</p>
            </div>
          )}
          {product.sales.length > 0 && <p className="text-xl font-bold">{product.onSalePrice}€</p>}
          {product.sales.length === 0 && <p className="text-xl font-bold"> {product.basePrice}€</p>}
        </div>
        {/* Size and Color Information */}
        <div>
          {product.sizes.map((size) => (
            <div key={size.name} className="flex flex-row items-center justify-between gap-2">
              <p className="font-bold">{size.name}</p>
              <div className="flex flex-row items-center gap-2">
                {size.colors.map((color) => (
                  <ColorBubble key={color.id + color.name} product={product} sizeId={size.id} color={color} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link href={`/product/${product.id}`} className="absolute right-4 top-4">
          <Button className="px-[0.75rem]">
            <FaSearch size={20} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
