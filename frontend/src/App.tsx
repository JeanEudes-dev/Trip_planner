import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeToggle } from "./components/ThemeToggle";
import { AboutDrawer } from "./components/AboutDrawer";
import { TripPlannerForm } from "./components/TripPlannerForm";
import { RouteMap } from "./components/RouteMap";
import { TripSummary } from "./components/TripSummary";
import { ELDLogSheet } from "./components/ELDLogSheet";
import { TripHistory } from "./components/TripHistory";
import { PageSkeleton } from "./components/PageSkeleton";
import { usePlannerStore } from "./store/store";
import { AuroraBackground } from "./components/AuroraBackground";

export default function App() {
  const { initialLoading, setInitialLoading, layoutMode } = usePlannerStore();

  useEffect(() => {
    document.body.classList.add(
      "bg-gray-50",
      "dark:bg-surface",
      "text-gray-900",
      "dark:text-gray-100"
    );

    // Simulate initial app loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setInitialLoading]);

  if (initialLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-surface transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface/90 shadow backdrop-blur flex items-center px-6 h-16">
        <span className="font-extrabold text-lg tracking-tight text-primary mr-4">
          SpotterAI Trip Planner
        </span>
        <nav className="ml-auto flex items-center space-x-2">
          <AboutDrawer />
          <ThemeToggle />
        </nav>
      </header>

      <AuroraBackground />
      {layoutMode === "planning" ? (
        <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 flex flex-col py-8 gap-8">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Left: Planner form */}
            <div className="md:w-1/2 w-full flex flex-col gap-4">
              <TripPlannerForm />
            </div>
            {/* Right: Route, Log, History */}
            <div className="md:w-1/2 w-full flex flex-col gap-4">
              <RouteMap />
              <TripSummary />
              <ELDLogSheet />
              <TripHistory />
            </div>
          </div>
        </main>
      ) : (
        /* Result Mode Layout - 70% Map, 30% Sidebar */
        <main className="flex-1 flex h-[calc(100vh-4rem)]">
          {/* Map Section - 70% */}
          <div className="w-[70%] relative">
            <RouteMap />
            <TripSummary />
            <ELDLogSheet />
          </div>

          {/* Sidebar - 30% */}
          <div className="w-[30%] bg-white dark:bg-surface border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6 space-y-6">
              <TripPlannerForm />
              <TripHistory />
            </div>
          </div>
        </main>
      )}

      {/* Footer - only show in planning mode */}
      {layoutMode === "planning" && (
        <footer className="w-full py-4 mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Jean-Eudes Assogba.
        </footer>
      )}

      <Toaster position="top-center" />
    </div>
  );
}
