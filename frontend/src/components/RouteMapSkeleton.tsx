import { Skeleton } from "./Skeleton";

export function RouteMapSkeleton() {
  return (
    <div className="w-full bg-white/80 dark:bg-surface/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton height="1.5rem" width="30%" />
      </div>

      {/* Map area */}
      <div className="relative">
        <Skeleton
          height="400px"
          width="100%"
          rounded={false}
          className="animate-pulse"
        />

        {/* Map controls skeleton */}
        <div className="absolute top-4 right-4 space-y-2">
          <Skeleton height="2rem" width="2rem" className="rounded-md" />
          <Skeleton height="2rem" width="2rem" className="rounded-md" />
        </div>

        {/* Route info overlay with enhanced animation */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 dark:bg-surface/90 rounded-lg p-3 space-y-2">
            <Skeleton height="1rem" width="60%" />
            <div className="flex justify-between">
              <Skeleton height="0.875rem" width="40%" />
              <Skeleton height="0.875rem" width="30%" />
            </div>
            <div className="flex justify-between items-center pt-1">
              <Skeleton height="0.75rem" width="25%" />
              <Skeleton height="0.75rem" width="35%" />
            </div>
          </div>
        </div>

        {/* Floating route markers simulation */}
        <div className="absolute top-8 left-8">
          <Skeleton height="1.5rem" width="1.5rem" className="rounded-full" />
        </div>
        <div className="absolute top-20 right-16">
          <Skeleton height="1.5rem" width="1.5rem" className="rounded-full" />
        </div>
        <div className="absolute bottom-20 left-12">
          <Skeleton height="1.5rem" width="1.5rem" className="rounded-full" />
        </div>
      </div>
    </div>
  );
}
