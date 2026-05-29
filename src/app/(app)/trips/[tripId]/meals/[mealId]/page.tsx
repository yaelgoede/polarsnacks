import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealMiniMap } from "@/components/map/meal-mini-map";
import { CategoryBadge } from "@/components/meals/category-badge";
import { getSignedPhotoUrl } from "@/lib/supabase/storage";
import { format } from "date-fns";
import type { Meal } from "@/types/database";

type Props = {
  params: Promise<{ tripId: string; mealId: string }>;
};

export default async function MealDetailPage({ params }: Props) {
  const { tripId, mealId } = await params;
  const supabase = await createClient();

  const { data: meal } = await supabase
    .from("meals")
    .select("*")
    .eq("id", mealId)
    .single();

  if (!meal) notFound();

  const typedMeal = meal as Meal;
  const photoUrl = await getSignedPhotoUrl("meal-photos", typedMeal.photo_url);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 fill-mode-backwards">
      {photoUrl ? (
        <div className="relative -mx-0 md:mx-0">
          <img
            src={photoUrl}
            alt={typedMeal.location_name}
            className="w-full aspect-[4/3] md:aspect-[16/9] object-cover md:rounded-lg"
          />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Button variant="secondary" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-foreground shadow-sm" asChild>
              <Link href={`/trips/${tripId}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-foreground shadow-sm" asChild>
              <Link href={`/trips/${tripId}/meals/${mealId}/edit`}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 md:p-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/trips/${tripId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/trips/${tripId}/meals/${mealId}/edit`}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      )}

      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold">{typedMeal.location_name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-muted-foreground">
            {format(new Date(typedMeal.date), "MMMM d, yyyy")}
          </p>
          {typedMeal.category && <CategoryBadge category={typedMeal.category} />}
        </div>

        {typedMeal.rating && (
          <p className="mt-2 text-lg">
            {"★".repeat(typedMeal.rating)}{"☆".repeat(5 - typedMeal.rating)}
          </p>
        )}

        {typedMeal.notes && (
          <p className="mt-4 whitespace-pre-wrap">{typedMeal.notes}</p>
        )}

        {typedMeal.latitude && typedMeal.longitude && (
          <div className="mt-4 space-y-2">
            <MealMiniMap lat={typedMeal.latitude} lng={typedMeal.longitude} />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${typedMeal.latitude},${typedMeal.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Navigation className="h-3.5 w-3.5" />
              Get directions
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
