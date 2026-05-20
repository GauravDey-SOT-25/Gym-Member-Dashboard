import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleSlot } from "@/components/role-slot";
import { currentMember, upcomingBookings, transactions } from "@/lib/mock/members";
import { Download, QrCode } from "lucide-react";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan — FitXperience" },
      { name: "description", content: "Digital member card, bookings, and billing timeline." },
    ],
  }),
  component: PlanPage,
});

/* =============================================================================
   PAGE 3 of the blueprint — "Membership Boutique (Plan)"
   ============================================================================= */
function PlanPage() {
  const m = currentMember;

  return (
    <AppShell title="Membership Boutique">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Membership & Bookings</h1>
          <p className="mt-1 text-muted-foreground">Manage your membership, bookings and billing seamlessly.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2 text-sm font-medium">
          <Download className="h-4 w-4" /> PDF Statement
        </button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {/* ===== [ROLE #4 Membership Cards] Digital member card ===== */}
        <RoleSlot
          role={4}
          name="Membership Cards Developer"
          area="Digital Member Card"
          className="lg:col-span-1"
          status="done"
        >
          <div className="rounded-2xl bg-gradient-to-br from-brand/30 via-brand/10 to-transparent p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{m.plan} Elite</div>
            <div className="mt-1 font-display text-2xl font-bold">{m.name}</div>
            <div className="mt-4 text-xs text-muted-foreground">ID: #{m.id}</div>
            <div className="text-xs text-muted-foreground">Member since {m.memberSince}</div>
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-elevated p-3">
              <QrCode className="h-10 w-10" />
              <div className="text-xs">Scan to check-in</div>
            </div>
          </div>
        </RoleSlot>

        {/* ===== [ROLE #12 Settings Panel] reused for Upcoming Flow list ===== */}
        <RoleSlot
          role={4}
          name="Membership Cards Developer"
          area="Upcoming Flow (next bookings)"
          className="lg:col-span-2"
          status="done"
        >
          <h3 className="mb-3 font-display text-lg">Upcoming Flow</h3>
          <ul className="divide-y divide-border">
            {upcomingBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{b.title}</div>
                  <div className="text-xs text-muted-foreground">{b.when}</div>
                </div>
                <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">{b.tag}</span>
              </li>
            ))}
          </ul>
          <a className="mt-3 inline-block text-sm font-semibold text-brand" href="#">
            View All Bookings →
          </a>
        </RoleSlot>
      </div>

      {/* ===== [ROLE #5 Statistics Widgets] Billing Liquid-Timeline (as table) ===== */}
      <RoleSlot
        role={5}
        name="Statistics Widgets Developer"
        area="Billing Liquid-Timeline"
        className="mt-6"
        status="done"
      >
        <h3 className="mb-3 font-display text-lg">Billing Liquid-Timeline</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Details</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="py-3">{t.date}</td>
                  <td className="py-3">${t.amount.toFixed(2)}</td>
                  <td className="py-3">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-semibold " +
                        (t.status === "Paid"
                          ? "bg-success/20 text-success"
                          : t.status === "Pending"
                          ? "bg-warning/20 text-warning"
                          : "bg-muted text-muted-foreground")
                      }
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{t.detail}</td>
                  <td className="py-3 text-right">
                    {t.status === "Paid" ? (
                      <button className="text-brand">Receipt ↓</button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RoleSlot>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <RoleSlot role={14} name="UI Animation & Transition" area="Liquid timeline animation">
          <p className="text-sm">Animate timeline bar fill on scroll-in (Framer Motion).</p>
        </RoleSlot>
        <RoleSlot role={16} name="Error Handling & Empty States" area="No transactions fallback">
          <p className="text-sm">Show <code>&lt;EmptyState/&gt;</code> when transaction list is empty.</p>
        </RoleSlot>
        <RoleSlot role={13} name="Responsive Design Developer" area="Card stacks above table on mobile">
          <p className="text-sm">Verify the 3-column hero collapses gracefully.</p>
        </RoleSlot>
        <RoleSlot role={18} name="Mock API & Data Architecture" area="src/lib/mock/members.ts">
          <p className="text-sm">Owns the Member / Booking / Transaction shapes.</p>
        </RoleSlot>
      </div>
    </AppShell>
  );
}
