"use client";

import { useEffect, useState } from "react";
import type { Meal } from "@/types/database";
import type { TripRouteMapLeafletProps } from "./trip-route-map-leaflet";

type TripRouteMapProps = {
  meals: Meal[];
  activeId?: string | null;
};

export function TripRouteMap({ meals, activeId }: TripRouteMapProps) {
  const [MapComponent, setMapComponent] =
    useState<React.ComponentType<TripRouteMapLeafletProps> | null>(null);

  useEffect(() => {
    import("./trip-route-map-leaflet").then((mod) =>
      setMapComponent(() => mod.TripRouteMapLeaflet)
    );
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full h-[40vh] md:h-[60vh] bg-muted animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <MapComponent meals={meals} activeId={activeId} />;
}
