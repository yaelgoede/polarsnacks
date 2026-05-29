"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { LocationSearch } from "./location-search";
import type { LocationPickerLeafletProps } from "./location-picker-leaflet";

type LocationPickerProps = {
  value: { lat: number; lng: number } | null;
  onChange: (location: { lat: number; lng: number }) => void;
  onLocationNameFound?: (name: string) => void;
};

export function LocationPicker({
  value,
  onChange,
  onLocationNameFound,
}: LocationPickerProps) {
  const [MapComponent, setMapComponent] =
    useState<React.ComponentType<LocationPickerLeafletProps> | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  useEffect(() => {
    import("./location-picker-leaflet").then((mod) =>
      setMapComponent(() => mod.LocationPickerLeaflet)
    );
  }, []);

  const handleGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(err.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onChange]);

  const handleSearchSelect = useCallback(
    (location: { lat: number; lng: number; name: string }) => {
      onChange({ lat: location.lat, lng: location.lng });
      if (onLocationNameFound) {
        onLocationNameFound(location.name);
      }
    },
    [onChange, onLocationNameFound]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <LocationSearch onSelect={handleSearchSelect} />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGps}
          disabled={gpsLoading}
        >
          <Navigation className="h-4 w-4 mr-1" />
          {gpsLoading ? "..." : "GPS"}
        </Button>
      </div>

      {gpsError && (
        <p className="text-xs text-destructive">{gpsError}</p>
      )}

      {!MapComponent ? (
        <div className="w-full aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      ) : (
        <MapComponent value={value} onChange={onChange} />
      )}

      {value && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
