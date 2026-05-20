/* =============================================================================
   <RoleSlot/> — Visible workspace marker for every team member.
   Owned by: [ROLE #1 - Frontend Lead]
   Every page wraps a developer's block with <RoleSlot/> so the dashboard
   visibly shows "this empty card belongs to ROLE #N, replace me".
   ============================================================================= */
import { cn } from "@/lib/utils";

type Props = {
  role: number;
  name: string;
  area: string;
  children?: React.ReactNode;
  className?: string;
  /** dashed=placeholder (default), solid=implemented */
  status?: "todo" | "done";
};

export function RoleSlot({ role, name, area, children, className, status = "todo" }: Props) {
  const done = status === "done";
  return (
    <section
      data-role={role}
      data-area={area}
      className={cn(
        "relative rounded-2xl bg-card p-5 transition-colors",
        done
          ? "border border-border"
          : "border-2 border-dashed border-border hover:border-brand/60",
        className,
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider",
              done ? "bg-success/20 text-success" : "bg-brand text-brand-foreground",
            )}
          >
            ROLE #{role}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{name}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {area}
        </span>
      </header>
      {children ?? (
        <p className="text-sm text-muted-foreground">
          Workspace for <span className="text-foreground">{name}</span>. Replace this slot
          with your implementation — see <code>README.md</code>.
        </p>
      )}
    </section>
  );
}
