"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { icon } from "leaflet";
import Link from "next/link";
import type { Meal } from "@/types/database";
import "leaflet/dist/leaflet.css";

const defaultIcon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

type MapLeafletProps = {
  meals: Meal[];
  tripId: string;
};

export function MapLeaflet({ meals, tripId }: MapLeafletProps) {
  const mealsWithCoords = meals.filter((m) => m.latitude && m.longitude);

  if (mealsWithCoords.length === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No meals with location data yet</p>
      </div>
    );
  }

  const center: [number, number] = [
    mealsWithCoords.reduce((sum, m) => sum + m.latitude!, 0) / mealsWithCoords.length,
    mealsWithCoords.reduce((sum, m) => sum + m.longitude!, 0) / mealsWithCoords.length,
  ];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="w-full aspect-[4/3] rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mealsWithCoords.map((meal) => (
        <Marker
          key={meal.id}
          position={[meal.latitude!, meal.longitude!]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{meal.location_name}</p>
              {meal.rating && (
                <p>{"★".repeat(meal.rating)}{"☆".repeat(5 - meal.rating)}</p>
              )}
              <Link
                href={`/trips/${tripId}/meals/${meal.id}`}
                className="text-primary hover:underline"
              >
                View details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
