import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ListingForm } from "@/components/business/listing-form";
import { ListingStatusBadge } from "@/components/business/listing-status-badge";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/types/database";
import { PaymentButton } from "@/components/business/payment-button";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!listing) notFound();

  const typedListing = listing as Listing;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Listing</h1>
        <ListingStatusBadge status={typedListing.payment_status} />
      </div>

      <ListingForm listing={typedListing} />

      {typedListing.payment_status === "draft" && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h2 className="font-semibold mb-2">Get Featured</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Pay to feature your listing so travelers can discover and link their
            meals to your restaurant.
          </p>
          <PaymentButton listingId={typedListing.id} />
        </div>
      )}

      {typedListing.payment_status === "requested" && (
        <div className="mt-8 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/10">
          <h2 className="font-semibold mb-2">Payment Requested</h2>
          <p className="text-sm text-muted-foreground">
            A payment request has been sent to your email. Complete the payment
            to get your listing featured.
          </p>
        </div>
      )}
    </div>
  );
}
