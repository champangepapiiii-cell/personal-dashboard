"use client";

// Multi-step setup. Captures who the person is and what they want to optimise,
// then generates their first meal + savings plans and tailors their goals.

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { generateMealPlan, generateSavingsPlan, inferAreas, interpretGoal } from "@/lib/coach";
import { CURRENCIES } from "@/lib/currency";
import { useStore } from "@/lib/store-context";
import type { DietType, FocusArea, SavingStyle, UserProfile } from "@/lib/types";

const PRIORITIES: { id: FocusArea; label: string; accent: string }[] = [
  { id: "money", label: "Money", accent: "var(--money)" },
  { id: "body", label: "Body", accent: "var(--body)" },
  { id: "life", label: "Life", accent: "var(--life)" },
  { id: "create", label: "Create", accent: "var(--create)" },
];

const DIETS: { id: DietType; label: string }[] = [
  { id: "omnivore", label: "Omnivore" },
  { id: "high-protein", label: "High-protein" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Keto" },
];

const STYLES: { id: SavingStyle; label: string; blurb: string; rate: number }[] = [
  { id: "aggressive", label: "Aggressive", blurb: "Save hard and fast", rate: 0.25 },
  { id: "steady", label: "Steady", blurb: "Balanced and sustainable", rate: 0.15 },
  { id: "relaxed", label: "Relaxed", blurb: "Gentle, build the habit", rate: 0.08 },
];

export function OnboardingWizard({ onDone }: { onDone: () => void }) {
  const { data, setProfile, setMealPlan, setSavingsPlan, setGoals, addGoalSection } = useStore();
  const [step, setStep] = useState(0);

  const [name, setName] = useState(data.profile.name);
  const [priorities, setPriorities] = useState<FocusArea[]>(data.profile.priorities);
  const [customGoals, setCustomGoals] = useState<string[]>(data.profile.customGoals);
  const [goalDraft, setGoalDraft] = useState("");
  const [dietType, setDietType] = useState<DietType>(data.profile.dietType);
  const [calorieTarget, setCalorieTarget] = useState(String(data.profile.calorieTarget));
  const [monthlyIncome, setMonthlyIncome] = useState(String(data.profile.monthlyIncome));
  const [savingStyle, setSavingStyle] = useState<SavingStyle>(data.profile.savingStyle);
  const [currency, setCurrency] = useState(data.profile.currency || "AED");

  const steps = ["You", "Body", "Money", "Ready"];

  const profile: UserProfile = useMemo(() => {
    // Merge hand-picked areas with the ones inferred from written goals.
    const merged = Array.from(new Set([...priorities, ...inferAreas(customGoals)]));
    return {
      onboarded: true,
      name: name.trim(),
      priorities: merged.length ? merged : ["money", "body", "life", "create"],
      customGoals,
      dietType,
      calorieTarget: Math.max(1000, Number(calorieTarget) || 2000),
      monthlyIncome: Math.max(0, Number(monthlyIncome) || 0),
      savingStyle,
      currency,
    };
  }, [name, priorities, customGoals, dietType, calorieTarget, monthlyIncome, savingStyle, currency]);

  const togglePriority = (id: FocusArea) =>
    setPriorities((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const addGoal = () => {
    const g = goalDraft.trim();
    if (!g) return;
    if (!customGoals.some((x) => x.toLowerCase() === g.toLowerCase())) {
      setCustomGoals((prev) => [...prev, g]);
    }
    setGoalDraft("");
  };
  const removeGoal = (g: string) => setCustomGoals((prev) => prev.filter((x) => x !== g));

  const finish = () => {
    const rate = STYLES.find((s) => s.id === savingStyle)!.rate;
    const monthlySavingsTarget = Math.max(
      200,
      Math.round((profile.monthlyIncome * rate) / 100) * 100,
    );
    setGoals({ ...data.goals, monthlySavingsTarget });
    setProfile(profile);
    setMealPlan(generateMealPlan(profile));
    setSavingsPlan(
      generateSavingsPlan(profile, monthlySavingsTarget, data.goals.savingsTarget),
    );
    // Each goal written in their own words becomes its own section.
    customGoals.forEach((g) => addGoalSection(g));
    onDone();
  };

  const canNext =
    step === 0
      ? priorities.length > 0 || customGoals.length > 0
      : step === 1
        ? Number(calorieTarget) >= 1000
        : true;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl">
        {/* Header + progress */}
        <div className="border-b border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coach">
            Set up your system
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {step === 0 && "What matters to you?"}
            {step === 1 && "Your body goals"}
            {step === 2 && "Your money goals"}
            {step === 3 && "You're all set"}
          </h2>
          <div className="mt-3 flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: i <= step ? "var(--coach)" : "var(--surface-2)" }}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {step === 0 && (
            <>
              <Field label="What should we call you? (optional)">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </Field>
              <Field label="Quick pick — which areas do you want to optimise?">
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((p) => {
                    const on = priorities.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePriority(p.id)}
                        className={
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
                          (on ? "border-transparent text-white" : "border-border text-muted hover:text-foreground")
                        }
                        style={on ? { background: p.accent } : undefined}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Or tell us in your own words — what matters to you?">
                <div className="flex gap-2">
                  <input
                    value={goalDraft}
                    onChange={(e) => setGoalDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addGoal();
                      }
                    }}
                    placeholder="e.g. Get out of debt, run a marathon, more time with family"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={addGoal}
                    disabled={!goalDraft.trim()}
                    className="shrink-0 rounded-lg bg-coach px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </Field>

              {customGoals.length > 0 && (
                <ul className="space-y-2">
                  {customGoals.map((g) => {
                    const plan = interpretGoal(g);
                    return (
                      <li key={g} className="rounded-xl border border-border bg-surface-2/40 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{g}</p>
                            <p className="mt-0.5 text-xs text-coach">
                              {plan.headline} · tracked in {plan.tracks}
                            </p>
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
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Diet">
                <div className="flex flex-wrap gap-2">
                  {DIETS.map((d) => (
                    <Chip key={d.id} on={dietType === d.id} onClick={() => setDietType(d.id)}>
                      {d.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Daily calorie target">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={calorieTarget}
                    onChange={(e) => setCalorieTarget(e.target.value)}
                    className={inputClass}
                  />
                  <span className="text-sm text-muted">kcal</span>
                </div>
              </Field>
              <p className="text-xs text-muted">
                We&rsquo;ll build a weekly meal plan around this — you can regenerate it anytime.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Currency">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={inputClass}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={`Monthly take-home income (${currency})`}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Saving style">
                <div className="space-y-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSavingStyle(s.id)}
                      className={
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors " +
                        (savingStyle === s.id ? "border-coach bg-coach/10" : "border-border hover:border-coach/50")
                      }
                    >
                      <span>
                        <span className="block text-sm font-medium">{s.label}</span>
                        <span className="block text-xs text-muted">{s.blurb}</span>
                      </span>
                      <span className="text-xs text-muted">
                        ~{Math.round((Number(monthlyIncome) || 0) * s.rate).toLocaleString("en-US")}/mo
                      </span>
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3 py-2 text-sm">
              <p className="text-muted">Here&rsquo;s your starting setup:</p>
              <Summary label="Focus" value={profile.priorities.map((p) => cap(p)).join(", ") || "All areas"} />
              <Summary label="Diet" value={`${cap(dietType)} · ${profile.calorieTarget} kcal/day`} />
              <Summary
                label="Money"
                value={`${currency} ${(profile.monthlyIncome).toLocaleString("en-US")}/mo · ${cap(savingStyle)} saving`}
              />
              {customGoals.length > 0 && (
                <div className="rounded-lg border border-border bg-surface-2 px-3 py-2">
                  <span className="text-muted">Your goals</span>
                  <ul className="mt-1.5 space-y-1">
                    {customGoals.map((g) => (
                      <li key={g} className="flex gap-2">
                        <span className="text-coach">•</span>
                        <span className="font-medium">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="pt-2 text-muted">
                We&rsquo;ll generate a meal plan and a 12-week savings challenge, and start
                tracking your achievements. Everything is editable later.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <button
            type="button"
            onClick={() => (step === 0 ? onDone() : setStep((s) => s - 1))}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
          >
            {step === 0 ? "Skip for now" : "Back"}
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-lg bg-coach px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-lg bg-coach px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Generate my plan
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-coach";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
        (on ? "border-coach bg-coach/10 text-foreground" : "border-border text-muted hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
