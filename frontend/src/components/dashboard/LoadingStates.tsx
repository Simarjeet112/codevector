import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingHeroSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
      <div className="space-y-6">
        <Skeleton className="h-10 w-72 rounded-full" />
        <Skeleton className="h-24 w-full max-w-4xl rounded-[2rem]" />
        <Skeleton className="h-16 w-full max-w-2xl rounded-[1.5rem]" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-36 rounded-full" />
          <Skeleton className="h-11 w-40 rounded-full" />
          <Skeleton className="h-11 w-28 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-[360px] rounded-[2rem] lg:h-[460px]" />
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-4 w-24 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-4 w-40 rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-4 w-72 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 rounded-[1.75rem]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-4 w-72 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 rounded-[1.75rem]" />
        </CardContent>
      </Card>
    </div>
  );
}

export function ProductListSkeleton({ viewMode }: { viewMode: 'grid' | 'table' }) {
  if (viewMode === 'table') {
    return (
      <Card>
        <CardContent className="space-y-3 overflow-hidden p-0">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[0.8fr_2fr_1fr_1fr_1fr] gap-4 border-b border-white/6 px-6 py-4 last:border-b-0">
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-4 w-52 rounded-full" />
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-6 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-20 rounded-[1.25rem]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
