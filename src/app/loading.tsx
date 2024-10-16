export default function Loading() {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0" aria-busy="true" aria-label="Loading content">
      <div className="absolute left-0 right-0 top-0 flex min-h-screen flex-col items-center justify-evenly overflow-hidden">
        {/* Sale Title */}
        <div className="mx-4 mt-6 flex w-[30rem] flex-col items-center border-4 border-slate-200 bg-slate-950/20 p-4 md:mx-0 md:mt-0">
          <h1 className="text-center text-5xl font-bold text-slate-200 drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] md:text-7xl">
            OURA
          </h1>
          <p className="text-center font-bold uppercase text-slate-200 drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
            Sports with a purpose
          </p>
        </div>

        {/* Product Card Placeholder */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-[3.5rem] w-[80vw] animate-pulse rounded-full border border-slate-600/10 bg-slate-200/30 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10 md:w-[25vw] 2xl:w-[10vw]"></div>
          <div className="h-[25rem] w-[20rem] animate-pulse rounded-xl border border-slate-600/10 bg-slate-200/30 shadow-md dark:border-slate-400/10 dark:bg-slate-800/30 dark:shadow-slate-500/10"></div>
        </div>
      </div>
    </div>
  );
}
