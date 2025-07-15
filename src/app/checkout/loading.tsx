import CartListSkeleton from '../_components/skeletons/CartListSkeleton';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <CartListSkeleton foldableView={false} />
      <div className="h-[3.5rem] w-[80vw] animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 shadow-md md:w-[25vw] 2xl:w-[10vw] dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10"></div>
    </div>
  );
}
