/* =============================================================================
   AppShell — page chrome shared by every route.
   Owned by: [ROLE #3 - Dashboard Layout]
   - [ROLE #11] theme toggle in topbar
   - [ROLE #13] responsive padding / safe-area
   - [ROLE #15] aria landmarks (header/main/nav)
   ============================================================================= */
import { Link } from "@tanstack/react-router";
import { Bell, Moon, Sun } from "lucide-react";
import { FloatingDock } from "./floating-dock";
import { useTheme } from "./theme-provider";

export function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const { resolved, setMode } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ============ TOPBAR — [ROLE #3] + [ROLE #11] ============ */}
      <header
        role="banner"
        className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-8"
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-foreground font-display font-bold">
            F
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            FitXperience
          </span>
          {title ? (
            <span className="ml-3 hidden text-sm text-muted-foreground sm:inline">
              / {title}
            </span>
          ) : null}
        </Link>

        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-elevated text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">
              3
            </span>
          </button>
          <button
            aria-label="Toggle theme"
            onClick={() => setMode(resolved === "dark" ? "light" : "dark")}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-elevated text-muted-foreground hover:text-foreground"
          >
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand font-display font-bold text-brand-foreground">
            A
          </div>
        </div>
      </header>

      {/* ============ MAIN — [ROLE #13 Responsive] ============ */}
      <main role="main" className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 sm:px-8 sm:pt-10">
        {children}
      </main>

      {/* ============ DOCK — [ROLE #2 Nav] ============ */}
      <FloatingDock />
    </div>
  );
}
