"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [20, 20], maxZoom: 12 });
    }
  }, [map, positions]);

  return null;
}

function DotMarkers({ positions, colors }: { positions: [number, number][]; colors: string[] }) {
  const map = useMap();

  useEffect(() => {
    const L = require("leaflet");
    const markers: L.Marker[] = [];

    positions.forEach((pos, i) => {
      const marker = L.marker(pos, {
        icon: divIcon({
          className: "",
          html: `<div style="width:6px;height:6px;border-radius:50%;background:${colors[i] || '#fb923c'};border:1.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [6, 6],
          iconAnchor: [3, 3],
        }),
      });
      marker.addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, positions, colors]);

  return null;
}

export type TripCardMapLeafletProps = {
  positions: [number, number][];
  colors: string[];
};

export function TripCardMapLeaflet({ positions, colors }: TripCardMapLeafletProps) {
  if (positions.length === 0) return null;

  const center: [number, number] = [
    positions.reduce((sum, p) => sum + p[0], 0) / positions.length,
    positions.reduce((sum, p) => sum + p[1], 0) / positions.length,
  ];

  return (
    <MapContainer
      center={center}
      zoom={10}
      className="w-full h-full z-0"
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      attributionControl={false}
      keyboard={false}
      doubleClickZoom={false}
      touchZoom={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <FitBounds positions={positions} />
      {positions.length >= 2 && (
        <Polyline
          positions={positions}
          pathOptions={{ color: "#fb923c", weight: 2, opacity: 0.7 }}
        />
      )}
      <DotMarkers positions={positions} colors={colors} />
    </MapContainer>
  );
}
