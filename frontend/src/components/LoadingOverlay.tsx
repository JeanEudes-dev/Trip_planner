import { motion } from "framer-motion";
import { Skeleton } from "./Skeleton";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({
  message = "Processing...",
}: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/80 dark:bg-surface/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {message}
        </p>
        <div className="w-full max-w-xs space-y-2">
          <Skeleton height="0.5rem" width="100%" />
          <Skeleton height="0.5rem" width="75%" />
          <Skeleton height="0.5rem" width="90%" />
        </div>
      </div>
    </motion.div>
  );
}
