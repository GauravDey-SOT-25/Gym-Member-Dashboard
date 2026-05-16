import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

/* =========================================================================
   GYM MEMBER DASHBOARD — BASIC LAYOUT SCAFFOLD
   -------------------------------------------------------------------------
   Each section below is annotated with [ROLE #N - Role Name] so individual
   developers know exactly which block they own. Replace placeholders with
   real implementations. Do NOT change the section IDs or role tags without
   coordinating with the Frontend Lead (Role #1).
   ========================================================================= */

// Design tokens from the blueprint (Role #1 / Role #11 own these)
const T = {
  accent: "#D9FF00",
  bg: "#000000",
  surface: "#1A1A1A",
  elevated: "#222222",
  border: "#333333",
  text: "#FFFFFF",
  textMuted: "#8A8A8A",
  textSecondary: "#CFCFCF",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

type TabKey = "overview" | "analytics" | "settings";

function Dashboard() {
  // [ROLE #2 - Navigation & Routing] tab state
  const [tab, setTab] = useState<TabKey>("overview");
  // [ROLE #11 - Theme & Dark Mode]
  const [dark, setDark] = useState(true);
  // [ROLE #9 - Dataset Toggle & State Management]
  const [range, setRange] = useState<"weekly" | "monthly" | "yearly">("weekly");
  // [ROLE #8 - Real-Time Data Simulation]
  const [rewards, setRewards] = useState(1240);
  const [sessions, setSessions] = useState(38);
  useEffect(() => {
    const id = setInterval(() => {
      setRewards((r) => r + Math.floor(Math.random() * 5));
      setSessions((s) => s + (Math.random() > 0.85 ? 1 : 0));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const theme = dark ? T : { ...T, bg: "#FFFFFF", surface: "#F5F5F5", elevated: "#FFFFFF", text: "#111", border: "#E5E5E5" };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "Manrope, system-ui, sans-serif",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
      }}
    >
      {/* ================================================================
          [ROLE #3 - Dashboard Layout] SIDEBAR
          [ROLE #2 - Navigation & Routing] active tab handling
         ================================================================ */}
      <aside
        style={{
          background: theme.surface,
          borderRight: `1px solid ${theme.border}`,
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ fontFamily: "Lexend, sans-serif", fontSize: 22, fontWeight: 600, marginBottom: 32 }}>
          <span style={{ color: theme.accent }}>●</span> FitPulse
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { k: "overview", label: "Overview" },
            { k: "analytics", label: "Analytics" },
            { k: "settings", label: "Settings" },
          ].map((item) => (
            <button
              key={item.k}
              onClick={() => setTab(item.k as TabKey)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: tab === item.k ? theme.elevated : "transparent",
                color: tab === item.k ? theme.accent : theme.textSecondary,
                fontWeight: tab === item.k ? 600 : 400,
                transition: "all 200ms ease",
              }}
            >
              {item.label}
            </button>
          ))}
          {["Membership", "Rewards", "Logout"].map((l) => (
            <button
              key={l}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 12,
                border: "none",
                background: "transparent",
                color: theme.textMuted,
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN COLUMN */}
      <main style={{ display: "flex", flexDirection: "column" }}>
        {/* ============================================================
            [ROLE #3 - Dashboard Layout] TOP NAVIGATION
            [ROLE #11 - Theme & Dark Mode] theme toggle lives here
           ============================================================ */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 32px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.bg,
          }}
        >
          <input
            placeholder="Search members, sessions, rewards…"
            style={{
              background: theme.elevated,
              border: `1px solid ${theme.border}`,
              borderRadius: 80,
              padding: "12px 18px",
              color: theme.text,
              width: 380,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setDark((d) => !d)}
              style={{
                background: theme.elevated,
                border: `1px solid ${theme.border}`,
                color: theme.text,
                borderRadius: 80,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {dark ? "☾ Dark" : "☀ Light"}
            </button>
            <div style={{ color: theme.textMuted }}>🔔</div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: theme.accent,
                color: "#000",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section style={{ padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>
          {tab === "overview" && (
            <OverviewTab theme={theme} rewards={rewards} sessions={sessions} />
          )}
          {tab === "analytics" && (
            <AnalyticsTab theme={theme} range={range} setRange={setRange} />
          )}
          {tab === "settings" && <SettingsTab theme={theme} dark={dark} setDark={setDark} />}
        </section>
      </main>
    </div>
  );
}

/* ==========================================================================
   OVERVIEW TAB
   [ROLE #4 - Membership Cards] + [ROLE #5 - Statistics Widgets]
   ========================================================================== */
function OverviewTab({ theme, rewards, sessions }: { theme: typeof T; rewards: number; sessions: number }) {
  return (
    <>
      {/* Welcome banner — [ROLE #3 - Dashboard Layout] */}
      <div>
        <h1 style={{ fontFamily: "Lexend, sans-serif", fontSize: 40, fontWeight: 500, margin: 0 }}>
          Welcome back, Alex 👋
        </h1>
        <p style={{ color: theme.textMuted, marginTop: 8 }}>
          Here's a snapshot of your fitness activity today.
        </p>
      </div>

      {/* [ROLE #4 - Membership Cards Developer] ===========================
          Build reusable <MembershipCard /> here. Currently placeholders. */}
      <div
        data-section="membership-cards"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}
      >
        <Card theme={theme} title="Active Plan" value="Premium" sub="Renews Dec 30, 2026" accent={theme.accent} />
        <Card theme={theme} title="Total Sessions" value={String(sessions)} sub="this month" accent={theme.blue} />
        <Card theme={theme} title="Reward Points" value={rewards.toLocaleString()} sub="↑ live updating" accent={theme.purple} />
        <Card theme={theme} title="Membership" value="Active" sub="Expires in 42 days" accent={theme.success} />
      </div>

      {/* [ROLE #5 - Statistics Widgets Developer] ========================= */}
      <div
        data-section="stats-widgets"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24 }}
      >
        <Stat theme={theme} label="Weekly activity" value="87%" />
        <Stat theme={theme} label="Calories burned" value="4,210" />
        <Stat theme={theme} label="Goal completion" value="72%" />
      </div>
    </>
  );
}

/* ==========================================================================
   ANALYTICS TAB
   [ROLE #6 - Line Chart], [ROLE #7 - Doughnut Chart],
   [ROLE #9 - Dataset Toggle], [ROLE #10 - Loading States]
   ========================================================================== */
function AnalyticsTab({
  theme,
  range,
  setRange,
}: {
  theme: typeof T;
  range: "weekly" | "monthly" | "yearly";
  setRange: (r: "weekly" | "monthly" | "yearly") => void;
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "Lexend, sans-serif", fontSize: 32, margin: 0 }}>Analytics</h2>

        {/* [ROLE #9 - Dataset Toggle & State Management] */}
        <div data-section="dataset-toggle" style={{ display: "flex", gap: 4, background: theme.elevated, padding: 4, borderRadius: 80 }}>
          {(["weekly", "monthly", "yearly"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "8px 18px",
                borderRadius: 80,
                border: "none",
                cursor: "pointer",
                background: range === r ? theme.accent : "transparent",
                color: range === r ? "#000" : theme.textSecondary,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* [ROLE #6 - Line Chart Developer] integrate Chart.js here */}
        <ChartPlaceholder theme={theme} title={`Activity Trends (${range})`} kind="line" role="ROLE #6" />
        {/* [ROLE #7 - Doughnut / Pie Chart Developer] */}
        <ChartPlaceholder theme={theme} title="Membership Usage" kind="doughnut" role="ROLE #7" />
      </div>
    </>
  );
}

/* ==========================================================================
   SETTINGS TAB
   [ROLE #12 - Settings Panel] + [ROLE #11 - Theme]
   ========================================================================== */
function SettingsTab({ theme, dark, setDark }: { theme: typeof T; dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <>
      <h2 style={{ fontFamily: "Lexend, sans-serif", fontSize: 32, margin: 0 }}>Settings</h2>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <Panel theme={theme} title="Profile">
          <Row theme={theme} label="Name" value="Alex Carter" />
          <Row theme={theme} label="Email" value="alex@fitpulse.io" />
          <Row theme={theme} label="Plan" value="Premium" />
        </Panel>

        <Panel theme={theme} title="Notifications">
          <Toggle theme={theme} label="Workout reminders" defaultChecked />
          <Toggle theme={theme} label="Reward updates" defaultChecked />
          <Toggle theme={theme} label="Weekly summary email" />
        </Panel>

        <Panel theme={theme} title="Appearance">
          <Toggle theme={theme} label="Dark mode" checked={dark} onChange={setDark} />
        </Panel>
      </div>

      <button
        style={{
          alignSelf: "flex-start",
          background: theme.accent,
          color: "#000",
          border: "none",
          padding: "12px 28px",
          borderRadius: 80,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </>
  );
}

/* ==========================================================================
   REUSABLE PRIMITIVES — owned by [ROLE #1 - Frontend Lead]
   [ROLE #14 - UI Animation] should add transitions here
   [ROLE #16 - Error & Empty States] should add fallbacks here
   [ROLE #10 - Skeleton UI] should add <Skeleton/> variants here
   ========================================================================== */
function Card({ theme, title, value, sub, accent }: { theme: typeof T; title: string; value: string; sub: string; accent: string }) {
  return (
    <div
      style={{
        background: theme.elevated,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 24,
        transition: "transform 200ms ease, border-color 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = theme.border;
      }}
    >
      <div style={{ color: theme.textMuted, fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 600, marginTop: 8, color: accent }}>{value}</div>
      <div style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function Stat({ theme, label, value }: { theme: typeof T; label: string; value: string }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 12, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function ChartPlaceholder({ theme, title, kind, role }: { theme: typeof T; title: string; kind: "line" | "doughnut"; role: string }) {
  return (
    <div style={{ background: theme.elevated, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, minHeight: 320 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontFamily: "Lexend, sans-serif", fontSize: 18 }}>{title}</h3>
        <span style={{ fontSize: 11, color: theme.accent, border: `1px solid ${theme.border}`, padding: "4px 10px", borderRadius: 80 }}>
          {role}
        </span>
      </div>
      <div
        style={{
          height: 240,
          display: "grid",
          placeItems: "center",
          color: theme.textMuted,
          border: `1px dashed ${theme.border}`,
          borderRadius: 12,
        }}
      >
        {kind === "line" ? "📈 Line chart goes here (Chart.js)" : "🍩 Doughnut chart goes here (Chart.js)"}
      </div>
    </div>
  );
}

function Panel({ theme, title, children }: { theme: typeof T; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: theme.elevated, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24 }}>
      <h3 style={{ margin: "0 0 16px", fontFamily: "Lexend, sans-serif", fontSize: 20 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function Row({ theme, label, value }: { theme: typeof T; label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
      <span style={{ color: theme.textMuted }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Toggle({
  theme,
  label,
  checked,
  defaultChecked,
  onChange,
}: {
  theme: typeof T;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const value = checked ?? internal;
  const toggle = () => {
    const next = !value;
    if (onChange) onChange(next);
    else setInternal(next);
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>{label}</span>
      <button
        onClick={toggle}
        aria-pressed={value}
        style={{
          width: 44,
          height: 24,
          borderRadius: 20,
          border: `1px solid ${theme.border}`,
          background: value ? theme.accent : theme.surface,
          position: "relative",
          cursor: "pointer",
          transition: "background 200ms",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: value ? 22 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: value ? "#000" : "#fff",
            transition: "left 200ms",
          }}
        />
      </button>
    </div>
  );
}
