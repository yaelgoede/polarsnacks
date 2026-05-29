import { MealListSkeleton } from "@/components/skeletons/meal-list-skeleton";

export default function TripDetailLoading() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="w-full h-48 md:h-64 bg-muted animate-pulse rounded-lg mb-6" />
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="h-5 w-16 bg-muted animate-pulse rounded mb-4" />
      <MealListSkeleton count={3} />
    </div>
  );
}
