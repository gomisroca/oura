export default function Loading() {
  return (
    <div className="relative flex h-[60vh] w-[75wv] animate-pulse flex-col items-center justify-center rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10 md:h-[70vh] md:w-[60vw]">
      <h1 className="text-center text-2xl font-bold">Loading...</h1>
    </div>
  );
}
