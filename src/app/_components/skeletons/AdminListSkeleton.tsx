export default function AdminListSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" role="status" aria-live="polite">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="relative flex h-[20rem] w-[20rem] animate-pulse flex-col items-center justify-center rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10"></div>
      ))}
    </div>
  );
}
