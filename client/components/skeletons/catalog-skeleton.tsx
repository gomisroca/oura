import { Skeleton } from "@/components/ui/skeleton"
 
export function CatalogSkeleton() {
    const n = 5;
    return (
        <div className='mx-auto p-1 sm:p-5 mb-5'>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                {[...Array(n)].map((e, i) => 
                    <Skeleton key={i} className="h-[275px] md:h-[350px] w-[175px] md:w-[225px]" />
                )}
            </div>
        </div>
    )
}