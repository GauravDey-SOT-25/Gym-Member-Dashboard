/* =============================================================================
   FloatingDock — bottom navigation present on every page.
   Owned by: [ROLE #2 - Navigation & Routing] + [ROLE #15 - Accessibility]
   [ROLE #14 - UI Animation] should add the hover lift / active scale here.
   ============================================================================= */
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BarChart3, CreditCard, Gift, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/data", label: "Data", icon: BarChart3 },
  { to: "/plan", label: "Plan", icon: CreditCard },
  { to: "/perks", label: "Perks", icon: Gift },
  { to: "/edit", label: "Edit", icon: Settings },
] as const;

export function FloatingDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-border bg-elevated/80 px-2 py-2 shadow-lg backdrop-blur-xl"
    >
      <ul className="flex items-center gap-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  active
                    ? "bg-brand text-brand-foreground shadow-[0_0_24px_var(--color-brand-glow)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
