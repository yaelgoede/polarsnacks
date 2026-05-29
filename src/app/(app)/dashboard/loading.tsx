import { TripCardSkeleton } from "@/components/skeletons/trip-card-skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-9 w-28 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />
      </div>
    </div>
  );
}
