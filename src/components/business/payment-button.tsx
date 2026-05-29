"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const BETAALVERZOEK_URL = process.env.NEXT_PUBLIC_RABOBANK_BETAALVERZOEK_URL;

export function PaymentButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    setLoading(true);
    setError("");

    window.open(BETAALVERZOEK_URL, "_blank");

    const res = await fetch("/api/payment/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to activate listing");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <Button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Get Featured — €15"}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
