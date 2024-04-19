import { Skeleton } from "@/components/ui/skeleton"
 
export function CatalogSkeleton() {
    const n = 6;
    return (
        <div className="m-auto p-3 sm:p-6 lg:p-12 xl:p-16 w-screen grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1 sm:gap-2">
            {[...Array(n)].map((e, i) => 
                <Skeleton key={i} className="h-[275px] md:h-[350px] w-[175px] md:w-[225px]" />
            )}
        </div>
    )
}