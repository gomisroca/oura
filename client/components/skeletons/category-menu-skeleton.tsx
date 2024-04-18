import { Skeleton } from "@/components/ui/skeleton"
 
export function CategoryMenuSkeleton() {
    return (
        <div className="flex gap-1">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-20 h-5" />
        </div>
    )
}