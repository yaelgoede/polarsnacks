import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-background via-accent/30 to-background">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30 mx-auto">
          <UtensilsCrossed className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4">PolarSnacks</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Record every meal on your travels. Pin it on a map. Relive the flavors.
        </p>
        <Button asChild size="lg" className="shadow-md">
          <Link href="/login">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
