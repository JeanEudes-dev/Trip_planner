export function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 -z-1 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* CSS animations */}
      <style>{`
        @keyframes aurora-move-1 {
          0%,
          100% {
            transform: translate(-100px, -50px) scale(1);
          }
          50% {
            transform: translate(100px, 50px) scale(1.1);
          }
        }
        @keyframes aurora-move-2 {
          0%,
          100% {
            transform: translate(50px, -100px) scale(0.9);
          }
          50% {
            transform: translate(-50px, 100px) scale(1.2);
          }
        }
        @keyframes aurora-move-3 {
          0%,
          100% {
            transform: translate(-50px, 100px) scale(1);
          }
          50% {
            transform: translate(80px, -80px) scale(0.8);
          }
        }
        .aurora-1 {
          animation: aurora-move-1 20s ease-in-out infinite;
        }
        .aurora-2 {
          animation: aurora-move-2 25s ease-in-out infinite;
        }
        .aurora-3 {
          animation: aurora-move-3 30s ease-in-out infinite;
        }
      `}</style>

      {/* SVG for both light and dark aurora */}
      <svg
        className="absolute w-full h-full"
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "blur(90px)",
          opacity: 0.3,
          transition: "opacity 0.5s",
        }}
      >
        {/* Light mode aurora */}
        <g className="block dark:hidden">
          <ellipse
            className="aurora-1"
            cx="1400"
            cy="400"
            rx="700"
            ry="220"
            fill="url(#lightaurora1)"
            opacity="0.6"
          />
          <ellipse
            className="aurora-2"
            cx="700"
            cy="700"
            rx="700"
            ry="220"
            fill="url(#lightaurora2)"
            opacity="0.5"
          />
        </g>
        {/* Dark mode aurora */}
        <g className="hidden dark:block">
          <ellipse
            className="aurora-1"
            cx="1500"
            cy="360"
            rx="720"
            ry="240"
            fill="url(#darkaurora1)"
            opacity="0.7"
          />
          <ellipse
            className="aurora-2"
            cx="600"
            cy="780"
            rx="780"
            ry="220"
            fill="url(#darkaurora2)"
            opacity="0.6"
          />
          <ellipse
            className="aurora-3"
            cx="960"
            cy="540"
            rx="1200"
            ry="500"
            fill="url(#darkaurora3)"
            opacity="0.3"
          />
        </g>
        {/* Gradient definitions */}
        <defs>
          {/* Light mode gradients */}
          <linearGradient
            id="lightaurora1"
            x1="900"
            y1="100"
            x2="1800"
            y2="700"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a7f3d0" stopOpacity="0.3" />
            <stop offset="0.2" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="0.6" stopColor="#c4b5fd" stopOpacity="0.4" />
            <stop offset="1" stopColor="#a7f3d0" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="lightaurora2"
            x1="0"
            y1="700"
            x2="1400"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f0abfc" stopOpacity="0.4" />
            <stop offset="0.5" stopColor="#bae6fd" stopOpacity="0.6" />
            <stop offset="1" stopColor="#f0abfc" stopOpacity="0.3" />
          </linearGradient>
          {/* Dark mode gradients */}
          <linearGradient
            id="darkaurora1"
            x1="1100"
            y1="0"
            x2="1920"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2563eb" stopOpacity="0.4" />
            <stop offset="0.3" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="0.7" stopColor="#a21caf" stopOpacity="0.5" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient
            id="darkaurora2"
            x1="0"
            y1="900"
            x2="1920"
            y2="1080"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#9333ea" stopOpacity="0.7" />
            <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="darkaurora3"
            x1="0"
            y1="0"
            x2="1920"
            y2="1080"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="0.4" stopColor="#f472b6" stopOpacity="0.5" />
            <stop offset="0.8" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="1" stopColor="#f472b6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
