"use client";

import { Card } from "@/components/Card";
import { MONTH_ABBR } from "@/lib/dates";
import { aed, savingsProjection } from "@/lib/money";
import { useStore } from "@/lib/store-context";

export function SavingsProgress() {
  const { data, hydrated } = useStore();
  const p = savingsProjection(data);

  const projected =
    p.date != null ? `${MONTH_ABBR[p.date.getMonth()]} ${p.date.getFullYear()}` : null;

  return (
    <Card
      title="Savings goal"
      subtitle={`Target ${aed(p.target)}`}
      right={
        hydrated ? (
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: "color-mix(in oklab, var(--money) 15%, transparent)", color: "var(--money)" }}
          >
            {p.pct}%
          </span>
        ) : null
      }
    >
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums">
          {hydrated ? aed(p.current) : "—"}
        </span>
        <span className="text-sm text-muted">of {aed(p.target)}</span>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: hydrated ? `${p.pct}%` : "0%", background: "var(--money)" }}
        />
      </div>

      <p className="mt-3 text-sm text-muted">
        {!hydrated ? (
          "Loading…"
        ) : p.reached ? (
          <span className="text-positive">Target reached — nice work.</span>
        ) : projected ? (
          <>
            On track to hit <span className="font-medium text-foreground">{aed(p.target)}</span> by{" "}
            <span className="font-medium text-foreground">{projected}</span>
            {p.monthsRemaining != null && (
              <> (~{p.monthsRemaining} month{p.monthsRemaining === 1 ? "" : "s"})</>
            )}{" "}
            at {aed(p.avgMonthly)}/mo.
          </>
        ) : (
          "Add some savings to project a hit date."
        )}
      </p>
    </Card>
  );
}
