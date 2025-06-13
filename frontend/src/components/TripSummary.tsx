import { usePlannerStore } from "../store/store";
import { LoadingSpinner } from "./LoadingSpinner";

export function TripSummary() {
  const { tripResult, loading } = usePlannerStore();

  if (loading) {
    return (
      <div className="w-full max-w-2xl rounded-xl bg-white/80 dark:bg-surface/80 border border-gray-200 dark:border-gray-700 shadow p-4">
        <div className="flex items-center justify-center h-24">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!tripResult) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "failed":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const formatDistance = (distance: number) => {
    return distance.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  };

  return (
    <div className="w-full  rounded-xl bg-white/80 dark:bg-surface/80 border border-gray-200 dark:border-gray-700 shadow p-4">
      <h4 className="font-bold text-primary mb-3 text-sm uppercase tracking-wide">
        Trip Summary
      </h4>

      {/* Route */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Route
        </div>
        <div className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="truncate">{tripResult.pickup_location}</span>
          <span className="text-primary">→</span>
          <span className="truncate">{tripResult.dropoff_location}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {formatDistance(tripResult.distance_miles)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Miles
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {tripResult.estimated_days}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {tripResult.estimated_days === 1 ? "Day" : "Days"}
          </div>
        </div>

        <div className="text-center">
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
              tripResult.status
            )}`}
          >
            {tripResult.status}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">
            Status
          </div>
        </div>
      </div>

      {/* Current Cycle Hours */}
      {tripResult.current_cycle_hours > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Starting Cycle Hours
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tripResult.current_cycle_hours} / 70 hours
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(tripResult.current_cycle_hours / 70) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
