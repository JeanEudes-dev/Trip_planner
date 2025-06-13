import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface/70 text-primary hover:shadow-lg transition"
      aria-label="Toggle dark mode"
      onClick={() => setIsDark((d) => !d)}
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
      <span className="hidden sm:inline text-xs font-semibold">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
