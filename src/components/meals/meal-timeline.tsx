"use client";

import Link from "next/link";
import { format, isSameDay } from "date-fns";
import { CategoryBadge } from "./category-badge";
import { PhotoPlaceholder } from "@/components/shared/photo-placeholder";
import { haversineDistance } from "@/lib/geo";
import type { Meal, MealCategory } from "@/types/database";

const CATEGORY_COLORS: Record<MealCategory, string> = {
  breakfast: "bg-amber-400",
  lunch: "bg-green-400",
  dinner: "bg-orange-400",
  snack: "bg-pink-400",
  drinks: "bg-purple-400",
};

type MealTimelineProps = {
  meals: Meal[];
  photoUrls: (string | null)[];
  tripId: string;
  onHover?: (mealId: string | null) => void;
};

export function MealTimeline({
  meals,
  photoUrls,
  tripId,
  onHover,
}: MealTimelineProps) {
  const sorted = meals
    .map((meal, i) => ({ meal, photoUrl: photoUrls[i] }))
    .sort(
      (a, b) =>
        new Date(a.meal.date).getTime() - new Date(b.meal.date).getTime()
    );

  let dayCounter = 0;
  let lastDate: Date | null = null;

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />

      <div className="space-y-1">
        {sorted.map(({ meal, photoUrl }, i) => {
          const mealDate = new Date(meal.date);
          const showDayHeader = !lastDate || !isSameDay(lastDate, mealDate);
          if (showDayHeader) dayCounter++;
          lastDate = mealDate;

          const prevMeal = i > 0 ? sorted[i - 1].meal : null;
          const distance =
            prevMeal?.latitude &&
            prevMeal?.longitude &&
            meal.latitude &&
            meal.longitude
              ? haversineDistance(
                  prevMeal.latitude,
                  prevMeal.longitude,
                  meal.latitude,
                  meal.longitude
                )
              : null;

          return (
            <div key={meal.id}>
              {showDayHeader && (
                <div className="flex items-center gap-3 py-3 pl-11">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Day {dayCounter} &mdash;{" "}
                    {format(mealDate, "MMM d")}
                  </span>
                </div>
              )}

              {distance !== null && distance > 0.1 && (
                <div className="flex items-center gap-2 py-1 pl-11">
                  <span className="text-xs text-muted-foreground/60">
                    {distance < 1
                      ? `${Math.round(distance * 1000)}m`
                      : `${distance.toFixed(1)} km`}
                  </span>
                </div>
              )}

              <Link
                href={`/trips/${tripId}/meals/${meal.id}`}
                className="group relative flex items-start gap-4 py-2 pl-2 pr-2 rounded-xl transition-all duration-200 hover:bg-card/80"
                onMouseEnter={() => onHover?.(meal.id)}
                onMouseLeave={() => onHover?.(null)}
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 mt-4">
                  <div
                    className={`w-[10px] h-[10px] rounded-full border-2 border-background shadow-sm ${
                      meal.category
                        ? CATEGORY_COLORS[meal.category]
                        : "bg-primary"
                    }`}
                  />
                </div>

                {/* Card content */}
                <div className="flex-1 flex gap-3 p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 group-hover:bg-card group-hover:border-border transition-all duration-200">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={meal.location_name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover shrink-0 group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <PhotoPlaceholder
                      variant="meal"
                      seed={meal.location_name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate text-sm">
                        {meal.location_name}
                      </p>
                      {meal.category && (
                        <CategoryBadge category={meal.category} />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(mealDate, "h:mm a")}
                    </p>
                    {meal.rating && (
                      <p className="text-sm mt-1">
                        {"★".repeat(meal.rating)}
                        {"☆".repeat(5 - meal.rating)}
                      </p>
                    )}
                    {meal.notes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {meal.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
