import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteTripButton } from "@/components/trips/delete-trip-button";
import { TripStats } from "@/components/trips/trip-stats";
import { EmptyState } from "@/components/shared/empty-state";
import { TripRouteMap } from "@/components/map/trip-route-map";
import { MealTimeline } from "@/components/meals/meal-timeline";
import { getSignedPhotoUrls } from "@/lib/supabase/storage";
import { totalRouteDistance } from "@/lib/geo";
import type { Meal } from "@/types/database";
import { differenceInDays } from "date-fns";

type Props = {
  params: Promise<{ tripId: string }>;
};

export default async function TripDetailPage({ params }: Props) {
  const { tripId } = await params;
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (!trip) notFound();

  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("trip_id", tripId)
    .order("date", { ascending: true });

  const typedMeals = (meals as Meal[]) || [];

  const photoUrls = await getSignedPhotoUrls(
    "meal-photos",
    typedMeals.map((m) => m.photo_url)
  );

  const ratings = typedMeals.filter((m) => m.rating).map((m) => m.rating!);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null;

  const uniquePlaces = new Set(typedMeals.map((m) => m.location_name)).size;
  const days = trip.end_date
    ? differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1
    : undefined;

  const mealsWithCoords = typedMeals
    .filter((m) => m.latitude && m.longitude)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const distanceKm =
    mealsWithCoords.length >= 2
      ? totalRouteDistance(
          mealsWithCoords.map((m) => ({
            latitude: m.latitude!,
            longitude: m.longitude!,
          }))
        )
      : undefined;

  return (
    <div className="animate-in fade-in duration-300 fill-mode-backwards">
      {/* Map Hero */}
      <div className="relative -mt-16">
        <TripRouteMap meals={typedMeals} />

        {/* Overlay panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-4xl mx-auto flex items-end justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {trip.name}
              </h1>
              <p className="text-sm text-white/70 mt-1">
                {trip.start_date}
                {trip.end_date && ` — ${trip.end_date}`}
              </p>
              {trip.description && (
                <p className="text-sm text-white/60 mt-1 max-w-md line-clamp-2">
                  {trip.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/15 backdrop-blur-md border-white/20 text-white hover:bg-white/25"
                asChild
              >
                <Link href={`/trips/${tripId}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <DeleteTripButton tripId={tripId} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Stats */}
        {typedMeals.length > 0 && (
          <div className="mb-6">
            <TripStats
              mealCount={typedMeals.length}
              avgRating={avgRating}
              uniquePlaces={uniquePlaces}
              days={days}
              distanceKm={distanceKm}
            />
          </div>
        )}

        {/* Timeline header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <Button size="sm" asChild>
            <Link href={`/trips/${tripId}/meals/new`}>
              <Plus className="h-4 w-4 mr-1" />
              Add Meal
            </Link>
          </Button>
        </div>

        {/* Timeline or empty state */}
        {typedMeals.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No meals recorded yet"
            description="Add your first meal to start building your food journal for this trip."
            action={
              <Button size="sm" asChild>
                <Link href={`/trips/${tripId}/meals/new`}>Add Meal</Link>
              </Button>
            }
          />
        ) : (
          <MealTimeline
            meals={typedMeals}
            photoUrls={photoUrls}
            tripId={tripId}
          />
        )}
      </div>
    </div>
  );
}
