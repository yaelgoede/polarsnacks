import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListingForm } from "@/components/business/listing-form";

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards">
      <h1 className="text-2xl font-bold mb-6">Add Listing</h1>
      <ListingForm />
    </div>
  );
}
