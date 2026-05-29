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
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between border-b px-6 h-16">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <UtensilsCrossed className="h-5 w-5" />
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
                  "text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
}
