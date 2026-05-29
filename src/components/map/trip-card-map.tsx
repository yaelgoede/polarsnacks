"use client";

import { useEffect, useRef, useState } from "react";
import type { TripCardMapLeafletProps } from "./trip-card-map-leaflet";

type TripCardMapProps = TripCardMapLeafletProps;

export function TripCardMap({ positions, colors }: TripCardMapProps) {
  const [MapComponent, setMapComponent] =
    useState<React.ComponentType<TripCardMapLeafletProps> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      import("./trip-card-map-leaflet").then((mod) =>
        setMapComponent(() => mod.TripCardMapLeaflet)
      );
    }
  }, [isVisible]);

  return (
    <div ref={ref} className="w-full h-full">
      {MapComponent ? (
        <MapComponent positions={positions} colors={colors} />
      ) : (
        <div className="w-full h-full bg-muted/30" />
      )}
    </div>
  );
}
