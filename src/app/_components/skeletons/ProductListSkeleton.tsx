export default function ProductListSkeleton() {
  return (
    <div
      className="relative mx-auto flex w-full flex-wrap items-center justify-center gap-2"
      role="status"
      aria-live="polite">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative flex h-[25rem] w-[20rem] animate-pulse flex-col items-center justify-center rounded-sm border border-neutral-600/10 bg-neutral-200/30 shadow-md dark:border-neutral-400/10 dark:bg-neutral-800/30 dark:shadow-neutral-500/10"></div>
      ))}

      <h1 className="absolute text-center text-2xl font-bold">Loading...</h1>
    </div>
  );
}
