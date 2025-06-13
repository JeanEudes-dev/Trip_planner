import { Skeleton, SkeletonButton } from "./Skeleton";

export function TripPlannerFormSkeleton() {
  return (
    <div className="w-full max-w-xl bg-white/90 dark:bg-surface/90 rounded-2xl shadow-lg px-6 py-8 grid gap-6 border border-gray-200 dark:border-gray-700">
      <Skeleton height="2rem" width="60%" className="mb-2" />

      <div className="grid gap-4">
        {/* Current Location Field */}
        <div>
          <Skeleton height="1rem" width="40%" className="mb-1" />
          <Skeleton height="2.5rem" width="100%" className="rounded-xl" />
        </div>

        {/* Pickup Location Field */}
        <div>
          <Skeleton height="1rem" width="35%" className="mb-1" />
          <Skeleton height="2.5rem" width="100%" className="rounded-xl" />
        </div>

        {/* Dropoff Location Field */}
        <div>
          <Skeleton height="1rem" width="40%" className="mb-1" />
          <Skeleton height="2.5rem" width="100%" className="rounded-xl" />
        </div>

        {/* Cycle Hours Field */}
        <div>
          <Skeleton height="1rem" width="50%" className="mb-1" />
          <Skeleton height="2.5rem" width="100%" className="rounded-xl" />
        </div>
      </div>

      <SkeletonButton className="mt-2" />
    </div>
  );
}
