import { notFound } from 'next/navigation';
import React from 'react';
import { type OrderWithProducts } from 'types';

import { api } from '@/trpc/server';

import OrderList from './OrderList';

async function CheckoutSuccess({ searchParams }: { searchParams: Promise<{ orderId: string }> }) {
  const orderId = (await searchParams).orderId;
  try {
    if (!orderId) return <div>Missing Order ID</div>;

    // Get the order details
    const order: OrderWithProducts = await api.checkout.getOrder({ orderId });

    return (
      <div className="flex">
        <OrderList
          products={order.products}
          id={order.id}
          createdAt={order.createdAt}
          address={order.address ?? undefined}
        />
      </div>
    );
  } catch (_error) {
    return notFound();
  }
}

export default CheckoutSuccess;
