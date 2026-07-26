"use client";

// Edit every goal in one place. Local draft state, committed on Save.

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { CURRENCIES } from "@/lib/currency";
import { useMoney } from "@/lib/useMoney";
import { useStore } from "@/lib/store-context";
import type { Goals } from "@/lib/types";

type Draft = Record<string, string>;

function toDraft(g: Goals): Draft {
  return {
    savingsTarget: String(g.savingsTarget),
    monthlySavingsTarget: String(g.monthlySavingsTarget),
    dailySpendTarget: String(g.dailySpendTarget),
    weightMin: String(g.weightTargetRange.min),
    weightMax: String(g.weightTargetRange.max),
    weeklyWorkoutGoal: String(g.weeklyWorkoutGoal),
    weeklyCookGoal: String(g.weeklyCookGoal),
    monthlyPublishGoal: String(g.monthlyPublishGoal),
  };
}

const FIELDS: { key: string; label: string; suffix?: string; money?: boolean; step?: string }[] = [
  { key: "savingsTarget", label: "Savings target", money: true },
  { key: "monthlySavingsTarget", label: "Monthly savings target", money: true },
  { key: "dailySpendTarget", label: "Daily spend ceiling", money: true },
  { key: "weightMin", label: "Weight target — min", suffix: "kg", step: "0.1" },
  { key: "weightMax", label: "Weight target — max", suffix: "kg", step: "0.1" },
  { key: "weeklyWorkoutGoal", label: "Workouts / week" },
  { key: "weeklyCookGoal", label: "Home meals / week" },
  { key: "monthlyPublishGoal", label: "Publishes / month" },
];

export function GoalsForm() {
  const { data, hydrated, setGoals, setProfile } = useStore();
  const { code } = useMoney();
  const [draft, setDraft] = useState<Draft>(() => toDraft(data.goals));
  const [saved, setSaved] = useState(false);

  // Resync when goals change externally (hydration, import, reset).
  useEffect(() => {
    setDraft(toDraft(data.goals));
  }, [data.goals]);

  const num = (k: string, fallback: number) => {
    const n = Number(draft[k]);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };

  const save = () => {
    const g = data.goals;
    setGoals({
      ...g,
      savingsTarget: num("savingsTarget", g.savingsTarget),
      monthlySavingsTarget: num("monthlySavingsTarget", g.monthlySavingsTarget),
      dailySpendTarget: num("dailySpendTarget", g.dailySpendTarget),
      weightTargetRange: {
        min: num("weightMin", g.weightTargetRange.min),
        max: num("weightMax", g.weightTargetRange.max),
      },
      weeklyWorkoutGoal: num("weeklyWorkoutGoal", g.weeklyWorkoutGoal),
      weeklyCookGoal: num("weeklyCookGoal", g.weeklyCookGoal),
      monthlyPublishGoal: num("monthlyPublishGoal", g.monthlyPublishGoal),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <Card title="Goals" subtitle="The targets everything is measured against">
      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-medium text-muted">Currency</span>
        <select
          value={data.profile.currency || "AED"}
          disabled={!hydrated}
          onChange={(e) => setProfile({ ...data.profile, currency: e.target.value })}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent sm:w-1/2"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name} ({c.symbol})
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-muted">
          Relabels all money amounts. Values aren&rsquo;t converted.
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs font-medium text-muted">{f.label}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                step={f.step ?? "1"}
                min={0}
                value={draft[f.key] ?? ""}
                disabled={!hydrated}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
              {(f.money || f.suffix) && (
                <span className="text-xs text-muted">{f.money ? code : f.suffix}</span>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!hydrated}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-sm hover:opacity-90 disabled:opacity-40"
        >
          Save goals
        </button>
        {saved && <span className="text-sm text-positive">Saved ✓</span>}
      </div>
    </Card>
  );
}
