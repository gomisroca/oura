'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { type ProductWithSizes } from 'types';

import ColorBubble from '@/app/_components/ui/ColorBubble';
import { env } from '@/env';

function ProductContent({ product }: { product: ProductWithSizes }) {
  const renderedSizes = useMemo(
    () =>
      product.sizes.map((size) => (
        // should be maybe flex wrap?
        <div key={size.name} className="flex flex-row items-center justify-between gap-2 rounded-sm px-2 py-1">
          <p className="font-bold">{size.name}</p>
          <div className="flex flex-row items-center gap-2">
            {size.colors.map((color) => (
              <ColorBubble key={color.id + color.name} product={product} sizeId={size.id} color={color} />
            ))}
          </div>
        </div>
      )),
    [product]
  );

  return (
    <div
      key={product.id}
      className="flex max-w-5xl flex-col items-center justify-center rounded-sm bg-neutral-100/60 shadow-md transition duration-500 ease-in-out hover:bg-neutral-50/60 lg:flex-row dark:bg-neutral-900/60 dark:shadow-neutral-500/10 dark:hover:bg-neutral-950/60">
      <Image
        unoptimized
        className="w-full rounded-t-sm object-cover lg:h-full lg:w-auto lg:rounded-sm lg:p-4"
        src={
          product.image
            ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}`
            : '/ph_item.png'
        }
        alt={product.name}
        width={400}
        height={400}
      />
      <div className="flex flex-col items-center justify-center gap-8 px-10 py-8 lg:px-20 lg:py-4">
        {/* Basic Information */}
        <h2 className="text-center text-lg font-semibold md:text-2xl">{product.name}</h2>
        <p>{product.description}</p>
        <div className="relative items-center justify-center text-center">
          {product.sales.length > 0 && (
            <div className="flex flex-row gap-2">
              <p className="text-sm line-through">{product.basePrice}€</p>
              <p className="text-sm font-bold text-red-600 uppercase">ON SALE</p>
            </div>
          )}
          {product.sales.length > 0 && <p className="text-xl font-bold">{product.onSalePrice}€</p>}
          {product.sales.length === 0 && <p className="text-xl font-bold"> {product.basePrice}€</p>}
        </div>
        {/* Size and Color Information */}
        <div className="flex flex-wrap gap-2">{renderedSizes}</div>
      </div>
    </div>
  );
}

export default ProductContent;
