"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PaymentButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/bunq/create-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Payment request failed");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <Button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Get Featured"}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
