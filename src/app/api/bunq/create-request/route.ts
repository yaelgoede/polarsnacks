import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentRequest } from "@/lib/bunq/payment-request";
import { z } from "zod";

const FEATURE_PRICE_CENTS = parseInt(
  process.env.LISTING_FEATURE_PRICE_CENTS || "1500"
);
const FEATURE_CURRENCY = process.env.LISTING_FEATURE_CURRENCY || "EUR";

const requestSchema = z.object({
  listingId: z.string().uuid(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { listingId } = parsed.data;

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return NextResponse.json(
      { error: "Listing not found" },
      { status: 404 }
    );
  }

  if (listing.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Not authorized to manage this listing" },
      { status: 403 }
    );
  }

  if (listing.payment_status !== "draft" && listing.payment_status !== "pending") {
    return NextResponse.json(
      { error: "Listing already processed" },
      { status: 400 }
    );
  }

  const amount = (FEATURE_PRICE_CENTS / 100).toFixed(2);

  try {
    const result = await createPaymentRequest({
      amount,
      currency: FEATURE_CURRENCY,
      recipientEmail: listing.contact_email,
      description: `PolarSnacks Featured Listing: ${listing.restaurant_name}`,
    });

    const requestId = result.Response?.[0]?.Id?.id?.toString();

    await supabase
      .from("listings")
      .update({
        payment_status: "requested",
        payment_request_id: requestId,
        amount_cents: FEATURE_PRICE_CENTS,
        currency: FEATURE_CURRENCY,
      })
      .eq("id", listingId);

    return NextResponse.json({ success: true, requestId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
