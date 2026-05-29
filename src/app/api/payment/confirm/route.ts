import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const requestSchema = z.object({
  listingId: z.string().uuid(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    .eq("owner_id", user.id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.payment_status !== "draft") {
    return NextResponse.json(
      { error: "Listing already processed" },
      { status: 400 }
    );
  }

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  await supabase
    .from("listings")
    .update({
      payment_status: "paid",
      is_featured: true,
      valid_until: validUntil.toISOString().split("T")[0],
    })
    .eq("id", listingId);

  return NextResponse.json({ success: true });
}
