'use client';

import { env } from '@/env';
import { api } from '@/trpc/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProductUpdateList() {
  const { data: products } = api.product.getAll.useQuery();
  if (products) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {products.map((product) => (
          <Link href={`/admin/update/product/${product.id}`} key={product.id} className="h-[20rem] w-[20rem]">
            <div className="flex h-full w-full flex-col items-center gap-2 rounded-xl border border-slate-600/10 bg-slate-200/30 hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:hover:bg-slate-700/30">
              <Image
                unoptimized
                src={
                  product.image
                    ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}?width=200&height=250`
                    : `/ph_item.png`
                }
                alt={product.name}
                width={200}
                height={200}
                className="h-3/4 w-full rounded-t-xl object-cover"
              />
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <h1 className="text-xl font-bold">{product.name}</h1>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  return null;
}
