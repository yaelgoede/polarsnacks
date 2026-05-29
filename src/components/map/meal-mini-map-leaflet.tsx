"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export type MealMiniMapLeafletProps = {
  lat: number;
  lng: number;
};

export function MealMiniMapLeaflet({ lat, lng }: MealMiniMapLeafletProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      className="w-full aspect-[16/9] rounded-lg z-0"
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={defaultIcon} />
    </MapContainer>
  );
}
