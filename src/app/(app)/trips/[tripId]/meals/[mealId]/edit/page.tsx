import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MealForm } from "@/components/meals/meal-form";
import type { Meal } from "@/types/database";

type Props = {
  params: Promise<{ tripId: string; mealId: string }>;
};

export default async function EditMealPage({ params }: Props) {
  const { tripId, mealId } = await params;
  const supabase = await createClient();

  const { data: meal } = await supabase
    .from("meals")
    .select("*")
    .eq("id", mealId)
    .single();

  if (!meal) notFound();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Meal</h1>
      <MealForm tripId={tripId} meal={meal as Meal} />
    </div>
  );
}
