import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';

import OrderList from '../checkout/success/OrderList';

export default async function OrderHistory() {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect('/');
  }

  const orders = await api.checkout.getOrderHistory();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl uppercase">Order History</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        {orders
          .filter((order) => order.confirmed && order.products.length > 0)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((order) => (
            <div key={order.id}>
              <OrderList
                products={order.products}
                id={order.id}
                createdAt={order.createdAt}
                address={order.address ?? undefined}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
