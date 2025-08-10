export default function Loading() {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0" aria-busy="true" aria-label="Loading content">
      <div className="absolute top-0 right-0 left-0 flex min-h-screen flex-col items-center justify-evenly overflow-hidden">
        {/* Sale Title */}
        <div className="mx-4 mt-6 flex w-[30rem] flex-col items-center border-4 border-neutral-200 bg-neutral-950/20 p-4 md:mx-0 md:mt-0">
          <h1 className="text-center text-5xl font-bold text-neutral-200 drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] md:text-7xl">
            OURA
          </h1>
          <p className="text-center font-bold text-neutral-200 uppercase drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
            Sports with a purpose
          </p>
        </div>

        {/* Product Card Placeholder */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-[3.5rem] w-[80vw] animate-pulse rounded-sm border border-neutral-600/10 bg-neutral-200/30 shadow-md md:w-[25vw] 2xl:w-[10vw] dark:border-neutral-400/10 dark:bg-neutral-800/30 dark:shadow-neutral-500/10"></div>
          <div className="h-[25rem] w-[20rem] animate-pulse rounded-sm border border-neutral-600/10 bg-neutral-200/30 shadow-md dark:border-neutral-400/10 dark:bg-neutral-800/30 dark:shadow-neutral-500/10"></div>
        </div>
      </div>
    </div>
  );
}
