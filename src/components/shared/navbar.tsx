"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Store, LogOut, UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Trips", icon: Map },
  { href: "/listings", label: "Restaurants", icon: Store },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/50 md:hidden">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground rounded-xl transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop top nav */}
      <header
        className={cn(
          "hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-6 h-16 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <span className={cn("transition-opacity duration-200", scrolled ? "opacity-100" : "opacity-70")}>
            PolarSnacks
          </span>
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
                    "absolute -bottom-[1.19rem] left-0 right-0 h-0.5 bg-primary transition-transform duration-200 origin-left rounded-full",
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
