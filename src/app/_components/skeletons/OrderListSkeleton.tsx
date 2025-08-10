import React from 'react';

function OrderListSkeleton() {
  return (
    <div className="animation-pulse mx-auto flex h-[60vh] w-[45rem] items-center justify-center rounded-sm bg-neutral-200/90 p-4 shadow-md dark:bg-neutral-800/90">
      <h1 className="absolute text-center text-2xl font-bold">Loading...</h1>
    </div>
  );
}

export default OrderListSkeleton;
