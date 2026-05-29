import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.json();

  // bunq sends notification objects with category and object data
  const notificationUrl = body?.NotificationUrl;
  if (!notificationUrl) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const category = notificationUrl.category;
  const objectData = notificationUrl.object;

  if (category !== "REQUEST") {
    return NextResponse.json({ received: true });
  }

  const requestInquiry = objectData?.RequestInquiry ?? objectData?.RequestResponse;
  if (!requestInquiry) {
    return NextResponse.json({ received: true });
  }

  const status = requestInquiry.status;
  const requestId = requestInquiry.id?.toString();

  if (!requestId) {
    return NextResponse.json({ received: true });
  }

  // Use service role client to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (status === "ACCEPTED") {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    await supabase
      .from("listings")
      .update({
        payment_status: "paid",
        is_featured: true,
        valid_until: validUntil.toISOString().split("T")[0],
      })
      .eq("payment_request_id", requestId);
  } else if (status === "REJECTED" || status === "EXPIRED") {
    await supabase
      .from("listings")
      .update({ payment_status: "expired" })
      .eq("payment_request_id", requestId);
  }

  return NextResponse.json({ received: true });
}
