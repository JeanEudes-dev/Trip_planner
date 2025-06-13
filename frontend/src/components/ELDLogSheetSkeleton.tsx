import { Skeleton } from "./Skeleton";

export function ELDLogSheetSkeleton() {
  return (
    <div className="w-full bg-white/80 dark:bg-surface/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4">
      <Skeleton height="1.5rem" width="40%" className="mb-4" />

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, dayIndex) => (
          <div
            key={dayIndex}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
          >
            {/* Day header */}
            <div className="flex justify-between items-center mb-3">
              <Skeleton height="1.25rem" width="25%" />
              <Skeleton height="1rem" width="20%" />
            </div>

            {/* Timeline grid skeleton */}
            <div className="space-y-2">
              {/* Hours header */}
              <div className="grid grid-cols-12 gap-1 text-xs">
                {Array.from({ length: 12 }).map((_, hourIndex) => (
                  <Skeleton key={hourIndex} height="1rem" width="100%" />
                ))}
              </div>

              {/* Activity bars */}
              <div className="grid grid-cols-12 gap-1 h-8">
                {Array.from({ length: 12 }).map((_, barIndex) => (
                  <Skeleton
                    key={barIndex}
                    height="2rem"
                    width="100%"
                    className="rounded-sm"
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
              {Array.from({ length: 4 }).map((_, legendIndex) => (
                <div key={legendIndex} className="flex items-center gap-1">
                  <Skeleton height="0.75rem" width="0.75rem" />
                  <Skeleton height="0.75rem" width="60%" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
