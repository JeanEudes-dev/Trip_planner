import { create } from "zustand";
import type { TripInput, TripResult } from "../services";

interface PlannerState {
  tripInput: TripInput;
  tripResult: TripResult | null;
  loading: boolean;
  initialLoading: boolean;
  layoutMode: "planning" | "result";
  setTripInput: (input: Partial<TripInput>) => void;
  setTripResult: (result: TripResult | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialLoading: (loading: boolean) => void;
  setLayoutMode: (mode: "planning" | "result") => void;
}

const defaultInput: TripInput = {
  current_location: "",
  pickup_location: "",
  dropoff_location: "",
  current_cycle_hours: 0,
};

export const usePlannerStore = create<PlannerState>((set) => ({
  tripInput: defaultInput,
  tripResult: null,
  loading: false,
  initialLoading: true,
  layoutMode: "planning",
  setTripInput: (input) =>
    set((state) => ({ tripInput: { ...state.tripInput, ...input } })),
  setTripResult: (result) => set(() => ({ tripResult: result })),
  setLoading: (loading) => set(() => ({ loading })),
  setInitialLoading: (loading) => set(() => ({ initialLoading: loading })),
  setLayoutMode: (mode) => set(() => ({ layoutMode: mode })),
}));
