"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/meals/rating-stars";
import { submitFeedback, markSatisfactionShown } from "@/lib/feedback";

type SatisfactionPromptProps = {
  onDismiss: () => void;
};

export function SatisfactionPrompt({ onDismiss }: SatisfactionPromptProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleDismiss() {
    markSatisfactionShown();
    onDismiss();
  }

  async function handleSubmit() {
    if (!rating) return;
    setLoading(true);
    try {
      await submitFeedback({
        type: "satisfaction",
        rating,
        message: message.trim() || undefined,
      });
      markSatisfactionShown();
      toast.success("Thanks for your feedback!");
      onDismiss();
    } catch {
      toast.error("Failed to submit — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-semibold text-center">
          How are you enjoying PolarSnacks?
        </h2>
        <div className="flex justify-center">
          <RatingStars value={rating} onChange={setRating} />
        </div>
        {rating > 0 && (
          <Textarea
            placeholder="Anything we could do better? (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={handleDismiss}
            className="flex-1"
          >
            Not now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!rating || loading}
            className="flex-1"
          >
            {loading ? "Sending..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
