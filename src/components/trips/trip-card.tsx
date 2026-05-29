import Link from "next/link";
import { PhotoPlaceholder } from "@/components/shared/photo-placeholder";
import { TripCardMap } from "@/components/map/trip-card-map";
import type { Trip, MealCategory } from "@/types/database";

const CATEGORY_COLORS: Record<MealCategory, string> = {
  breakfast: "#f59e0b",
  lunch: "#22c55e",
  dinner: "#f97316",
  snack: "#ec4899",
  drinks: "#8b5cf6",
};

type MealCoord = {
  latitude: number;
  longitude: number;
  category: MealCategory | null;
};

type TripCardProps = {
  trip: Trip;
  coverUrl: string | null;
  mealCount: number;
  avgRating: number | null;
  mealCoords?: MealCoord[];
  style?: React.CSSProperties;
};

export function TripCard({
  trip,
  coverUrl,
  mealCount,
  avgRating,
  mealCoords = [],
  style,
}: TripCardProps) {
  const hasRoute = mealCoords.length >= 2;
  const positions: [number, number][] = mealCoords.map((m) => [
    m.latitude,
    m.longitude,
  ]);
  const colors = mealCoords.map(
    (m) => (m.category ? CATEGORY_COLORS[m.category] : "#fb923c")
  );

  return (
    <Link href={`/trips/${trip.id}`} style={style}>
      <div className="group relative h-56 md:h-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]">
        {/* Background: route map or cover image */}
        {hasRoute ? (
          <TripCardMap positions={positions} colors={colors} />
        ) : coverUrl ? (
          <img
            src={coverUrl}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <PhotoPlaceholder variant="trip" seed={trip.name} className="w-full h-full" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <h3 className="text-lg md:text-xl font-semibold text-white truncate">
            {trip.name}
          </h3>
          <p className="text-sm text-white/70 mt-0.5">
            {trip.start_date}
            {trip.end_date && ` — ${trip.end_date}`}
          </p>
          {trip.description && (
            <p className="text-xs text-white/50 mt-1 line-clamp-1">
              {trip.description}
            </p>
          )}
        </div>

        {/* Stats pills */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {mealCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white/90 font-medium">
              {mealCount} {mealCount === 1 ? "meal" : "meals"}
            </span>
          )}
          {avgRating !== null && (
            <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white/90 font-medium">
              ★ {avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
