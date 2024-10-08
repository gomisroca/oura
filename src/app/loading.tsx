export default function Loading() {
  return (
    <div className="absolute left-0 right-0 top-0 flex min-h-screen flex-col items-center justify-evenly overflow-hidden">
      {/* Sale Title */}
      <div className="flex flex-col items-center gap-1">
        <div className="h-32 w-[30vw] animate-pulse rounded-full bg-slate-200/30 dark:bg-slate-800/30"></div>
        <div className="h-10 w-[15vw] animate-pulse rounded-full bg-slate-200/30 dark:bg-slate-800/30"></div>
      </div>
      <div className="relative flex h-[25rem] w-[20rem] animate-pulse flex-col items-center justify-center rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10"></div>
    </div>
  );
}
