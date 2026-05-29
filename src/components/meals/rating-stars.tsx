"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  value: number;
  onChange: (rating: number) => void;
};

export function RatingStars({ value, onChange }: RatingStarsProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}
