import { Skeleton } from "@/components/ui/skeleton"
 
export function BannerSkeleton() {
    return (
        <div className='rounded-b-full overflow-hidden w-screen h-[6rem] md:h-[10rem] lg:h-[15rem] xl:h-[20rem] items-center justify-center flex'>
            <Skeleton className='h-screen w-screen' />
        </div>
    )
}