import { Skeleton } from '@/components/primitives/skeleton';

export function AlbumDetailSkeleton() {
  return (
    <div className="flex-1">
      <div className="relative">
        <div className="bg-gradient-to-b from-primary/20 to-background p-6">
          <Skeleton className="h-8 w-32 mb-4" />

          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <Skeleton className="w-48 h-48 rounded-lg" />

            <div className="flex-1 min-w-0">
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="px-6 py-4">
        <Skeleton className="h-10 w-full max-w-md mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2">
              <Skeleton className="h-6 w-6" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 