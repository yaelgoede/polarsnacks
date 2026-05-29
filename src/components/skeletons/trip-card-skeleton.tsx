import { Card } from "@/components/ui/card";

export function TripCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 md:h-48 bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        <div className="flex gap-3">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-12 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </Card>
  );
}
