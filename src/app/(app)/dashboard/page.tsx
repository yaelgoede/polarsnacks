import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trip } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: trips } = await supabase
    .from("trips")
    .select("*")
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
          {(trips as Trip[]).map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
