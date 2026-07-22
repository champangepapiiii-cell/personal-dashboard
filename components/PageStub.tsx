"use client";

// Placeholder body for a stubbed section. Confirms the data layer + timeframe
// context are live by echoing the current selection and a couple of counts.
// Real section UIs land in later phases.

import { useStore } from "@/lib/store-context";
import { useTimeframe } from "@/lib/timeframe";

interface Stat {
  label: string;
  value: string | number;
}

export function PageStub({
  title,
  accent,
  description,
  stats,
}: {
  title: string;
  accent: string;
  description: string;
  stats?: Stat[];
}) {
  const { timeframe } = useTimeframe();
  const { hydrated } = useStore();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ background: accent }} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: accent }}>
            {title}
          </h1>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted">
        <span className="rounded-full border border-border bg-surface px-2.5 py-1">
          Viewing: <span className="font-medium text-foreground">{timeframe}</span>
        </span>
        <span className="rounded-full border border-border bg-surface px-2.5 py-1">
          {hydrated ? "Data loaded" : "Loading…"}
        </span>
      </div>

      {stats && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted">{s.label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {hydrated ? s.value : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center text-sm text-muted">
        {title} section — full UI arrives in a later phase.
      </div>
    </div>
  );
}
