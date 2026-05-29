import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PhotoPlaceholder } from "@/components/shared/photo-placeholder";
import { TripStats } from "./trip-stats";
import type { Trip } from "@/types/database";

type TripCardProps = {
  trip: Trip;
  coverUrl: string | null;
  mealCount: number;
  avgRating: number | null;
  style?: React.CSSProperties;
};

export function TripCard({ trip, coverUrl, mealCount, avgRating, style }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`} style={style}>
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer h-full">
        <div className="relative h-40 md:h-48 overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={trip.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <PhotoPlaceholder variant="trip" seed={trip.name} className="w-full h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white truncate">{trip.name}</h3>
            <p className="text-sm text-white/80">
              {trip.start_date}
              {trip.end_date && ` — ${trip.end_date}`}
            </p>
          </div>
        </div>
        <div className="p-3">
          {trip.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{trip.description}</p>
          )}
          <TripStats mealCount={mealCount} avgRating={avgRating} />
        </div>
      </Card>
    </Link>
  );
}
