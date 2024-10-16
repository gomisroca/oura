export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl uppercase">Products</h1>
        <div className="flex flex-row gap-2">
          <div className="flex animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 px-6 py-4 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10">
            Create Product
          </div>
          <div className="flex animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 px-6 py-4 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10">
            Update Product
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl uppercase">Categories</h1>
        <div className="flex flex-row gap-2">
          <div className="flex animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 px-6 py-4 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10">
            Create Category
          </div>
          <div className="flex animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 px-6 py-4 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10">
            Update Category
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl uppercase">Sales</h1>
        <div className="flex flex-row gap-2">
          <div className="flex animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 px-6 py-4 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10">
            Create Sale
          </div>
          <div className="flex animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 px-6 py-4 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10">
            Update Sale
          </div>
        </div>
      </div>
    </div>
  );
}
