"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import type { Meal, MealCategory } from "@/types/database";
import "leaflet/dist/leaflet.css";

const CATEGORY_COLORS: Record<MealCategory, string> = {
  breakfast: "#f59e0b",
  lunch: "#22c55e",
  dinner: "#f97316",
  snack: "#ec4899",
  drinks: "#8b5cf6",
};

const DEFAULT_DOT_COLOR = "#fb923c";

function createDotIcon(category: MealCategory | null, isActive: boolean) {
  const color = category ? CATEGORY_COLORS[category] : DEFAULT_DOT_COLOR;
  const size = isActive ? 14 : 10;
  const border = isActive ? 3 : 2;
  return divIcon({
    className: "",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      border: ${border}px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: all 0.2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, positions]);

  return null;
}

function AnimatedPolyline({ positions }: { positions: [number, number][] }) {
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!polylineRef.current) return;
    const el = polylineRef.current.getElement() as SVGPathElement | null;
    if (!el) return;

    const length = el.getTotalLength?.();
    if (length) {
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
      el.style.transition = "stroke-dashoffset 2s ease-in-out";
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = "0";
      });
    }
  }, []);

  return (
    <Polyline
      ref={polylineRef as any}
      positions={positions}
      pathOptions={{
        color: "#fb923c",
        weight: 3,
        opacity: 0.8,
        dashArray: undefined,
      }}
    />
  );
}

function RouteMarkers({
  meals,
  activeId,
}: {
  meals: Meal[];
  activeId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];
    const L = require("leaflet");

    meals.forEach((meal) => {
      if (!meal.latitude || !meal.longitude) return;
      const isActive = meal.id === activeId;
      const marker = L.marker([meal.latitude, meal.longitude], {
        icon: createDotIcon(meal.category, isActive),
        zIndexOffset: isActive ? 1000 : 0,
      });
      marker.addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, meals, activeId]);

  return null;
}

export type TripRouteMapLeafletProps = {
  meals: Meal[];
  activeId?: string | null;
};

export function TripRouteMapLeaflet({
  meals,
  activeId = null,
}: TripRouteMapLeafletProps) {
  const mealsWithCoords = meals
    .filter((m) => m.latitude && m.longitude)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (mealsWithCoords.length === 0) {
    return (
      <div className="w-full h-[40vh] md:h-[60vh] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No location data yet</p>
      </div>
    );
  }

  const positions: [number, number][] = mealsWithCoords.map((m) => [
    m.latitude!,
    m.longitude!,
  ]);

  const center: [number, number] = [
    mealsWithCoords.reduce((sum, m) => sum + m.latitude!, 0) /
      mealsWithCoords.length,
    mealsWithCoords.reduce((sum, m) => sum + m.longitude!, 0) /
      mealsWithCoords.length,
  ];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="w-full h-[40vh] md:h-[60vh] z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds positions={positions} />
      <AnimatedPolyline positions={positions} />
      <RouteMarkers meals={mealsWithCoords} activeId={activeId} />
    </MapContainer>
  );
}
