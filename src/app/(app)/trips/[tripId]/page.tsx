import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, MapPin, Pencil, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteTripButton } from "@/components/trips/delete-trip-button";
import { TripStats } from "@/components/trips/trip-stats";
import { CategoryBadge } from "@/components/meals/category-badge";
import { PhotoPlaceholder } from "@/components/shared/photo-placeholder";
import { EmptyState } from "@/components/shared/empty-state";
import { getSignedPhotoUrl, getSignedPhotoUrls } from "@/lib/supabase/storage";
import type { Meal } from "@/types/database";
import { format } from "date-fns";

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
    .order("date", { ascending: false });

  const typedMeals = (meals as Meal[]) || [];

  const [coverUrl, photoUrls] = await Promise.all([
    getSignedPhotoUrl("trip-covers", trip.cover_photo_url),
    getSignedPhotoUrls("meal-photos", typedMeals.map((m) => m.photo_url)),
  ]);

  const ratings = typedMeals.filter((m) => m.rating).map((m) => m.rating!);
  const avgRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : null;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards">
      {coverUrl && (
        <img
          src={coverUrl}
          alt={trip.name}
          className="w-full h-48 md:h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{trip.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {trip.start_date}
            {trip.end_date && ` — ${trip.end_date}`}
          </p>
          {trip.description && (
            <p className="mt-2 text-muted-foreground">{trip.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/trips/${tripId}/map`}>
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/trips/${tripId}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteTripButton tripId={tripId} />
        </div>
      </div>

      {typedMeals.length > 0 && (
        <div className="mb-4">
          <TripStats mealCount={typedMeals.length} avgRating={avgRating} />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Meals</h2>
        <Button size="sm" asChild>
          <Link href={`/trips/${tripId}/meals/new`}>
            <Plus className="h-4 w-4 mr-1" />
            Add Meal
          </Link>
        </Button>
      </div>

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
        <div className="space-y-3">
          {typedMeals.map((meal, i) => (
            <Link key={meal.id} href={`/trips/${tripId}/meals/${meal.id}`}>
              <Card className="group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="flex items-center gap-4 py-3">
                  {photoUrls[i] ? (
                    <img
                      src={photoUrls[i]!}
                      alt={meal.location_name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover shadow-sm group-hover:scale-[1.02] transition-transform duration-300 shrink-0"
                    />
                  ) : (
                    <PhotoPlaceholder
                      variant="meal"
                      seed={meal.location_name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{meal.location_name}</p>
                      {meal.category && <CategoryBadge category={meal.category} />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meal.date), "MMM d, yyyy")}
                    </p>
                    {meal.rating && (
                      <p className="text-sm mt-1">{"★".repeat(meal.rating)}{"☆".repeat(5 - meal.rating)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
