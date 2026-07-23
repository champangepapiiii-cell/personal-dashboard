// A written empty state — an icon, a real sentence, and an optional action.
// Deliberately never just "No data".

export function EmptyState({
  icon,
  title,
  message,
  action,
  compact = false,
}: {
  icon: string;
  title: string;
  message: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-1.5 text-center " +
        (compact ? "py-6" : "py-10")
      }
    >
      <div className="mb-1 grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-2xl" aria-hidden="true">
        {icon}
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="max-w-xs text-sm text-muted">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
