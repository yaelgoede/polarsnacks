import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/trip-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getSignedPhotoUrl } from "@/lib/supabase/storage";
import type { Trip } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: trips } = await supabase
    .from("trips")
    .select("*, meals(rating)")
    .order("start_date", { ascending: false });

  const typedTrips = (trips as (Trip & { meals: { rating: number | null }[] })[]) || [];

  const tripData = await Promise.all(
    typedTrips.map(async (trip) => {
      const mealCount = trip.meals?.length ?? 0;
      const ratings = trip.meals?.filter((m) => m.rating).map((m) => m.rating!) ?? [];
      const avgRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;
      const coverUrl = await getSignedPhotoUrl("trip-covers", trip.cover_photo_url);
      return { trip, coverUrl, mealCount, avgRating };
    })
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Link>
        </Button>
      </div>

      {tripData.length === 0 ? (
        <EmptyState
          icon={Map}
          title="Your food adventures start here"
          description="Create your first trip to begin recording meals and pinning them on the map."
          action={
            <Button asChild>
              <Link href="/trips/new">Create your first trip</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tripData.map(({ trip, coverUrl, mealCount, avgRating }, i) => (
            <TripCard
              key={trip.id}
              trip={trip}
              coverUrl={coverUrl}
              mealCount={mealCount}
              avgRating={avgRating}
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
