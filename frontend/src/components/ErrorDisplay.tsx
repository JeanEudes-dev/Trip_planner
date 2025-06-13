import { AlertTriangle, RefreshCw, X } from "lucide-react";

interface ErrorDisplayProps {
  error: {
    type?: string;
    message: string;
    user_friendly?: boolean;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className = "",
}: ErrorDisplayProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case "DistanceLimitExceededError":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "GeocodingError":
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case "RouteCalculationError":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case "DistanceLimitExceededError":
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20";
      case "GeocodingError":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20";
      case "RouteCalculationError":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
      default:
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case "DistanceLimitExceededError":
        return "Route Too Long";
      case "GeocodingError":
        return "Location Not Found";
      case "RouteCalculationError":
        return "Route Calculation Failed";
      default:
        return "Planning Error";
    }
  };

  const getSuggestions = () => {
    switch (error.type) {
      case "DistanceLimitExceededError":
        return [
          "Try planning shorter routes (under 3,500 miles)",
          "Break your trip into multiple segments",
          "Consider intermediate stops to split the journey",
        ];
      case "GeocodingError":
        return [
          "Check spelling of addresses",
          "Try using more specific addresses (include city and state)",
          "Use well-known landmarks or complete street addresses",
        ];
      case "RouteCalculationError":
        return [
          "Verify that all locations are accessible by road",
          "Try using different nearby addresses",
          "Check if locations are in supported regions",
        ];
      default:
        return [
          "Please try again in a few moments",
          "Check your internet connection",
          "Contact support if the problem persists",
        ];
    }
  };

  return (
    <div className={`rounded-xl border p-6 ${getErrorColor()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getErrorIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getErrorTitle()}
            </h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {error.message}
            </p>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Suggestions:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {getSuggestions().map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1 w-1 bg-current rounded-full flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {(onRetry || onDismiss) && (
              <div className="mt-4 flex space-x-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
