import apiClient from "./api";

// Types for the API
export interface TripInput {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_hours: number;
}

export interface LogSegment {
  start: string;
  end: string;
  status: string;
  note?: string;
}

export interface TripLog {
  id: number;
  date: string;
  log_data: LogSegment[];
}

export interface RouteStop {
  id: number;
  stop_type: string;
  order: number;
  lat: number;
  lng: number;
  description: string;
}

export interface TripResult {
  id: number;
  created_at: string;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_hours: number;
  distance_miles: number;
  estimated_days: number;
  status: string;
  error_message?: string;
  logs: TripLog[];
  stops: RouteStop[];
  error?: {
    type: string;
    message: string;
    user_friendly: boolean;
  };
  geometry?: [number, number][];
}

// Trip API service functions
export const tripService = {
  // Create a new trip
  createTrip: async (tripData: TripInput): Promise<TripResult> => {
    const response = await apiClient.post<TripResult>(
      "/trips/create/",
      tripData
    );
    return response.data;
  },

  // Get all trips
  getTrips: async (): Promise<TripResult[]> => {
    const response = await apiClient.get<TripResult[]>("/trips/");
    return response.data;
  },

  // Get a specific trip by ID
  getTripById: async (id: number): Promise<TripResult> => {
    const response = await apiClient.get<TripResult>(`/trips/${id}/`);
    return response.data;
  },
};
