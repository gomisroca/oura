import { Skeleton } from "@/components/ui/skeleton"
 
export function AdSkeleton() {
    return (
        <div className='items-center justify-center flex'>
            <Skeleton className="w-[250px] h-[300px] md:w-[300px] md:h-[400px]" />
        </div>
    )
}