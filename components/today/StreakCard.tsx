"use client";

import { NavIcon } from "@/components/NavIcon";

export function StreakCard({
  label,
  days,
  accent,
  icon,
  ready,
}: {
  label: string;
  days: number;
  accent: string;
  icon: string;
  ready: boolean;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 md:p-5">
      <div className="flex items-center justify-between">
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: `color-mix(in oklab, ${accent} 15%, transparent)`, color: accent }}
        >
          <NavIcon path={icon} className="h-4.5 w-4.5" />
        </span>
        {ready && days > 0 && (
          <span className="text-base" title="On a streak" aria-hidden="true">
            🔥
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tabular-nums" style={{ color: accent }}>
            {ready ? days : "—"}
          </span>
          <span className="text-sm text-muted">{days === 1 ? "day" : "days"}</span>
        </p>
        <p className="mt-0.5 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
