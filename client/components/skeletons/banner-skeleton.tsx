import { Skeleton } from "@/components/ui/skeleton"
 
export function BannerSkeleton() {
    return (
        <div className='rounded-b-full overflow-hidden w-screen h-[150px] sm:h-[400px] items-center justify-center flex'>
            <Skeleton className='h-screen w-screen' />
        </div>
    )
}