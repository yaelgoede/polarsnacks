import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink, Store } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
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
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards">
      <h1 className="text-2xl font-bold mb-6">Featured Restaurants</h1>

      {!listings || listings.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No featured restaurants yet"
          description="Featured restaurants will appear here. Check back soon!"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(listings as Listing[]).map((listing, i) => (
            <Card
              key={listing.id}
              className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
              style={{ animationDelay: `${i * 75}ms` }}
            >
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
