// Main API client
export { default as apiClient } from "./api";

// Trip service and types
export { tripService } from "./tripService";
export type {
  TripInput,
  TripResult,
  TripLog,
  LogSegment,
  RouteStop,
} from "./tripService";
