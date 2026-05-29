import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentRequest } from "@/lib/bunq/payment-request";
import { z } from "zod";

const requestSchema = z.object({
  listingId: z.string().uuid(),
  amount: z.string(),
  currency: z.string().default("EUR"),
  contactEmail: z.string().email(),
  description: z.string(),
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

  const { listingId, amount, currency, contactEmail, description } = parsed.data;

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!listing || listing.payment_status !== "pending") {
    return NextResponse.json(
      { error: "Listing not found or already processed" },
      { status: 404 }
    );
  }

  try {
    const result = await createPaymentRequest({
      amount,
      currency,
      recipientEmail: contactEmail,
      description,
    });

    const requestId = result.Response?.[0]?.Id?.id?.toString();

    await supabase
      .from("listings")
      .update({
        payment_status: "requested",
        payment_request_id: requestId,
      })
      .eq("id", listingId);

    return NextResponse.json({ success: true, requestId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
