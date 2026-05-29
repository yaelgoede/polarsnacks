import { UtensilsCrossed, Star } from "lucide-react";

type TripStatsProps = {
  mealCount: number;
  avgRating: number | null;
};

export function TripStats({ mealCount, avgRating }: TripStatsProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <UtensilsCrossed className="h-3.5 w-3.5" />
        {mealCount} {mealCount === 1 ? "meal" : "meals"}
      </span>
      {avgRating !== null && (
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {avgRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
