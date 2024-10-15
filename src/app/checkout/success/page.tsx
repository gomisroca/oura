import { api } from '@/trpc/server';
import React from 'react';
import { type OrderWithProducts } from 'types';
import OrderList from './OrderList';
import { notFound } from 'next/navigation';

async function CheckoutSuccess({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  try {
    if (!searchParams?.orderId) return <div>Missing Order ID</div>;

    // Get the order details
    const order: OrderWithProducts | undefined = await api.checkout.getOrder({ orderId: searchParams.orderId });

    return <OrderList products={order.products} id={order.id} createdAt={order.createdAt} />;
  } catch (_error) {
    return notFound();
  }
}

export default CheckoutSuccess;
