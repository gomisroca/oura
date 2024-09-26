import ColorBubble from '@/app/_components/ui/ColorBubble';
import { env } from '@/env';
import { api } from '@/trpc/server';
import { type Order, type Color, type Product, type Size } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

interface OrderProduct {
  id: number;
  price: number;
  orderId: string;
  productId: string;
  sizeId: string;
  colorId: string;
  product: Product;
  size: Size;
  color: Color;
}

interface OrderWithProducts extends Order {
  products: OrderProduct[];
}

async function CheckoutSuccess({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  if (!searchParams?.orderId) return <div>Missing Order ID</div>;

  // Get the order details
  const order: OrderWithProducts | null = await api.checkout.getOrder({ orderId: searchParams.orderId });

  return (
    <div className="flex flex-col gap-2 px-5">
      <p>Order ID: {order.id}</p>
      {order.products?.map((product) => (
        <div key={product.id} className="flex flex-row gap-2 rounded-lg border p-5">
          <Image
            src={
              product.product.image
                ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.product.image}`
                : '/ph_item.png'
            }
            className="rounded-lg"
            alt={product.product.name}
            width={200}
            height={200}
          />
          <div className="flex flex-col gap-2">
            <p>{product.product.name}</p>
            <p>${product.price.toFixed(2)}</p>
            <div className="flex flex-row items-center gap-2">
              {product.size?.name && <p>{product.size.name}</p>}
              {product.color?.name && <ColorBubble color={product.color.name} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CheckoutSuccess;
