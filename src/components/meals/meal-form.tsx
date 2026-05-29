"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "./photo-upload";
import { RatingStars } from "./rating-stars";
import { ListingLinker } from "./listing-linker";
import { LocationPicker } from "@/components/map/location-picker";
import { compressImage } from "@/lib/image";
import type { Meal, MealCategory } from "@/types/database";

const CATEGORIES: { value: MealCategory; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "drinks", label: "Drinks" },
];

type MealFormProps = {
  tripId: string;
  meal?: Meal;
};

export function MealForm({ tripId, meal }: MealFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(meal?.rating ?? 0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    meal?.latitude && meal?.longitude
      ? { lat: meal.latitude, lng: meal.longitude }
      : null
  );
  const [locationName, setLocationName] = useState(meal?.location_name ?? "");
  const [category, setCategory] = useState<MealCategory | null>(meal?.category ?? null);
  const [listingId, setListingId] = useState<string | null>(meal?.listing_id ?? null);

  const handleLocationNameFound = useCallback((name: string) => {
    setLocationName((prev) => (prev ? prev : name));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const location_name = locationName || (formData.get("location_name") as string);
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    let photo_url = meal?.photo_url ?? null;

    if (photoFile) {
      const compressed = await compressImage(photoFile);
      const fileName = `${user.id}/${tripId}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("meal-photos")
        .upload(fileName, compressed, { contentType: "image/jpeg" });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      photo_url = fileName;
    }

    const mealData = {
      location_name,
      latitude: location?.lat ?? null,
      longitude: location?.lng ?? null,
      date,
      rating: rating || null,
      notes: notes || null,
      category,
      photo_url,
      listing_id: listingId,
    };

    if (meal) {
      const { error: updateError } = await supabase
        .from("meals")
        .update(mealData)
        .eq("id", meal.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("meals")
        .insert({ ...mealData, trip_id: tripId, user_id: user.id });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    router.push(`/trips/${tripId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <PhotoUpload
        onFileSelect={setPhotoFile}
        preview={meal?.photo_url}
        onClear={() => setPhotoFile(null)}
      />

      <div className="space-y-2">
        <Label htmlFor="location_name">Restaurant / Location</Label>
        <Input
          id="location_name"
          name="location_name"
          placeholder="e.g. Trattoria da Mario"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Pin on map</Label>
        <LocationPicker
          value={location}
          onChange={setLocation}
          onLocationNameFound={handleLocationNameFound}
        />
      </div>

      <ListingLinker
        value={listingId}
        onChange={setListingId}
        location={location}
      />

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={meal?.date ?? new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(category === cat.value ? null : cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent hover:border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <RatingStars value={rating} onChange={setRating} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="What did you eat? How was it?"
          defaultValue={meal?.notes ?? ""}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : meal ? "Update Meal" : "Add Meal"}
      </Button>
    </form>
  );
}
