import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleSlot } from "@/components/role-slot";
import { useRealtime } from "@/lib/realtime";
import { currentMember } from "@/lib/mock/members";
import { Award, Calendar, Coins, Dumbbell, Crown, CalendarPlus, Wallet, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — FitXperience" },
      { name: "description", content: "Your daily fitness momentum at a glance." },
    ],
  }),
  component: HomePage,
});

/* =============================================================================
   PAGE 1 of the blueprint — "Central Hub (Home)"
   Shows daily momentum, Quick-Glance Orbs, Upgrade banner, Quick Actions.
   ============================================================================= */
function HomePage() {
  const live = useRealtime();
  const m = currentMember;

  return (
    <AppShell title="Central Hub">
      {/* ===== Welcome — [ROLE #3 Dashboard Layout] ===== */}
      <RoleSlot role={3} name="Dashboard Layout Developer" area="Welcome Banner" status="done">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Good morning, {m.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ready to crush your fitness goals today?
        </p>
      </RoleSlot>

      {/* ===== Quick-Glance Orbs — [ROLE #4 Membership Cards] + [ROLE #5 Stats] ===== */}
      <h2 className="mt-10 mb-4 font-display text-xl">Quick-Glance Orbs</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <RoleSlot role={4} name="Membership Cards Developer" area="Plan Tier Orb" status="done">
          <Orb icon={<Crown className="h-5 w-5" />} label={`${m.plan} Plan Tier`} value={m.plan} />
        </RoleSlot>
        <RoleSlot role={5} name="Statistics Widgets Developer" area="Points Orb" status="done">
          <Orb icon={<Coins className="h-5 w-5" />} label="Reward Points" value={live.points.toLocaleString()} live />
        </RoleSlot>
        <RoleSlot role={5} name="Statistics Widgets Developer" area="Expiry Orb" status="done">
          <Orb icon={<Calendar className="h-5 w-5" />} label="Until Expiry" value={`${m.expiresInDays} days`} />
        </RoleSlot>
        <RoleSlot role={5} name="Statistics Widgets Developer" area="Sessions Orb" status="done">
          <Orb icon={<Dumbbell className="h-5 w-5" />} label="Sessions" value={String(live.sessions)} live />
        </RoleSlot>
      </div>

      {/* ===== Upgrade Banner ===== */}
      <RoleSlot
        role={4}
        name="Membership Cards Developer"
        area="Upgrade to Elite Banner"
        className="mt-8 bg-gradient-to-r from-brand/15 to-transparent"
        status="done"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg">Upgrade to Elite</h3>
            <p className="text-sm text-muted-foreground">Unlock premium perks and exclusive rewards.</p>
          </div>
          <button className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground">
            Explore Plans
          </button>
        </div>
      </RoleSlot>

      {/* ===== Quick Actions — [ROLE #14 Animations] should add hover lift ===== */}
      <h2 className="mt-10 mb-4 font-display text-xl">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <RoleSlot role={14} name="UI Animation & Transition Developer" area="Quick Book Action" status="done">
          <QuickAction icon={<CalendarPlus className="h-5 w-5" />} title="Quick Book" sub="Book a class or session" />
        </RoleSlot>
        <RoleSlot role={14} name="UI Animation & Transition Developer" area="Top-up Action" status="done">
          <QuickAction icon={<Wallet className="h-5 w-5" />} title="Top-up" sub="Add balance" />
        </RoleSlot>
        <RoleSlot role={14} name="UI Animation & Transition Developer" area="My Schedule Action" status="done">
          <QuickAction icon={<ClipboardList className="h-5 w-5" />} title="My Schedule" sub="View your bookings (JUL 17)" />
        </RoleSlot>
      </div>

      {/* ===== Cross-cutting workspaces visible on Home ===== */}
      <h2 className="mt-12 mb-4 font-display text-xl text-muted-foreground">
        Cross-cutting workspaces (visible on every page)
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <RoleSlot role={8} name="Real-Time Data Simulation" area="src/lib/realtime.ts">
          <p className="text-sm">
            Live tick #{live.tick} · HR {live.heartRate} bpm · {live.caloriesBurned} kcal.
            Hook lives in <code>src/lib/realtime.ts</code>.
          </p>
        </RoleSlot>
        <RoleSlot role={10} name="Loading States & Skeleton UI" area="src/components/skeletons.tsx">
          <p className="text-sm">
            Wire <code>CardSkeleton</code>, <code>ChartSkeleton</code>, <code>ListSkeleton</code>
            into every async section.
          </p>
        </RoleSlot>
        <RoleSlot role={15} name="Accessibility & UX" area="Keyboard nav, ARIA, focus rings">
          <p className="text-sm">Audit: dock keyboard order, color contrast, focus-visible rings.</p>
        </RoleSlot>
        <RoleSlot role={16} name="Error Handling & Empty States" area="src/components/empty-state.tsx">
          <p className="text-sm">
            Use <code>&lt;EmptyState/&gt;</code> and <code>&lt;ErrorState/&gt;</code> in every async slot.
          </p>
        </RoleSlot>
        <RoleSlot role={17} name="Frontend Testing & Integration" area="src/__tests__/">
          <p className="text-sm">Add Vitest specs per role; final cross-browser QA pass.</p>
        </RoleSlot>
        <RoleSlot role={18} name="Mock API & Data Architecture" area="src/lib/mock/*">
          <p className="text-sm">Shape datasets in <code>members.ts / analytics.ts / rewards.ts</code>.</p>
        </RoleSlot>
        <RoleSlot role={19} name="Backend Simulation & Integration" area="src/lib/mock/api.ts">
          <p className="text-sm">Fake async + delays; swap with real fetch when backend lands.</p>
        </RoleSlot>
        <RoleSlot role={1} name="Frontend Lead Developer" area="Architecture · code review · tokens">
          <p className="text-sm">Owns <code>src/styles.css</code> tokens & PR merges.</p>
        </RoleSlot>
      </div>
    </AppShell>
  );
}

function Orb({ icon, label, value, live }: { icon: React.ReactNode; label: string; value: string; live?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 text-brand">{icon}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-semibold">
        {value} {live ? <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-success" /> : null}
      </div>
    </div>
  );
}

function QuickAction({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button className="flex w-full items-center gap-4 text-left">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-elevated text-brand">{icon}</div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <Award className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
