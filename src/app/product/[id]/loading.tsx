export default function Loading() {
  return (
    <div className="relative flex h-[60vh] w-[75wv] animate-pulse flex-col items-center justify-center rounded-sm border border-neutral-600/10 bg-neutral-200/30 shadow-md md:h-[70vh] md:w-[60vw] dark:border-neutral-400/10 dark:bg-neutral-800/30 dark:shadow-neutral-500/10">
      <h1 className="text-center text-2xl font-bold">Loading...</h1>
    </div>
  );
}
