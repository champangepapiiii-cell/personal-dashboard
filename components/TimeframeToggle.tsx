"use client";

import { TIMEFRAMES, useTimeframe } from "@/lib/timeframe";

export function TimeframeToggle() {
  const { timeframe, setTimeframe } = useTimeframe();

  return (
    <div className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5 text-xs font-medium">
      {TIMEFRAMES.map((t) => {
        const active = t === timeframe;
        return (
          <button
            key={t}
            type="button"
            onClick={() => setTimeframe(t)}
            aria-pressed={active}
            className={
              "rounded-md px-2.5 py-1.5 transition-colors " +
              (active
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground")
            }
          >
            <span className="hidden sm:inline">{t}</span>
            <span className="sm:hidden">{t[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
