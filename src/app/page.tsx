import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <UtensilsCrossed className="h-16 w-16 mb-6 text-primary" />
      <h1 className="text-4xl font-bold mb-4">PolarSnacks</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Record every meal on your travels. Pin it on a map. Relive the flavors.
      </p>
      <Button asChild size="lg">
        <Link href="/login">Get Started</Link>
      </Button>
    </div>
  );
}
