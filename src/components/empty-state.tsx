/* =============================================================================
   EmptyState / ErrorState — owned by [ROLE #16 - Error Handling & Empty States]
   ============================================================================= */
import { AlertTriangle, Inbox } from "lucide-react";

export function EmptyState({
  title = "Nothing here yet",
  message = "Data will appear once available.",
  icon: Icon = Inbox,
}: {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <Icon className="mb-3 h-8 w-8 text-muted-foreground" />
      <h3 className="font-display text-lg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-danger/40 bg-danger/5 p-8 text-center">
      <AlertTriangle className="mb-3 h-8 w-8 text-danger" />
      <p className="text-sm text-foreground">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
