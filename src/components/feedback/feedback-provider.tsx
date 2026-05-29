"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { shouldShowSatisfaction } from "@/lib/feedback";
import { FeedbackButton } from "./feedback-button";
import { SatisfactionPrompt } from "./satisfaction-prompt";

export function FeedbackProvider() {
  const [showSatisfaction, setShowSatisfaction] = useState(false);

  useEffect(() => {
    if (!shouldShowSatisfaction()) return;

    const supabase = createClient();
    supabase
      .from("meals")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => {
        if (count && count >= 3) {
          setShowSatisfaction(true);
        }
      });
  }, []);

  return (
    <>
      <FeedbackButton />
      {showSatisfaction && (
        <SatisfactionPrompt onDismiss={() => setShowSatisfaction(false)} />
      )}
    </>
  );
}
