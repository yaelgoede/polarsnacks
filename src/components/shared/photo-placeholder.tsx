import { Map, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

type PhotoPlaceholderProps = {
  variant: "trip" | "meal";
  seed?: string;
  className?: string;
};

function seedToHue(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 40) + 40) % 40 + 35;
}

export function PhotoPlaceholder({ variant, seed = "", className }: PhotoPlaceholderProps) {
  const hue = seedToHue(seed);
  const Icon = variant === "trip" ? Map : UtensilsCrossed;

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/30 to-secondary/20",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, oklch(0.85 0.06 ${hue}), oklch(0.92 0.04 ${hue + 40}))`,
      }}
    >
      <Icon className="h-10 w-10 text-muted-foreground/40" />
    </div>
  );
}
