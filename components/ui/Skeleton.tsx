// Pulsing placeholder used while the store hydrates from localStorage.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={"animate-pulse rounded-lg bg-surface-2 " + className} aria-hidden="true" />;
}

/** A stack of skeleton lines — a reasonable stand-in for most loading content. */
export function SkeletonLines({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={"space-y-2.5 " + className} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded-md bg-surface-2"
          style={{ width: `${90 - i * 12}%` }}
        />
      ))}
    </div>
  );
}
