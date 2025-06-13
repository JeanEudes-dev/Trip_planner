import { motion } from "framer-motion";

export function LoadingSpinner({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    >
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle
          cx="18"
          cy="18"
          r="15"
          stroke="#2563eb"
          strokeWidth="4"
          opacity="0.2"
        />
        <path
          d="M33 18a15 15 0 1 1-30 0"
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
