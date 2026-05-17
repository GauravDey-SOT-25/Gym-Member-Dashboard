/* =============================================================================
   ThemeProvider — global dark/light toggle.
   Owned by: [ROLE #11 - Theme & Dark Mode]
   ============================================================================= */
import { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";
type Ctx = { mode: Mode; setMode: (m: Mode) => void; resolved: "light" | "dark" };

const ThemeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "fitx-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Mode | null;
    if (stored) setModeState(stored);
  }, []);

  const resolved: "light" | "dark" =
    mode === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  const setMode = (m: Mode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {}
  };

  return <ThemeCtx.Provider value={{ mode, setMode, resolved }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
