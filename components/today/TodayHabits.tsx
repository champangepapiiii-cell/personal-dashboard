"use client";

// Tappable habit checklist for today. Toggling a chip writes to the store and
// the weekly completion ring updates in real time.

import { dayKey } from "@/lib/dates";
import { useStore } from "@/lib/store-context";

export function TodayHabits() {
  const { data, hydrated, setHabitCompletion } = useStore();
  const today = dayKey();

  const active = data.habits.filter((h) => h.active);
  const doneToday = new Set(
    data.habitEntries
      .filter((h) => h.date === today && h.completed)
      .map((h) => h.habitId),
  );
  const doneCount = active.filter((h) => doneToday.has(h.id)).length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Today&rsquo;s habits</h2>
          <p className="text-xs text-muted">Tap to check off — the ring updates live</p>
        </div>
        {hydrated && (
          <span className="text-xs tabular-nums text-muted">
            {doneCount}/{active.length}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {active.map((h) => {
          const done = doneToday.has(h.id);
          return (
            <button
              key={h.id}
              type="button"
              disabled={!hydrated}
              onClick={() => setHabitCompletion(h.id, today, !done)}
              aria-pressed={done}
              className={
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all disabled:opacity-50 " +
                (done
                  ? "border-transparent text-accent-fg"
                  : "border-border text-foreground hover:border-accent")
              }
              style={done ? { background: "var(--accent)" } : undefined}
            >
              <span
                className={
                  "grid h-4 w-4 place-items-center rounded-full border text-[10px] " +
                  (done ? "border-transparent bg-black/15" : "border-muted text-transparent")
                }
                aria-hidden="true"
              >
                ✓
              </span>
              {h.label}
            </button>
          );
        })}
        {hydrated && active.length === 0 && (
          <p className="text-sm text-muted">No active habits yet.</p>
        )}
      </div>
    </div>
  );
}
