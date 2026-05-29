import { TripForm } from "@/components/trips/trip-form";

export default function NewTripPage() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Trip</h1>
      <TripForm />
    </div>
  );
}
