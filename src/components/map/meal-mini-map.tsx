"use client";

import { useEffect, useState } from "react";
import type { MealMiniMapLeafletProps } from "./meal-mini-map-leaflet";

type MealMiniMapProps = {
  lat: number;
  lng: number;
};

export function MealMiniMap({ lat, lng }: MealMiniMapProps) {
  const [MapComponent, setMapComponent] =
    useState<React.ComponentType<MealMiniMapLeafletProps> | null>(null);

  useEffect(() => {
    import("./meal-mini-map-leaflet").then((mod) =>
      setMapComponent(() => mod.MealMiniMapLeaflet)
    );
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full aspect-[16/9] rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return <MapComponent lat={lat} lng={lng} />;
}
