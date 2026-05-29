import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let query = supabase
    .from("listings")
    .select("id, restaurant_name, location_name, photo_url, latitude, longitude")
    .eq("payment_status", "paid")
    .eq("is_featured", true)
    .limit(10);

  if (q && q.length >= 2) {
    query = query.ilike("restaurant_name", `%${q}%`);
  } else if (lat && lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }
    const delta = 0.05; // ~5km radius
    query = query
      .gte("latitude", latitude - delta)
      .lte("latitude", latitude + delta)
      .gte("longitude", longitude - delta)
      .lte("longitude", longitude + delta);
  } else {
    return NextResponse.json({ results: [] });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results: data || [] });
}
