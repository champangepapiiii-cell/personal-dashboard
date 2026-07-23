"use client";

import { Card } from "@/components/Card";
import { generateHabitSuggestions } from "@/lib/coach";
import { newId } from "@/lib/id";
import { useStore } from "@/lib/store-context";

export function HabitSuggestions() {
  const { data, hydrated, setHabits } = useStore();
  const suggestions = generateHabitSuggestions(data.profile);

  const existing = new Set(data.habits.map((h) => h.label.toLowerCase()));

  const add = (label: string) => {
    if (existing.has(label.toLowerCase())) return;
    setHabits([...data.habits, { id: newId("habit"), label, active: true }]);
  };

  return (
    <Card title="Suggested habits" subtitle="Tailored to your focus — add any with one tap">
      <div className="space-y-2">
        {suggestions.map((s) => {
          const added = existing.has(s.label.toLowerCase());
          return (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted">{s.rationale}</p>
              </div>
              <button
                type="button"
                onClick={() => add(s.label)}
                disabled={!hydrated || added}
                className={
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors " +
                  (added
                    ? "bg-surface-2 text-muted"
                    : "bg-coach text-white hover:opacity-90")
                }
              >
                {added ? "Added ✓" : "Add"}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
