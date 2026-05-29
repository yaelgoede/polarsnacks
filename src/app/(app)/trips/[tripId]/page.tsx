import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteTripButton } from "@/components/trips/delete-trip-button";
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

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Meals</h2>
        <Button size="sm" asChild>
          <Link href={`/trips/${tripId}/meals/new`}>
            <Plus className="h-4 w-4 mr-1" />
            Add Meal
          </Link>
        </Button>
      </div>

      {!meals || meals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No meals recorded yet. Add your first one!
            </p>
            <Button size="sm" asChild>
              <Link href={`/trips/${tripId}/meals/new`}>Add Meal</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {(meals as Meal[]).map((meal) => (
            <Link key={meal.id} href={`/trips/${tripId}/meals/${meal.id}`}>
              <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 py-3">
                  {meal.photo_url && (
                    <img
                      src={meal.photo_url}
                      alt={meal.location_name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{meal.location_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meal.date), "MMM d, yyyy")}
                    </p>
                    {meal.rating && (
                      <p className="text-sm">{"★".repeat(meal.rating)}{"☆".repeat(5 - meal.rating)}</p>
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
