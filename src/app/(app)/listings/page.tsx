import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import type { Listing } from "@/types/database";

export default async function ListingsPage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("is_featured", true)
    .eq("payment_status", "paid")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Featured Restaurants</h1>

      {!listings || listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No featured restaurants yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(listings as Listing[]).map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <CardTitle className="text-lg">{listing.restaurant_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {listing.location_name && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.location_name}
                  </p>
                )}
                {listing.description && (
                  <p className="text-sm">{listing.description}</p>
                )}
                {listing.website_url && (
                  <a
                    href={listing.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Website
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
