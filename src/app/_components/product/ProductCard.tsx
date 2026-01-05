import Image from 'next/image';
import Link from 'next/link';
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
  return (
    <Link
      href={`/product/${product.id}`}
      aria-label={`View details for ${product.name}`}
      className={twMerge(
        'group relative flex h-[20rem] w-[17rem] flex-col items-center justify-center gap-2 overflow-hidden rounded-sm bg-neutral-100 shadow-sm md:h-[25rem] md:w-[20rem] dark:bg-neutral-900 dark:shadow-neutral-500/10',
        className
      )}>
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
      <div className="absolute bottom-[-10rem] flex w-full flex-col items-center justify-center gap-2 bg-neutral-100/95 p-4 opacity-0 duration-500 ease-in-out group-hover:translate-y-[-10rem] group-hover:opacity-100 dark:bg-neutral-900/95">
        <h2 className="line-clamp-1 text-center text-lg font-semibold md:line-clamp-2">{product.name}</h2>
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
    </Link>
  );
}

export default ProductCard;
