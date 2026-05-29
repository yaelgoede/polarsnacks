"use client";

import { useEffect, useState } from "react";
import type { Meal } from "@/types/database";

type MapViewProps = {
  meals: Meal[];
  tripId: string;
};

export function MapView({ meals, tripId }: MapViewProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapViewProps> | null>(null);

  useEffect(() => {
    import("./map-leaflet").then((mod) => setMapComponent(() => mod.MapLeaflet));
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return <MapComponent meals={meals} tripId={tripId} />;
}
