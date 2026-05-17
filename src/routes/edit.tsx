import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RoleSlot } from "@/components/role-slot";
import { useTheme } from "@/components/theme-provider";
import { currentMember } from "@/lib/mock/members";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/edit")({
  head: () => ({
    meta: [
      { title: "Edit — FitXperience" },
      { name: "description", content: "Configure profile, syncing, alerts, and theme." },
    ],
  }),
  component: EditPage,
});

/* =============================================================================
   PAGE 5 of the blueprint — "Personal Command (Edit)"
   ============================================================================= */
function EditPage() {
  const [apple, setApple] = useState(true);
  const [google, setGoogle] = useState(false);
  const [renewals, setRenewals] = useState(true);
  const [classes, setClasses] = useState(false);
  const [opacity, setOpacity] = useState(80);
  const { mode, setMode } = useTheme();

  return (
    <AppShell title="Personal Command">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Dashboard Configuration</h1>
          <p className="mt-1 text-muted-foreground">Customize your dashboard, preferences and system settings.</p>
        </div>
        <button className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground">
          Save Changes
        </button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* ===== [ROLE #12 Settings Panel] Profile ===== */}
        <RoleSlot role={12} name="Settings Panel Developer" area="Profile" status="done">
          <h3 className="mb-3 font-display text-lg">Profile</h3>
          <Row label="Name" value={currentMember.name} />
          <Row label="Email" value={currentMember.email} />
          <Row label="Plan" value={currentMember.plan} />
          <button className="mt-3 rounded-full border border-border px-4 py-2 text-sm">Edit Profile</button>
        </RoleSlot>

        {/* ===== [ROLE #12] Sync Settings ===== */}
        <RoleSlot role={12} name="Settings Panel Developer" area="Sync Settings" status="done">
          <h3 className="mb-3 font-display text-lg">Sync Settings</h3>
          <Toggle label="Apple Health" sub="Sync activity & health data" value={apple} onChange={setApple} />
          <Toggle label="Google Fit" sub="Sync workouts & steps" value={google} onChange={setGoogle} />
        </RoleSlot>

        {/* ===== [ROLE #12] Alerts ===== */}
        <RoleSlot role={12} name="Settings Panel Developer" area="Alerts & Notifications" status="done">
          <h3 className="mb-3 font-display text-lg">Alerts & Notifications</h3>
          <Toggle label="Membership Renewals" sub="Renewal reminders" value={renewals} onChange={setRenewals} />
          <Toggle label="Class Reminders" sub="Upcoming class notifications" value={classes} onChange={setClasses} />
        </RoleSlot>

        {/* ===== [ROLE #11 Theme] Appearance ===== */}
        <RoleSlot role={11} name="Theme & Dark Mode Developer" area="Theme & Display" status="done">
          <h3 className="mb-3 font-display text-lg">Theme & Display</h3>
          <div className="mb-4">
            <label className="text-sm text-muted-foreground">UI Opacity · {opacity}%</label>
            <input
              type="range"
              min={40}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              className="mt-2 w-full accent-[color:var(--color-brand)]"
            />
          </div>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-semibold capitalize " +
                  (mode === m ? "bg-brand text-brand-foreground" : "bg-elevated text-muted-foreground")
                }
              >
                {m}
              </button>
            ))}
          </div>
        </RoleSlot>
      </div>

      {/* ===== Danger Zone ===== */}
      <RoleSlot role={12} name="Settings Panel Developer" area="Danger Zone" className="mt-6 border-danger/40" status="done">
        <h3 className="mb-1 font-display text-lg text-danger">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Log out from all active sessions.</p>
        <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white">
          <LogOut className="h-4 w-4" /> Logout Now
        </button>
      </RoleSlot>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <RoleSlot role={15} name="Accessibility & UX" area="Form labels, switch ARIA roles">
          <p className="text-sm">Every toggle needs <code>role="switch"</code> + <code>aria-checked</code>.</p>
        </RoleSlot>
        <RoleSlot role={13} name="Responsive Design Developer" area="2-col grid → 1-col on mobile">
          <p className="text-sm">Verify settings cards stack below 768px.</p>
        </RoleSlot>
        <RoleSlot role={17} name="Frontend Testing & Integration" area="Test each toggle persistence">
          <p className="text-sm">Add Vitest specs for theme switcher persistence.</p>
        </RoleSlot>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Toggle({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={
          "relative h-6 w-11 rounded-full transition " + (value ? "bg-brand" : "bg-elevated border border-border")
        }
      >
        <span
          className={
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all " +
            (value ? "left-[22px]" : "left-0.5")
          }
        />
      </button>
    </div>
  );
}
