"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/meals/photo-upload";
import { LocationPicker } from "@/components/map/location-picker";
import { compressImage } from "@/lib/image";
import type { Listing } from "@/types/database";

type ListingFormProps = {
  listing?: Listing;
};

export function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    listing?.latitude && listing?.longitude
      ? { lat: listing.latitude, lng: listing.longitude }
      : null
  );
  const [locationName, setLocationName] = useState(
    listing?.location_name ?? ""
  );

  const handleLocationNameFound = useCallback((name: string) => {
    setLocationName((prev) => (prev ? prev : name));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const restaurant_name = formData.get("restaurant_name") as string;
    const description = formData.get("description") as string;
    const website_url = formData.get("website_url") as string;
    const contact_email = formData.get("contact_email") as string;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    let photo_url = listing?.photo_url ?? null;

    if (photoFile) {
      const compressed = await compressImage(photoFile);
      const fileName = `${user.id}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("listing-photos")
        .upload(fileName, compressed, { contentType: "image/jpeg" });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      photo_url = fileName;
    }

    const listingData = {
      restaurant_name,
      description: description || null,
      location_name: locationName || null,
      latitude: location?.lat ?? null,
      longitude: location?.lng ?? null,
      website_url: website_url || null,
      contact_email,
      photo_url,
    };

    if (listing) {
      const { error: updateError } = await supabase
        .from("listings")
        .update(listingData)
        .eq("id", listing.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("listings")
        .insert({ ...listingData, owner_id: user.id });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/business/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <PhotoUpload
        onFileSelect={setPhotoFile}
        preview={listing?.photo_url}
        onClear={() => setPhotoFile(null)}
      />

      <div className="space-y-2">
        <Label htmlFor="restaurant_name">Restaurant Name</Label>
        <Input
          id="restaurant_name"
          name="restaurant_name"
          placeholder="e.g. Trattoria da Mario"
          defaultValue={listing?.restaurant_name ?? ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell travelers what makes your restaurant special"
          defaultValue={listing?.description ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="e.g. Amsterdam, Netherlands"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <LocationPicker
          value={location}
          onChange={setLocation}
          onLocationNameFound={handleLocationNameFound}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">Website</Label>
        <Input
          id="website_url"
          name="website_url"
          type="url"
          placeholder="https://yourrestaurant.com"
          defaultValue={listing?.website_url ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          placeholder="you@restaurant.com"
          defaultValue={listing?.contact_email ?? ""}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : listing ? "Update Listing" : "Create Listing"}
      </Button>
    </form>
  );
}
