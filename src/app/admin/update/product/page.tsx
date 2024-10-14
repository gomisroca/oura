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
      <div className="flex flex-wrap gap-2">
        {products.map((product) => (
          <Link href={`/admin/update/product/${product.id}`} key={product.id}>
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-600/10 bg-slate-200/30 p-2 hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:hover:bg-slate-700/30">
              <Image
                src={
                  product.image
                    ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}?width=200&height=250`
                    : `/ph_item.png`
                }
                alt={product.name}
                width={100}
                height={100}
              />
              <p>{product.name}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  return null;
}
