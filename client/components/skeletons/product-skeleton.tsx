import { Skeleton } from "@/components/ui/skeleton"
 
export function ProductSkeleton() {
    return (
        <>
        <Skeleton className="overflow-hidden m-auto h-[200px] md:h-[500px] xl:h-[350px] w-full xl:w-1/2 items-center justify-center flex" />
        <div className="xl:pl-10 w-full xl:w-1/2 xl:mt-8">
            <Skeleton className="w-1/4 m-auto h-10 my-2" />
            <div className="justify-between p-2 flex text-lg font-bold border-t-2 border-zinc-400 md:mt-4 md:pt-4">
                <Skeleton className="h-7 w-1/2" />
                <Skeleton className="h-7 w-10" />
            </div>
            <div className="h-[75px] p-2 overflow-clip text-justify">
                <Skeleton className="h-full w-full" />
                
            </div>
        </div>
        </>
    )
}