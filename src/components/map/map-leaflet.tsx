"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import type { Meal, MealCategory } from "@/types/database";
import "leaflet/dist/leaflet.css";

const CATEGORY_COLORS: Record<MealCategory, string> = {
  breakfast: "#f59e0b",
  lunch: "#22c55e",
  dinner: "#f97316",
  snack: "#ec4899",
  drinks: "#8b5cf6",
};

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, positions]);
  return null;
}

function MealMarkers({ meals, tripId }: { meals: Meal[]; tripId: string }) {
  const map = useMap();

  useEffect(() => {
    const L = require("leaflet");
    const markers: L.Marker[] = [];

    meals.forEach((meal) => {
      if (!meal.latitude || !meal.longitude) return;
      const color = meal.category ? CATEGORY_COLORS[meal.category] : "#fb923c";

      const marker = L.marker([meal.latitude, meal.longitude], {
        icon: divIcon({
          className: "",
          html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      });

      marker.bindPopup(`
        <div style="font-size:13px;min-width:120px;">
          <p style="font-weight:600;margin:0 0 4px 0;">${meal.location_name}</p>
          ${meal.rating ? `<p style="margin:0 0 4px 0;">${"★".repeat(meal.rating)}${"☆".repeat(5 - meal.rating)}</p>` : ""}
          <a href="/trips/${tripId}/meals/${meal.id}" style="color:#fb923c;">View details</a>
        </div>
      `);

      marker.addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, meals, tripId]);

  return null;
}

type MapLeafletProps = {
  meals: Meal[];
  tripId: string;
};

export function MapLeaflet({ meals, tripId }: MapLeafletProps) {
  const mealsWithCoords = meals.filter((m) => m.latitude && m.longitude);

  if (mealsWithCoords.length === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No meals with location data yet</p>
      </div>
    );
  }

  const positions: [number, number][] = mealsWithCoords
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((m) => [m.latitude!, m.longitude!]);

  const center: [number, number] = [
    mealsWithCoords.reduce((sum, m) => sum + m.latitude!, 0) / mealsWithCoords.length,
    mealsWithCoords.reduce((sum, m) => sum + m.longitude!, 0) / mealsWithCoords.length,
  ];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="w-full aspect-[4/3] rounded-xl z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds positions={positions} />
      {positions.length >= 2 && (
        <Polyline
          positions={positions}
          pathOptions={{ color: "#fb923c", weight: 3, opacity: 0.7 }}
        />
      )}
      <MealMarkers meals={mealsWithCoords} tripId={tripId} />
    </MapContainer>
  );
}
