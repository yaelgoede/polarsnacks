import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/map-view";
import type { Meal } from "@/types/database";

type Props = {
  params: Promise<{ tripId: string }>;
};

export default async function TripMapPage({ params }: Props) {
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

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/trips/${tripId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Timeline
          </Link>
        </Button>
        <h1 className="text-xl font-bold">{trip.name} — Map</h1>
      </div>

      <MapView meals={(meals ?? []) as Meal[]} tripId={tripId} />
    </div>
  );
}
