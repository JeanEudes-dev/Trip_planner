import { TripPlannerForm } from "./components/TripPlannerForm";
import { RouteMap } from "./components/RouteMap";
import { ELDLogSheet } from "./components/ELDLogSheet";
import { TripHistory } from "./components/TripHistory";
import { ThemeToggle } from "./components/ThemeToggle";
import { AboutDrawer } from "./components/AboutDrawer";
import { Toaster } from "react-hot-toast";

export default function Home() {
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

      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 flex flex-col py-8 gap-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Planner form */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            <TripPlannerForm />
            {/* Add more future controls if needed */}
          </div>
          {/* Right: Route, Log, History */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            <RouteMap />
            <ELDLogSheet />
            <TripHistory />
          </div>
        </div>
      </main>

      <footer className="w-full py-4 mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} Jean-Eudes Assogba. Powered by React +
        Tailwind.
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}
