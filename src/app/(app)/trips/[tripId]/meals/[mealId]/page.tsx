import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, ArrowLeft, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Get adjacent meals for prev/next navigation
  const { data: allMeals } = await supabase
    .from("meals")
    .select("id, date, location_name")
    .eq("trip_id", tripId)
    .order("date", { ascending: true });

  const mealList = (allMeals as Pick<Meal, "id" | "date" | "location_name">[]) || [];
  const currentIdx = mealList.findIndex((m) => m.id === mealId);
  const prevMeal = currentIdx > 0 ? mealList[currentIdx - 1] : null;
  const nextMeal = currentIdx < mealList.length - 1 ? mealList[currentIdx + 1] : null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 fill-mode-backwards -mt-16">
      {/* Hero photo */}
      {photoUrl ? (
        <div className="relative">
          <img
            src={photoUrl}
            alt={typedMeal.location_name}
            className="w-full aspect-[4/3] md:aspect-[2/1] object-cover"
          />
          <div className="absolute top-20 left-4 right-4 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60 shadow-lg"
              asChild
            >
              <Link href={`/trips/${tripId}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60 shadow-lg"
              asChild
            >
              <Link href={`/trips/${tripId}/meals/${mealId}/edit`}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-20 flex items-center justify-between px-4 md:px-6">
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

      {/* Content */}
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
          <div className="mt-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <p className="whitespace-pre-wrap text-sm">{typedMeal.notes}</p>
          </div>
        )}

        {typedMeal.latitude && typedMeal.longitude && (
          <div className="mt-6 space-y-2">
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

        {/* Prev/Next navigation */}
        {(prevMeal || nextMeal) && (
          <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4">
            {prevMeal ? (
              <Link
                href={`/trips/${tripId}/meals/${prevMeal.id}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="truncate max-w-[140px]">{prevMeal.location_name}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextMeal ? (
              <Link
                href={`/trips/${tripId}/meals/${nextMeal.id}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="truncate max-w-[140px]">{nextMeal.location_name}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
