"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "./photo-upload";
import { RatingStars } from "./rating-stars";
import type { Meal } from "@/types/database";

type MealFormProps = {
  tripId: string;
  meal?: Meal;
};

async function compressImage(file: File, maxWidth = 1200): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob!),
        "image/jpeg",
        0.8
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export function MealForm({ tripId, meal }: MealFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(meal?.rating ?? 0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const location_name = formData.get("location_name") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
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
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      date,
      rating: rating || null,
      notes: notes || null,
      photo_url,
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
          defaultValue={meal?.location_name}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            placeholder="e.g. 41.9028"
            defaultValue={meal?.latitude ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            placeholder="e.g. 12.4964"
            defaultValue={meal?.longitude ?? ""}
          />
        </div>
      </div>

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
