import { motion } from "framer-motion";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  className = "",
  rounded = true,
}: SkeletonProps) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${
        rounded ? "rounded" : ""
      } ${className}`}
      style={{
        backgroundSize: "200% 100%",
        width,
        height,
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-label="Loading content"
    />
  );
}

// Specialized skeleton components
export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-surface/80 ${className}`}
    >
      <div className="space-y-3">
        <Skeleton height="1.5rem" width="60%" />
        <SkeletonText lines={2} />
        <div className="flex justify-between items-center pt-2">
          <Skeleton height="1rem" width="40%" />
          <Skeleton height="1rem" width="20%" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonButton({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      height="2.5rem"
      width="100%"
      className={`rounded-2xl ${className}`}
    />
  );
}
