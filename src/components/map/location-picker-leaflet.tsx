"use client";

import { useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { icon, type LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export type LocationPickerLeafletProps = {
  value: { lat: number; lng: number } | null;
  onChange: (location: { lat: number; lng: number }) => void;
};

function ClickHandler({
  onChange,
}: {
  onChange: (location: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, map.getZoom(), { duration: 0.5 });
  return null;
}

export function LocationPickerLeaflet({
  value,
  onChange,
}: LocationPickerLeafletProps) {
  const center: [number, number] = value
    ? [value.lat, value.lng]
    : [48.8566, 2.3522]; // Default: Paris

  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

  const handleClick = useCallback(
    (location: { lat: number; lng: number }) => {
      onChange(location);
      setFlyTarget(null);
    },
    [onChange]
  );

  return (
    <MapContainer
      center={center}
      zoom={value ? 15 : 4}
      className="w-full aspect-[4/3] rounded-lg z-0 cursor-crosshair"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onChange={handleClick} />
      {flyTarget && <FlyTo center={flyTarget} />}
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          icon={defaultIcon}
          draggable
          eventHandlers={{
            dragend(e) {
              const latlng: LatLng = e.target.getLatLng();
              onChange({ lat: latlng.lat, lng: latlng.lng });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
