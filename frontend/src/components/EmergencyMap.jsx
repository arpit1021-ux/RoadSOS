import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ambulanceIcon = new L.Icon({
  iconUrl:  "https://cdn-icons-png.flaticon.com/512/2966/2966487.png",
  iconSize: [40, 40],
});

export default function EmergencyMap({ userLocation, ambulanceLocation }) {
  const [route, setRoute]                       = useState([]);
  const [currentPosition, setCurrentPosition]   = useState(ambulanceLocation); // FIX 5: fallback to prop
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [eta, setEta]                           = useState(5);
  const [arrived, setArrived]                   = useState(false);

  // ── Fetch real road route ────────────────────────────────────────────────
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${
            import.meta.env.VITE_ORS_API_KEY
          }&start=${ambulanceLocation[1]},${ambulanceLocation[0]}&end=${userLocation[1]},${userLocation[0]}`
        );
        const data = await response.json();
        const coordinates = data.features[0].geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );
        const smoothRoute = [];

for (let i = 0; i < coordinates.length - 1; i++) {
  const start = coordinates[i];
  const end = coordinates[i + 1];

  smoothRoute.push(start);

  // add interpolated midpoint
  smoothRoute.push([
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
  ]);
}

smoothRoute.push(coordinates[coordinates.length - 1]);
        setRoute(smoothRoute);
        if (coordinates.length > 0) setCurrentPosition(coordinates[0]);
      } catch (error) {
        console.error("Route fetch error:", error);
        // FIX 5: straight-line fallback so marker doesn't crash
        setCurrentPosition(ambulanceLocation);
      }
    };
    fetchRoute();
  }, []);

  // ── Animate ambulance along route ────────────────────────────────────────
  useEffect(() => {
    if (route.length === 0) return;

    let index = currentRouteIndex;
    // FIX 1: ETA step = total eta / total route points
    const etaStep = eta / route.length;

    const interval = setInterval(() => {
      if (index < route.length - 1) {
        index++;
        setCurrentRouteIndex(index);
        setCurrentPosition(route[index]);
        // FIX 1: count eta down with each step
        setEta(prev => Math.max(0, parseFloat((prev - etaStep).toFixed(1))));
      } else {
        clearInterval(interval);
        setArrived(true); // FIX 3: mark arrived
        setEta(0);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [route]);

  return (
    <div className="mt-8 rounded-3xl overflow-hidden border border-white/10">

      {/* FIX 3: arrived banner */}
      {arrived && (
        <div style={{
          background: '#16a34a',
          color: '#fff',
          textAlign: 'center',
          padding: '10px',
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.05em',
        }}>
          🚑 AMBULANCE ARRIVED
        </div>
      )}

      {/* FIX 1: live ETA badge above map */}
      {!arrived && (
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          textAlign: 'center',
          padding: '8px',
          fontSize: 13,
          fontFamily: 'monospace',
        }}>
          🚑 Ambulance ETA: <strong>{eta} min</strong>
        </div>
      )}

      <MapContainer
        center={userLocation}
        zoom={14}
        style={{
          height: "400px", // FIX 4: slightly shorter, mobile-friendlier
          width: "100%",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={userLocation}>
          <Popup>📍 You are here</Popup>
        </Marker>

        <Marker
          position={currentPosition || ambulanceLocation} // FIX 5: guaranteed non-null
          icon={ambulanceIcon}
        >
          <Popup>🚑 Ambulance on the way</Popup>
        </Marker>

        {/* FIX 2: show full route in faint grey, remaining route in red */}
        {route.length > 0 && (
          <>
            <Polyline
              positions={route}
              color="rgba(255,255,255,0.15)"
              weight={5}
            />
            <Polyline
              positions={
  currentRouteIndex < route.length
    ? route.slice(currentRouteIndex)
    : []
}
              color="#ef4444"
              weight={4}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}