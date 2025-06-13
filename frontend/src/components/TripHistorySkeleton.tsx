import { Skeleton } from "./Skeleton";

export function TripHistorySkeleton() {
  return (
    <div className="w-full max-w-2xl rounded-xl bg-white/80 dark:bg-surface/80 border border-gray-200 dark:border-gray-700 shadow p-4 mt-4">
      <Skeleton height="1rem" width="30%" className="mb-3 font-bold" />

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="py-3 px-1 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton height="1rem" width="45%" />
                <Skeleton height="0.75rem" width="20px" />
                <Skeleton height="1rem" width="45%" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton height="0.75rem" width="25%" />
                <span className="text-gray-300">•</span>
                <Skeleton height="0.75rem" width="20%" />
              </div>
            </div>
            <Skeleton height="0.75rem" width="60px" />
          </div>
        ))}
      </div>
    </div>
  );
}
