import { env } from '@/env';
import { type Product } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

function ProductCard({ product }: { product: Product }) {
  return (
    <div
      key={product.id}
      className="group relative flex h-[45rem] w-[30rem] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md transition duration-200 ease-in-out hover:border-slate-600/20 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 hover:dark:border-slate-400/20 dark:hover:bg-slate-700/30">
      {product.image && (
        <Image
          className="h-full w-full rounded-t-xl object-cover duration-200 ease-in-out group-hover:contrast-[1.05]"
          src={`https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}`}
          alt={product.name}
          width={400}
          height={400}
        />
      )}
      <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Base Price: {product.basePrice}</p>
        <p>On Sale Price: {product.onSalePrice}</p>
      </div>
    </div>
  );
}

export default ProductCard;
