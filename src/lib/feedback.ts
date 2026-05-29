import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";
import type { FeedbackType } from "@/types/database";

const SATISFACTION_KEY = "feedback_last_satisfaction";
const SATISFACTION_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type SubmitFeedbackInput = {
  type: FeedbackType;
  message?: string;
  rating?: number;
  pagePath?: string;
  context?: Record<string, unknown>;
  screenshot?: File;
};

export async function submitFeedback(input: SubmitFeedbackInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let screenshot_path: string | null = null;

  if (input.screenshot) {
    const compressed = await compressImage(input.screenshot);
    const fileName = `${user.id}/${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("feedback-screenshots")
      .upload(fileName, compressed, { contentType: "image/jpeg" });

    if (uploadError) throw new Error(`Screenshot upload failed: ${uploadError.message}`);
    screenshot_path = fileName;
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: user.id,
    type: input.type,
    message: input.message || null,
    rating: input.rating || null,
    page_path: input.pagePath || null,
    context: input.context || {},
    screenshot_path,
  });

  if (error) throw new Error(error.message);
}

export function shouldShowSatisfaction(): boolean {
  if (typeof window === "undefined") return false;
  const last = localStorage.getItem(SATISFACTION_KEY);
  if (!last) return true;
  return Date.now() - Number(last) > SATISFACTION_INTERVAL_MS;
}

export function markSatisfactionShown(): void {
  localStorage.setItem(SATISFACTION_KEY, String(Date.now()));
}
