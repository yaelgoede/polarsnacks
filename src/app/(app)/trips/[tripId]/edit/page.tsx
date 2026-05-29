import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TripForm } from "@/components/trips/trip-form";
import type { Trip } from "@/types/database";

type Props = {
  params: Promise<{ tripId: string }>;
};

export default async function EditTripPage({ params }: Props) {
  const { tripId } = await params;
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (!trip) notFound();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Trip</h1>
      <TripForm trip={trip as Trip} />
    </div>
  );
}
