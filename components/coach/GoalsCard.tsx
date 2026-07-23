"use client";

// Personal goals in the user's own words. Each is interpreted into an
// optimisation plan (area, steps, a habit to build). Add or remove anytime.

import { useState } from "react";
import { Card } from "@/components/Card";
import { inferAreas, interpretGoal } from "@/lib/coach";
import { newId } from "@/lib/id";
import { useStore } from "@/lib/store-context";

const AREA_COLOR: Record<string, string> = {
  money: "var(--money)",
  body: "var(--body)",
  life: "var(--life)",
  create: "var(--create)",
};

export function GoalsCard() {
  const { data, hydrated, setProfile, setHabits } = useStore();
  const [draft, setDraft] = useState("");

  const goals = data.profile.customGoals;
  const existingHabits = new Set(data.habits.map((h) => h.label.toLowerCase()));

  const addGoal = () => {
    const g = draft.trim();
    if (!g) return;
    if (goals.some((x) => x.toLowerCase() === g.toLowerCase())) {
      setDraft("");
      return;
    }
    const nextGoals = [...goals, g];
    const priorities = Array.from(new Set([...data.profile.priorities, ...inferAreas(nextGoals)]));
    setProfile({ ...data.profile, customGoals: nextGoals, priorities });
    setDraft("");
  };

  const removeGoal = (g: string) =>
    setProfile({ ...data.profile, customGoals: goals.filter((x) => x !== g) });

  const addHabit = (label: string) => {
    if (existingHabits.has(label.toLowerCase())) return;
    setHabits([...data.habits, { id: newId("habit"), label, active: true }]);
  };

  return (
    <Card title="Your goals" subtitle="In your own words — the coach turns each into a plan">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addGoal();
            }
          }}
          disabled={!hydrated}
          placeholder="Add a goal — e.g. Get out of debt, learn Spanish, sleep better"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-coach"
        />
        <button
          type="button"
          onClick={addGoal}
          disabled={!hydrated || !draft.trim()}
          className="shrink-0 rounded-lg bg-coach px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {hydrated && goals.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          No personal goals yet. Add what matters to you and the coach will build a plan around it.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {hydrated &&
          goals.map((g) => {
            const plan = interpretGoal(g);
            const habitAdded = plan.habit ? existingHabits.has(plan.habit.toLowerCase()) : false;
            return (
              <div key={g} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                        style={{ background: AREA_COLOR[plan.area] }}
                      >
                        {plan.tracks}
                      </span>
                      <p className="truncate text-sm font-semibold">{g}</p>
                    </div>
                    <p className="mt-1.5 text-sm text-muted">{plan.headline}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGoal(g)}
                    aria-label={`Remove ${g}`}
                    className="shrink-0 rounded-md px-1.5 text-muted hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <ul className="mt-3 space-y-1">
                  {plan.steps.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/90">
                      <span className="text-coach">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ul>

                {plan.habit && (
                  <button
                    type="button"
                    onClick={() => addHabit(plan.habit!)}
                    disabled={habitAdded}
                    className={
                      "mt-3 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors " +
                      (habitAdded ? "bg-surface-2 text-muted" : "bg-coach/15 text-coach hover:bg-coach/25")
                    }
                  >
                    {habitAdded ? `Habit added ✓` : `+ Add habit: ${plan.habit}`}
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </Card>
  );
}
