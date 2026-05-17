import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RoleSlot } from "@/components/role-slot";
import { facilityHeatmap, type Range } from "@/lib/mock/analytics";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Data — FitXperience" },
      { name: "description", content: "Facility load mapping and personal biometric performance." },
    ],
  }),
  component: DataPage,
});

/* =============================================================================
   PAGE 2 of the blueprint — "Sensory Analytics (Data)"
   ============================================================================= */
function DataPage() {
  const [range, setRange] = useState<Range>("weekly");

  return (
    <AppShell title="Sensory Analytics">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Performance & Facility Insights</h1>
          <p className="mt-1 text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-success" /> Live
          </p>
        </div>

        {/* ===== [ROLE #9 Dataset Toggle] ===== */}
        <RoleSlot role={9} name="Dataset Toggle & State Management" area="Range switcher" status="done">
          <div className="flex gap-1 rounded-full bg-elevated p-1">
            {(["weekly", "monthly", "yearly"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition " +
                  (range === r ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground")
                }
              >
                {r}
              </button>
            ))}
          </div>
        </RoleSlot>
      </div>

      {/* ===== Interactive Facility Heatmap ===== */}
      <RoleSlot
        role={7}
        name="Doughnut / Pie Chart Developer"
        area="Facility Heatmap (extend with Chart.js / D3)"
        className="mt-6"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facilityHeatmap.map((z) => {
            const tone =
              z.load === "high"
                ? "bg-danger/20 text-danger border-danger/40"
                : z.load === "medium"
                ? "bg-warning/20 text-warning border-warning/40"
                : "bg-success/20 text-success border-success/40";
            return (
              <div key={z.zone} className={`rounded-xl border p-4 ${tone}`}>
                <div className="text-xs uppercase tracking-widest opacity-80">{z.zone}</div>
                <div className="mt-1 text-lg font-semibold capitalize">{z.load}</div>
              </div>
            );
          })}
        </div>
      </RoleSlot>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* ===== [ROLE #6 Line Chart] Activity Intensity (smooth spline) ===== */}
        <RoleSlot role={6} name="Line Chart Developer" area={`Activity Intensity (${range})`}>
          <p className="text-sm text-muted-foreground">
            Replace this with a smooth spline chart (Chart.js / recharts).
            Data source: <code>api.getActivity('{range}')</code>.
          </p>
          <div className="mt-4 grid h-56 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            📈 Line chart placeholder
          </div>
        </RoleSlot>

        {/* ===== [ROLE #7 Doughnut / Radar] Muscle Group Radar ===== */}
        <RoleSlot role={7} name="Doughnut / Pie Chart Developer" area="Muscle Group Radar">
          <p className="text-sm text-muted-foreground">
            Replace with radar/spider chart. Data: <code>api.getMuscleGroups()</code>.
          </p>
          <div className="mt-4 grid h-56 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            🕸 Radar chart placeholder
          </div>
        </RoleSlot>
      </div>

      {/* ===== Supporting role workspaces visible on Data ===== */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <RoleSlot role={10} name="Loading States & Skeleton UI" area="Skeletons for the two charts">
          <p className="text-sm">
            Show <code>&lt;ChartSkeleton/&gt;</code> while the API resolves.
          </p>
        </RoleSlot>
        <RoleSlot role={16} name="Error Handling & Empty States" area="Empty-zone fallback">
          <p className="text-sm">
            Show <code>&lt;EmptyState/&gt;</code> when no workouts in selected range.
          </p>
        </RoleSlot>
        <RoleSlot role={13} name="Responsive Design Developer" area="Grid collapses to 1 col on mobile">
          <p className="text-sm">Verify the heatmap + 2 chart cards on 360px viewport.</p>
        </RoleSlot>
        <RoleSlot role={18} name="Mock API & Data Architecture" area="src/lib/mock/analytics.ts">
          <p className="text-sm">Owns <code>activitySeries / muscleGroups / facilityHeatmap</code>.</p>
        </RoleSlot>
      </div>
    </AppShell>
  );
}
