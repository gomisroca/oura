import CartListSkeleton from '../_components/skeletons/CartListSkeleton';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <CartListSkeleton foldableView={false} />
      <div className="h-[3.5rem] w-[80vw] animate-pulse rounded-sm border border-neutral-600/10 bg-neutral-200/30 shadow-md md:w-[25vw] 2xl:w-[10vw] dark:border-neutral-400/10 dark:bg-neutral-800/30 dark:shadow-neutral-500/10"></div>
    </div>
  );
}
