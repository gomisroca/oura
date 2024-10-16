import OrderListSkeleton from '../_components/skeletons/OrderListSkeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl uppercase">Order History</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        <OrderListSkeleton />
      </div>
    </div>
  );
}
