import { Skeleton } from "@/components/ui/skeleton"
 
export function ProductSkeleton() {
    return (
        <>
        <Skeleton className="overflow-hidden m-auto h-[500px] w-1/2 items-center justify-center flex" />
        <div className="md:pl-10 md:w-1/2 mt-2 md:mt-0">
            <Skeleton className="w-1/4 m-auto h-10" />
            <div className="justify-between p-2 flex text-lg font-bold border-t-2 border-zinc-400 md:mt-4 md:pt-4">
                <Skeleton className="h-7 w-1/2" />
                <Skeleton className="h-7 w-10" />
            </div>
            <div className="h-full p-2 overflow-clip text-justify">
                <Skeleton className="h-1/2 w-2/3" />
            </div>
        </div>
        </>
    )
}