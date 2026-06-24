import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden border-white/10 bg-white/[0.04] p-5">
          <Skeleton className="h-1 w-full rounded-full bg-gradient-to-r from-cyan-300/40 to-emerald-300/40" />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-end justify-between gap-4">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ProductTableSkeleton() {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.04]">
      <div className="space-y-4 p-5">
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-2xl" />
        ))}
      </div>
    </Card>
  );
}