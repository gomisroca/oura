import { Skeleton } from "@/components/ui/skeleton"
 
export function AdSkeleton() {
    return (
        <div className='items-center justify-center flex'>
            <Skeleton className="w-[300px] h-[100px] sm:h-[400px]" />
        </div>
    )
}