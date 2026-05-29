"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/meals/photo-upload";
import { compressImage } from "@/lib/image";
import type { Trip } from "@/types/database";

type TripFormProps = {
  trip?: Trip;
};

export function TripForm({ trip }: TripFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    let cover_photo_url = trip?.cover_photo_url ?? null;

    if (coverFile) {
      const compressed = await compressImage(coverFile);
      const fileName = `${user.id}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("trip-covers")
        .upload(fileName, compressed, { contentType: "image/jpeg" });

      if (uploadError) {
        setError(`Cover upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }
      cover_photo_url = fileName;
    }

    if (trip) {
      const { error: updateError } = await supabase
        .from("trips")
        .update({ name, description: description || null, start_date, end_date: end_date || null, cover_photo_url })
        .eq("id", trip.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      router.push(`/trips/${trip.id}`);
    } else {
      const { data, error: insertError } = await supabase
        .from("trips")
        .insert({ name, description: description || null, start_date, end_date: end_date || null, cover_photo_url, user_id: user.id })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      router.push(`/trips/${data.id}`);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label>Cover Photo</Label>
        <PhotoUpload
          onFileSelect={setCoverFile}
          preview={trip?.cover_photo_url}
          onClear={() => setCoverFile(null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Trip Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Italy Summer 2026"
          defaultValue={trip?.name}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What's this trip about?"
          defaultValue={trip?.description ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={trip?.start_date}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={trip?.end_date ?? ""}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : trip ? "Update Trip" : "Create Trip"}
      </Button>
    </form>
  );
}
