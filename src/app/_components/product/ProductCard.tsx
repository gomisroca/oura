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
import { type ProductWithSizes } from 'types';

function ProductCard({ product }: { product: ProductWithSizes }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div
      onClick={() => setShowDetails(!showDetails)}
      key={product.id}
      className="group relative flex h-[25rem] w-[25rem] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md transition duration-500 ease-in-out hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10 hover:dark:border-slate-400/40 dark:hover:bg-slate-700/30">
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
        className={`absolute bottom-[-10rem] z-10 flex w-full flex-col items-center justify-center gap-2 bg-slate-200 p-4 opacity-0 duration-500 ease-in-out group-hover:translate-y-[-10rem] group-hover:opacity-100 dark:bg-slate-800 ${showDetails ? 'translate-y-[-10rem] opacity-100' : 'opacity-0'}`}>
        {/* Basic Information */}
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Base Price: {product.basePrice}</p>
        <p>On Sale Price: {product.onSalePrice}</p>
        {/* Size and Color Information */}
        <div>
          {product.sizes.map((size) => (
            <div key={size.name} className="flex flex-row items-center gap-2">
              <p className="font-bold">{size.name}</p>
              <div className="flex flex-row items-center">
                {size.colors.map((color) => (
                  <span
                    key={color.name}
                    className={`mr-2 inline-block h-4 w-4 rounded-full border border-slate-800/50 ${color.name === 'black' ? 'bg-black' : color.name === 'white' ? 'bg-white' : `bg-${color.name}-500`} `}></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
