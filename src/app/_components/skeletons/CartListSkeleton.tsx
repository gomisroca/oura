import React from 'react';

function CartListSkeleton({ foldableView = false }: { foldableView?: boolean }) {
  return (
    <div
      className={`animation-pulse mx-auto flex items-center justify-center rounded-sm bg-neutral-200/90 p-4 shadow-md dark:bg-neutral-800/90 ${foldableView ? 'h-[40vh] w-[20rem]' : 'h-[60vh] w-[40rem]'}`}>
      <h1 className="absolute text-center text-2xl font-bold">Loading...</h1>
    </div>
  );
}

export default CartListSkeleton;
