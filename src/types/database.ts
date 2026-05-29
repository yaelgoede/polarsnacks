export type Trip = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  cover_photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack" | "drinks";

export type Meal = {
  id: string;
  trip_id: string;
  user_id: string;
  listing_id: string | null;
  photo_url: string | null;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  rating: number | null;
  notes: string | null;
  category: MealCategory | null;
  created_at: string;
  updated_at: string;
};

export type Listing = {
  id: string;
  restaurant_name: string;
  description: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  website_url: string | null;
  photo_url: string | null;
  is_featured: boolean;
  payment_status: "pending" | "requested" | "paid" | "expired";
  payment_request_id: string | null;
  amount_cents: number;
  currency: string;
  contact_email: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
};
