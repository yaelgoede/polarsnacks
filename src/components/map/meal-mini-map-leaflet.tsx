"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function PulsingMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    const L = require("leaflet");
    const marker = L.marker([lat, lng], {
      icon: divIcon({
        className: "",
        html: `<div style="position:relative;">
          <div style="width:12px;height:12px;border-radius:50%;background:#fb923c;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
          <div style="position:absolute;top:-4px;left:-4px;width:20px;height:20px;border-radius:50%;background:rgba(251,146,60,0.3);animation:pulse 2s ease-in-out infinite;"></div>
        </div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    });
    marker.addTo(map);
    return () => { marker.remove(); };
  }, [map, lat, lng]);

  return null;
}

export type MealMiniMapLeafletProps = {
  lat: number;
  lng: number;
};

export function MealMiniMapLeaflet({ lat, lng }: MealMiniMapLeafletProps) {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="w-full aspect-[4/3] rounded-xl z-0"
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <PulsingMarker lat={lat} lng={lng} />
      </MapContainer>
    </>
  );
}
