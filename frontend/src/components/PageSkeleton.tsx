import { TripPlannerFormSkeleton } from "./TripPlannerFormSkeleton";
import { RouteMapSkeleton } from "./RouteMapSkeleton";
import { ELDLogSheetSkeleton } from "./ELDLogSheetSkeleton";
import { TripHistorySkeleton } from "./TripHistorySkeleton";
import { Skeleton } from "./Skeleton";
import { motion } from "framer-motion";

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-surface transition-colors duration-300"
    >
      {/* Header Skeleton */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface/90 shadow backdrop-blur flex items-center px-6 h-16">
        <Skeleton height="1.5rem" width="200px" className="mr-4" />
        <nav className="ml-auto flex items-center space-x-2">
          <Skeleton height="2rem" width="2rem" className="rounded-lg" />
          <Skeleton height="2rem" width="2rem" className="rounded-lg" />
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 flex flex-col py-8 gap-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Planner form skeleton */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            <TripPlannerFormSkeleton />
          </div>

          {/* Right: Route, Log, History skeletons */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            <RouteMapSkeleton />
            <ELDLogSheetSkeleton />
            <TripHistorySkeleton />
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="w-full py-4 mt-8 text-center">
        <Skeleton height="0.75rem" width="300px" className="mx-auto" />
      </footer>
    </motion.div>
  );
}
