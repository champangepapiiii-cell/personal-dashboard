"use client";

// Monthly consistency per habit — % of the last 30 days completed, as a
// horizontal bar list.

import { Card } from "@/components/Card";
import { dayKeyDaysAgo } from "@/lib/dates";
import { useStore } from "@/lib/store-context";

const DAYS = 30;

export function HabitConsistency() {
  const { data, hydrated } = useStore();
  const habits = data.habits.filter((h) => h.active);

  const dayKeys = Array.from({ length: DAYS }, (_, i) => dayKeyDaysAgo(i));
  const done = new Set(
    data.habitEntries.filter((h) => h.completed).map((h) => `${h.habitId}|${h.date}`),
  );

  const rows = habits
    .map((h) => {
      const count = dayKeys.filter((key) => done.has(`${h.id}|${key}`)).length;
      return { id: h.id, label: h.label, count, pct: Math.round((count / DAYS) * 100) };
    })
    .sort((a, b) => b.pct - a.pct);

  return (
    <Card title="Consistency" subtitle="% of the last 30 days">
      {hydrated && rows.length === 0 ? (
        <p className="py-4 text-sm text-muted">No active habits yet.</p>
      ) : (
        <div className="space-y-3">
          {hydrated &&
            rows.map((r) => (
              <div key={r.id}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="truncate pr-2">{r.label}</span>
                  <span className="tabular-nums text-muted">
                    {r.pct}% <span className="text-xs">· {r.count}/{DAYS}</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${r.pct}%`, background: "var(--life)" }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}
