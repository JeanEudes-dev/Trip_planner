import { motion } from "framer-motion";
import { Skeleton } from "./Skeleton";

export function ContentLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Route section skeleton */}
      <div className="bg-white/80 dark:bg-surface/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <Skeleton height="1.25rem" width="40%" className="mb-3" />
        <Skeleton height="200px" width="100%" className="mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton height="0.875rem" width="30%" />
          <Skeleton height="0.875rem" width="25%" />
        </div>
      </div>

      {/* ELD Log section skeleton */}
      <div className="bg-white/80 dark:bg-surface/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <Skeleton height="1.25rem" width="35%" className="mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <Skeleton height="1rem" width="25%" className="mb-2" />
              <Skeleton height="80px" width="100%" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
