/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import * as L from "leaflet";
import { usePlannerStore } from "../store/store";
import { RouteMapSkeleton } from "./RouteMapSkeleton";
import { motion } from "framer-motion";

// Custom icons for stops
const icons: Record<string, L.Icon> = {
  pickup: new L.Icon({ iconUrl: "/marker-green.jpg", iconSize: [28, 38] }),
  dropoff: new L.Icon({ iconUrl: "/marker-red.png", iconSize: [28, 38] }),
  rest_break: new L.Icon({ iconUrl: "/marker-purple.png", iconSize: [28, 38] }),
  fuel_stop: new L.Icon({ iconUrl: "/marker-yellow.jpeg", iconSize: [28, 38] }),
  start: new L.Icon({ iconUrl: "/marker-blue.png", iconSize: [28, 38] }),
  end: new L.Icon({ iconUrl: "/marker-gray.png", iconSize: [28, 38] }),
  other: new L.Icon({ iconUrl: "/marker-black.png", iconSize: [28, 38] }),
};

function FitMapToStops({ stops }: { stops: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [stops, map]);
  return null;
}

export function RouteMap() {
  const { tripResult, loading, layoutMode } = usePlannerStore();

  if (loading) {
    return <RouteMapSkeleton />;
  }

  if (!tripResult?.stops?.length) {
    return (
      <div
        className={`w-full ${
          layoutMode === "result" ? "h-screen" : "h-10"
        } rounded-2xl bg-gradient-to-br from-primary/10 to-surface/30 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm`}
      >
        Plan a trip to see your route!
      </div>
    );
  }

  const stops = tripResult.stops;
  const routePoints: [number, number][] = tripResult.geometry || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
    >
      <div
        className={`w-full ${layoutMode === "result" ? "h-screen" : "h-96"} ${
          layoutMode === "planning" ? "max-w-2xl mx-auto" : ""
        } rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700`}
      >
        <MapContainer
          className="w-full h-full"
          center={routePoints[0]}
          zoom={6}
          scrollWheelZoom={true}
          style={{
            minHeight: layoutMode === "result" ? "100vh" : 380,
            minWidth: "100%",
          }}
          preferCanvas={true}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline
            positions={routePoints}
            pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.9 }}
          />
          {stops.map((stop: any, i: number) => (
            <Marker
              key={i}
              position={[stop.lat, stop.lng]}
              icon={icons[stop.stop_type] || icons.other}
            >
              <Popup>
                <div>
                  <strong className="capitalize">
                    {stop.stop_type.replace("_", " ")}
                  </strong>
                  <div>{stop.description || ""}</div>
                  <div className="text-xs text-gray-500">
                    Lat: {stop.lat}, Lng: {stop.lng}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          <FitMapToStops stops={stops} />
        </MapContainer>
      </div>
    </motion.div>
  );
}
