import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripStats } from "@/components/trips/trip-stats";
import type { Trip } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: trips } = await supabase
    .from("trips")
    .select("*, meals(rating)")
    .order("start_date", { ascending: false });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Link>
        </Button>
      </div>

      {!trips || trips.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No trips yet. Start recording your food adventures!
            </p>
            <Button asChild>
              <Link href="/trips/new">Create your first trip</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {await Promise.all(
            (trips as (Trip & { meals: { rating: number | null }[] })[]).map(async (trip) => {
              const mealCount = trip.meals?.length ?? 0;
              const ratings = trip.meals?.filter((m) => m.rating).map((m) => m.rating!) ?? [];
              const avgRating = ratings.length > 0
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : null;

              let coverUrl: string | null = null;
              if (trip.cover_photo_url) {
                const { data } = await supabase.storage
                  .from("trip-covers")
                  .createSignedUrl(trip.cover_photo_url, 3600);
                coverUrl = data?.signedUrl ?? null;
              }

              return (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full overflow-hidden">
                    {coverUrl && (
                      <img
                        src={coverUrl}
                        alt={trip.name}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{trip.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {trip.start_date}
                        {trip.end_date && ` — ${trip.end_date}`}
                      </p>
                      {trip.description && (
                        <p className="text-sm mt-2 line-clamp-2">{trip.description}</p>
                      )}
                      {mealCount > 0 && (
                        <div className="mt-2">
                          <TripStats mealCount={mealCount} avgRating={avgRating} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
