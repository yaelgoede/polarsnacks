"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/lib/feedback";
import type { FeedbackType } from "@/types/database";
import { ImagePlus, X } from "lucide-react";

const TYPES: { value: Exclude<FeedbackType, "satisfaction">; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "idea", label: "Idea" },
  { value: "other", label: "Other" },
];

type FeedbackFormProps = {
  onSuccess?: () => void;
};

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const pathname = usePathname();
  const [type, setType] = useState<Exclude<FeedbackType, "satisfaction">>("idea");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await submitFeedback({
        type,
        message: message.trim(),
        pagePath: pathname,
        screenshot: screenshot ?? undefined,
      });
      toast.success("Thanks for your feedback!");
      setMessage("");
      setScreenshot(null);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                type === t.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent hover:border-border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback-message">Message</Label>
        <Textarea
          id="feedback-message"
          placeholder={
            type === "bug"
              ? "What went wrong? What did you expect?"
              : type === "idea"
                ? "What feature or improvement would you like?"
                : "Tell us anything..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Screenshot (optional)</Label>
        {screenshot ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">{screenshot.name}</span>
            <button
              type="button"
              onClick={() => setScreenshot(null)}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ImagePlus className="h-4 w-4" />
            <span>Attach image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <Button type="submit" disabled={loading || !message.trim()} className="w-full">
        {loading ? "Sending..." : "Send Feedback"}
      </Button>
    </form>
  );
}
