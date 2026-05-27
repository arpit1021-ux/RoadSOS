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

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom ambulance icon
const ambulanceIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/2966/2966487.png",
  iconSize: [40, 40],
});

export default function EmergencyMap({
  userLocation,
  ambulanceLocation,
}) {
    const [route, setRoute] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
    const [eta, setEta] = useState(5);
    const [arrived, setArrived] = useState(false);
    useEffect(() => {
  const fetchRoute = async () => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${
          import.meta.env.VITE_ORS_API_KEY
        }&start=${ambulanceLocation[1]},${ambulanceLocation[0]}&end=${userLocation[1]},${userLocation[0]}`
      );

      const data = await response.json();

      const coordinates =
        data.features[0].geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );

      setRoute(coordinates);

if (coordinates.length > 0) {
  setCurrentPosition(coordinates[0]);
}
    } catch (error) {
      console.error("Route fetch error:", error);
    }
  };

  fetchRoute();
}, [ambulanceLocation, userLocation]);
useEffect(() => {
  if (route.length === 0) return;

  let index = 0;

  const interval = setInterval(() => {

    if (index < route.length - 1) {

      index++;

      setCurrentPosition(route[index]);

      setCurrentRouteIndex(index);
      const remaining = route.length - index;

setEta(Math.ceil(remaining / 2));

    } else {
      setArrived(true);
      clearInterval(interval);

    }

  }, 1500);

  return () => clearInterval(interval);

}, [route]);
  return (
    <div className="mt-8 rounded-3xl overflow-hidden border border-white/10">
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Marker */}
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Ambulance Marker */}
        <Marker
          position={currentPosition || ambulanceLocation}
          icon={ambulanceIcon}
        >
          <Popup>Ambulance on the way 🚑</Popup>
        </Marker>

        {/* Route */}
        {route.length > 0 && (
  <Polyline
    positions={route.slice(currentRouteIndex)}
    color="red"
    weight={5}
  />
)}
      </MapContainer>
    </div>
  );
}