export default function FormSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-[3.5rem] w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"></div>
      <div className="h-[3.5rem] w-full rounded-sm bg-neutral-300 px-4 dark:bg-neutral-700"></div>
      <div className="h-[3.5rem] w-[20vw] animate-pulse rounded-sm border border-neutral-600/10 bg-neutral-200/30 shadow-md dark:border-neutral-400/10 dark:bg-neutral-800/30 dark:shadow-neutral-500/10"></div>
    </div>
  );
}
