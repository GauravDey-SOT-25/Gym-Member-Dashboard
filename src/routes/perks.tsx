import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleSlot } from "@/components/role-slot";
import { rewards, recentPoints, nextTier } from "@/lib/mock/rewards";
import { currentMember } from "@/lib/mock/members";
import { Sparkles, Lock, Check, Star } from "lucide-react";

export const Route = createFileRoute("/perks")({
  head: () => ({
    meta: [
      { title: "Perks — FitXperience" },
      { name: "description", content: "Your rewards journey: unlocked perks and points history." },
    ],
  }),
  component: PerksPage,
});

/* =============================================================================
   PAGE 4 of the blueprint — "Rewards Odyssey (Perks)"
   ============================================================================= */
function PerksPage() {
  const pts = currentMember.points;
  const progress = Math.min(100, Math.round((pts / nextTier.at) * 100));

  return (
    <AppShell title="Rewards Odyssey">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Your Rewards Journey</h1>
          <p className="mt-1 text-muted-foreground">Track your progress, unlock perks and earn rewards.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2">
          <Star className="h-4 w-4 text-brand" />
          <span className="font-display text-xl font-bold">{pts.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">pts</span>
        </div>
      </div>

      {/* ===== [ROLE #6 Line Chart] reused as progress path ===== */}
      <RoleSlot role={6} name="Line Chart Developer" area="Progress Path (gauge/line)" className="mt-6" status="done">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Current · {pts}</span>
          <span>Next Tier · {nextTier.at}</span>
        </div>
        <div className="h-3 w-full rounded-full bg-elevated">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-brand to-brand-glow shadow-[0_0_20px_var(--color-brand-glow)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {nextTier.at - pts} pts to reach <span className="text-foreground">{nextTier.name}</span>.
        </p>
      </RoleSlot>

      {/* ===== [ROLE #4 Membership Cards] Reward tiles ===== */}
      <h2 className="mt-8 mb-3 font-display text-xl">Available Perks</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {rewards.map((r) => (
          <RoleSlot
            key={r.id}
            role={4}
            name="Membership Cards Developer"
            area={`Reward tile: ${r.title}`}
            status="done"
          >
            <RewardTile reward={r} />
          </RoleSlot>
        ))}
      </div>

      {/* ===== [ROLE #5 Statistics] Recent Points Activity ===== */}
      <RoleSlot
        role={5}
        name="Statistics Widgets Developer"
        area="Recent Points Activity"
        className="mt-6"
        status="done"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg">Recent Points Activity</h3>
          <a className="text-sm font-semibold text-brand" href="#">View All History →</a>
        </div>
        <ul className="divide-y divide-border">
          {recentPoints.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium">{p.reason}</div>
                <div className="text-xs text-muted-foreground">{p.when}</div>
              </div>
              <span className="font-display text-lg font-semibold text-brand">+{p.amount} pts</span>
            </li>
          ))}
        </ul>
      </RoleSlot>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <RoleSlot role={14} name="UI Animation & Transition" area="Reward unlock celebration">
          <p className="text-sm">On unlock: confetti + scale spring. Use Framer Motion.</p>
        </RoleSlot>
        <RoleSlot role={9} name="Dataset Toggle & State" area="Filter by month/all">
          <p className="text-sm">Add a filter to the points activity list.</p>
        </RoleSlot>
        <RoleSlot role={18} name="Mock API & Data Architecture" area="src/lib/mock/rewards.ts">
          <p className="text-sm">Owns rewards + recentPoints + nextTier.</p>
        </RoleSlot>
        <RoleSlot role={15} name="Accessibility & UX" area="Locked tiles must announce locked state">
          <p className="text-sm">Use <code>aria-disabled</code> + visible lock icon.</p>
        </RoleSlot>
      </div>
    </AppShell>
  );
}

function RewardTile({ reward }: { reward: (typeof rewards)[number] }) {
  const Icon =
    reward.status === "unlocked" ? Check : reward.status === "active" ? Sparkles : Lock;
  const tone =
    reward.status === "unlocked"
      ? "text-success"
      : reward.status === "active"
      ? "text-warning"
      : "text-muted-foreground";
  return (
    <div className={reward.status === "locked" ? "opacity-60" : ""}>
      <div className={`mb-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest ${tone}`}>
        <Icon className="h-3.5 w-3.5" /> {reward.status}
      </div>
      <h4 className="font-display text-lg">{reward.title}</h4>
      <p className="text-sm text-muted-foreground">{reward.subtitle}</p>
      <p className="mt-2 text-xs text-muted-foreground">{reward.hint}</p>
    </div>
  );
}
