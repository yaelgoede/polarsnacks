"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FeedbackForm } from "./feedback-form";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-20 right-4 z-40 h-11 w-11 rounded-full shadow-lg md:bottom-6 md:right-6"
          />
        }
      >
        <MessageSquarePlus className="h-5 w-5" />
        <span className="sr-only">Send feedback</span>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Send Feedback</SheetTitle>
          <SheetDescription>
            Found a bug or have an idea? Let us know.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <FeedbackForm onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
