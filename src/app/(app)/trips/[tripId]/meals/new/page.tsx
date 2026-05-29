import { MealForm } from "@/components/meals/meal-form";

type Props = {
  params: Promise<{ tripId: string }>;
};

export default async function NewMealPage({ params }: Props) {
  const { tripId } = await params;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Meal</h1>
      <MealForm tripId={tripId} />
    </div>
  );
}
