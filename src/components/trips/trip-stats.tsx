import { UtensilsCrossed, Star, MapPin, Calendar, Route } from "lucide-react";

type TripStatsProps = {
  mealCount: number;
  avgRating: number | null;
  uniquePlaces?: number;
  days?: number;
  distanceKm?: number;
};

export function TripStats({
  mealCount,
  avgRating,
  uniquePlaces,
  days,
  distanceKm,
}: TripStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatPill icon={<UtensilsCrossed className="h-3 w-3" />}>
        {mealCount} {mealCount === 1 ? "meal" : "meals"}
      </StatPill>
      {uniquePlaces !== undefined && uniquePlaces > 0 && (
        <StatPill icon={<MapPin className="h-3 w-3" />}>
          {uniquePlaces} {uniquePlaces === 1 ? "place" : "places"}
        </StatPill>
      )}
      {days !== undefined && days > 0 && (
        <StatPill icon={<Calendar className="h-3 w-3" />}>
          {days} {days === 1 ? "day" : "days"}
        </StatPill>
      )}
      {distanceKm !== undefined && distanceKm > 0.5 && (
        <StatPill icon={<Route className="h-3 w-3" />}>
          {distanceKm < 1
            ? `${Math.round(distanceKm * 1000)}m`
            : `${Math.round(distanceKm)} km`}
        </StatPill>
      )}
      {avgRating !== null && (
        <StatPill
          icon={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
        >
          {avgRating.toFixed(1)}
        </StatPill>
      )}
    </div>
  );
}

function StatPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/80 text-xs font-medium text-muted-foreground">
      {icon}
      {children}
    </span>
  );
}
