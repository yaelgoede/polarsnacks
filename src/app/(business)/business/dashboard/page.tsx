import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingStatusBadge } from "@/components/business/listing-status-badge";
import { getSignedPhotoUrl } from "@/lib/supabase/storage";
import type { Listing } from "@/types/database";

export default async function BusinessDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const typedListings = (listings as Listing[]) || [];

  const listingData = await Promise.all(
    typedListings.map(async (listing) => {
      const photoUrl = await getSignedPhotoUrl(
        "listing-photos",
        listing.photo_url
      );
      return { listing, photoUrl };
    })
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/business/listing/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Link>
        </Button>
      </div>

      {listingData.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No listings yet"
          description="Create your first listing to get your restaurant discovered by travelers."
          action={
            <Button asChild>
              <Link href="/business/listing/new">Create your first listing</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listingData.map(({ listing, photoUrl }, i) => (
            <Link
              key={listing.id}
              href={`/business/listing/${listing.id}/edit`}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                {photoUrl && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={listing.restaurant_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg truncate">
                      {listing.restaurant_name}
                    </CardTitle>
                    <ListingStatusBadge status={listing.payment_status} />
                  </div>
                </CardHeader>
                <CardContent>
                  {listing.location_name && (
                    <p className="text-sm text-muted-foreground truncate">
                      {listing.location_name}
                    </p>
                  )}
                  {listing.payment_status === "draft" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Click to edit and get featured
                    </p>
                  )}
                  {listing.valid_until &&
                    listing.payment_status === "paid" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Featured until{" "}
                        {new Date(listing.valid_until).toLocaleDateString()}
                      </p>
                    )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
