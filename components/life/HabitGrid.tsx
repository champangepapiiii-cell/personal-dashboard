"use client";

// Habits as rows, the last 30 days as columns. Tap any cell to toggle that
// habit's completion for that day — writes straight to the store.

import { Card } from "@/components/Card";
import { dayKeyDaysAgo, MONTH_ABBR } from "@/lib/dates";
import { useStore } from "@/lib/store-context";

const DAYS = 30;

export function HabitGrid() {
  const { data, hydrated, setHabitCompletion } = useStore();
  const habits = data.habits.filter((h) => h.active);

  // Oldest → newest so the most recent day sits on the right.
  const dayKeys = Array.from({ length: DAYS }, (_, i) => dayKeyDaysAgo(DAYS - 1 - i));
  const done = new Set(
    data.habitEntries.filter((h) => h.completed).map((h) => `${h.habitId}|${h.date}`),
  );

  const label = (key: string) => {
    const [, m, d] = key.split("-");
    return `${Number(d)} ${MONTH_ABBR[Number(m) - 1]}`;
  };

  return (
    <Card title="Habit grid" subtitle="Last 30 days · tap any cell to toggle">
      {hydrated && habits.length === 0 ? (
        <p className="py-4 text-sm text-muted">No active habits. Add some below.</p>
      ) : (
        <div className="overflow-x-auto pb-1">
          <div className="min-w-max">
            {/* Column markers every 5 days */}
            <div className="mb-1 flex gap-1 pl-36">
              {dayKeys.map((key, i) => (
                <div key={key} className="w-5 text-center text-[9px] leading-none text-muted">
                  {i % 5 === 0 ? Number(key.split("-")[2]) : ""}
                </div>
              ))}
            </div>

            {hydrated &&
              habits.map((h) => (
                <div key={h.id} className="mb-1 flex items-center gap-1">
                  <div className="w-36 shrink-0 truncate pr-2 text-sm" title={h.label}>
                    {h.label}
                  </div>
                  {dayKeys.map((key) => {
                    const on = done.has(`${h.id}|${key}`);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setHabitCompletion(h.id, key, !on)}
                        title={`${h.label} · ${label(key)} · ${on ? "done" : "not done"}`}
                        aria-label={`${h.label} ${label(key)} ${on ? "done" : "not done"}`}
                        className="h-5 w-5 rounded-[4px] transition-colors hover:ring-2 hover:ring-life/40"
                        style={{ background: on ? "var(--life)" : "var(--surface-2)" }}
                      />
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
}
