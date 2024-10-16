export default function SportListSkeleton() {
  return (
    <div className="relative flex flex-wrap items-center justify-center gap-4 overflow-x-hidden">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="relative flex h-[25rem] w-[20rem] animate-pulse flex-col items-center justify-center rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10"></div>
      ))}
      <h1 className="absolute text-center text-2xl font-bold">Loading...</h1>
    </div>
  );
}
