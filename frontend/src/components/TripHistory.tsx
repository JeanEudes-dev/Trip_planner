import { useEffect, useState } from "react";
import { usePlannerStore } from "../store/store";
import { tripService } from "../services";
import type { TripResult } from "../services";
import { TripHistorySkeleton } from "./TripHistorySkeleton";

export function TripHistory() {
  const { setTripResult } = usePlannerStore();
  const [history, setHistory] = useState<TripResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      setError("");
      try {
        const data = await tripService.getTrips();
        setHistory(data);
      } catch (error) {
        console.error("Error loading trips:", error);
        setError("Could not load history.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (loading) return <TripHistorySkeleton />;
  if (error) return <div className="text-rose-500">{error}</div>;
  if (!history.length)
    return <div className="text-gray-400 text-sm">No trips planned yet.</div>;

  return (
    <div className="w-full max-w-2xl rounded-xl bg-white/80 dark:bg-surface/80 border border-gray-200 dark:border-gray-700 shadow p-4 mt-4">
      <h4 className="font-bold text-primary mb-2 text-sm uppercase tracking-wide">
        Recent Trips
      </h4>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {history.slice(0, 6).map((trip) => (
          <li
            key={trip.id}
            className="py-2 px-1 hover:bg-primary/5 rounded transition flex items-center gap-4 cursor-pointer"
            onClick={() => setTripResult(trip)}
            tabIndex={0}
            role="button"
            aria-label={`Load trip from ${trip.pickup_location} to ${trip.dropoff_location}`}
          >
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                {trip.pickup_location} <span className="mx-1">→</span>{" "}
                {trip.dropoff_location}
              </div>
              <div className="text-xs text-gray-500">
                {trip.created_at?.slice(0, 10)} ·{" "}
                {trip.distance_miles?.toFixed(0) || "--"} mi
              </div>
            </div>
            <div className="text-xs text-gray-500 uppercase font-mono">
              {trip.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
