'use client';

import ColorBubble from '@/app/_components/ui/ColorBubble';
import { env } from '@/env';
import Image from 'next/image';
import { type ProductWithSizes } from 'types';

function ProductContent({ product }: { product: ProductWithSizes }) {
  return (
    <div
      key={product.id}
      className="group relative flex h-[60vh] w-[75wv] flex-col items-center justify-center rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md transition duration-500 ease-in-out hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10 hover:dark:border-slate-400/40 dark:hover:bg-slate-700/30 md:h-[70vh] md:w-[60vw]">
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
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-b-xl bg-slate-200/90 p-4 dark:bg-slate-800/90">
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
            <div key={size.name} className="flex flex-row items-center gap-2">
              <p className="font-bold">{size.name}</p>
              <div className="flex flex-row items-center gap-2">
                {size.colors.map((color) => (
                  <ColorBubble key={color.id + color.name} product={product} sizeId={size.id} color={color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductContent;
