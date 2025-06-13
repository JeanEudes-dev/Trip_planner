import { useState } from "react";
import toast from "react-hot-toast";
import { usePlannerStore } from "../store/store";
import { tripService } from "../services";
import { LoadingOverlay } from "./LoadingOverlay";
import { ErrorDisplay } from "./ErrorDisplay";
import { motion } from "framer-motion";

interface ApiError {
  type?: string;
  message: string;
  user_friendly?: boolean;
}

export function TripPlannerForm() {
  const {
    tripInput,
    setTripInput,
    setTripResult,
    setLoading,
    loading,
    layoutMode,
    setLayoutMode,
    tripResult,
  } = usePlannerStore();
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!tripInput.current_location)
      errs.current_location = "Enter your current location.";
    if (!tripInput.pickup_location)
      errs.pickup_location = "Enter pickup location.";
    if (!tripInput.dropoff_location)
      errs.dropoff_location = "Enter dropoff location.";
    if (
      tripInput.current_cycle_hours < 0 ||
      tripInput.current_cycle_hours > 70
    ) {
      errs.current_cycle_hours = "Cycle hours must be between 0 and 70.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripInput({ [e.target.name]: e.target.value });
    setErrors((errs) => ({ ...errs, [e.target.name]: "" }));
  };

  const handleCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripInput({ current_cycle_hours: Number(e.target.value) });
    setErrors((errs) => ({ ...errs, current_cycle_hours: "" }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTripResult(null);
    setApiError(null);

    try {
      const data = await tripService.createTrip({
        ...tripInput,
        current_cycle_hours: Number(tripInput.current_cycle_hours),
      });
      setTripResult(data);
      setLayoutMode("result");
      toast.success("Trip planned!");
    } catch (error: unknown) {
      console.error("Error planning trip:", error);

      // Handle API errors with proper error information
      if (error && typeof error === "object" && "response" in error) {
        const apiResponse = error as {
          response?: { data?: { error?: ApiError } };
        };
        if (apiResponse.response?.data?.error) {
          const apiErrorData = apiResponse.response.data.error;
          setApiError(apiErrorData);

          // Show specific toast message based on error type
          if (apiErrorData.type === "DistanceLimitExceededError") {
            toast.error("Route too long - please plan shorter segments");
          } else if (apiErrorData.type === "GeocodingError") {
            toast.error("Unable to find one or more locations");
          } else if (apiErrorData.type === "RouteCalculationError") {
            toast.error("Unable to calculate route");
          } else {
            toast.error("Error planning trip - please try again");
          }
        } else {
          // Handle generic errors
          setApiError({
            type: "NetworkError",
            message:
              "Unable to connect to the trip planning service. Please check your internet connection and try again.",
            user_friendly: true,
          });
          toast.error("Connection error - please try again");
        }
      } else {
        // Handle generic errors
        setApiError({
          type: "NetworkError",
          message:
            "Unable to connect to the trip planning service. Please check your internet connection and try again.",
          user_friendly: true,
        });
        toast.error("Connection error - please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleRetry = () => {
    setApiError(null);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent);
  };

  const handleDismissError = () => {
    setApiError(null);
  };

  const handlePlanAnotherTrip = () => {
    setLayoutMode("planning");
    setTripResult(null);
    setApiError(null);
    // Reset form to default values
    setTripInput({
      current_location: "",
      pickup_location: "",
      dropoff_location: "",
      current_cycle_hours: 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
    >
      <div className="w-full max-w-xl space-y-4">
        {/* Error Display */}
        {apiError && (
          <ErrorDisplay
            error={apiError}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />
        )}

        {/* Plan Another Trip Button - shown in result mode */}
        {layoutMode === "result" && tripResult && (
          <div className="w-full bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Trip Planned Successfully!
                </h3>
                <p className="text-white/90 text-sm">
                  Ready to plan another trip?
                </p>
              </div>
              <button
                onClick={handlePlanAnotherTrip}
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                Plan Another Trip
              </button>
            </div>
          </div>
        )}

        {/* Trip Planning Form */}
        <form
          className={`w-full bg-white/95 dark:bg-surface/95 rounded-2xl shadow-xl px-6 py-8 grid gap-6 border border-gray-200/50 dark:border-gray-700/50 relative backdrop-blur-sm ${
            layoutMode === "result" ? "transform scale-95" : ""
          } transition-all duration-300`}
          onSubmit={handleSubmit}
        >
          {loading && <LoadingOverlay message="Planning your route..." />}

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v15l-6 3-6-3z"
                />
              </svg>
              {layoutMode === "result" ? "Modify Trip" : "Plan Your Trip"}
            </h2>
            {layoutMode === "result" && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                ✓ Active Route
              </span>
            )}
          </div>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Current Location
              </label>
              <input
                type="text"
                name="current_location"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400"
                value={tripInput.current_location}
                onChange={handleChange}
                placeholder="e.g., Dallas, TX"
                autoFocus
              />
              {errors.current_location && (
                <span className="text-sm text-rose-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.current_location}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Pickup Location
              </label>
              <input
                type="text"
                name="pickup_location"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400"
                value={tripInput.pickup_location}
                onChange={handleChange}
                placeholder="e.g., Houston, TX"
              />
              {errors.pickup_location && (
                <span className="text-sm text-rose-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.pickup_location}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Dropoff Location
              </label>
              <input
                type="text"
                name="dropoff_location"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400"
                value={tripInput.dropoff_location}
                onChange={handleChange}
                placeholder="e.g., Chicago, IL"
              />
              {errors.dropoff_location && (
                <span className="text-sm text-rose-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.dropoff_location}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Current Cycle Used (hours)
              </label>
              <input
                type="number"
                name="current_cycle_hours"
                min={0}
                max={70}
                step={1}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400"
                value={tripInput.current_cycle_hours}
                onChange={handleCycleChange}
                placeholder="0"
              />
              {errors.current_cycle_hours && (
                <span className="text-sm text-rose-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.current_cycle_hours}
                </span>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            disabled={loading}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 36px 2px #60a5fa30" }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Planning Your Route...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v15l-6 3-6-3z"
                  />
                </svg>
                {layoutMode === "result" ? "Update Trip Plan" : "Plan Trip"}
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
