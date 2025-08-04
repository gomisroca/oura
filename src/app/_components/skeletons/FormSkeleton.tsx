export default function FormSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-[3.5rem] w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-slate-300 px-4 dark:bg-slate-700"></div>
      <div className="h-[3.5rem] w-[20vw] animate-pulse rounded-sm border border-slate-600/10 bg-slate-200/30 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10"></div>
    </div>
  );
}
