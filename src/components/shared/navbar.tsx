"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, UtensilsCrossed, Store, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Trips", icon: Map },
  { href: "/listings", label: "Restaurants", icon: Store },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 text-xs rounded-full transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-2 text-xs text-muted-foreground rounded-full transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between border-b px-6 h-16 bg-background/95 backdrop-blur-sm">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          PolarSnacks
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors py-1",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-[1.19rem] left-0 right-0 h-0.5 bg-primary transition-transform duration-200 origin-left",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
}
