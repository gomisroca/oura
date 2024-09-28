import CartList from '@/app/_components/cart/CartList';
import { api } from '@/trpc/server';
import React from 'react';
import { type OrderWithProducts } from 'types';

async function CheckoutSuccess({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  try {
    if (!searchParams?.orderId) return <div>Missing Order ID</div>;

    // Get the order details
    const order: OrderWithProducts | undefined = await api.checkout.getOrder({ orderId: searchParams.orderId });

    return (
      <div className="flex flex-col gap-2 px-5">
        <p>Order ID: {order.id}</p>
        <CartList orderView={true} />
      </div>
    );
  } catch (_error) {
    return <div>Unable to fetch order details at this time</div>;
  }
}

export default CheckoutSuccess;
