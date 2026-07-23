"use client";

// Interactive quick-capture. Pick an entry type, fill a tiny form, and it
// writes straight to the store — the Today streaks and weekly ring react live.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { dayKey } from "@/lib/dates";
import { newId } from "@/lib/id";
import { useStore } from "@/lib/store-context";
import type { MoneyType, WorkoutType } from "@/lib/types";

type Tab = "workout" | "weight" | "meal" | "money";

const TABS: { id: Tab; label: string; accent: string }[] = [
  { id: "workout", label: "Workout", accent: "var(--body)" },
  { id: "weight", label: "Weight", accent: "var(--body)" },
  { id: "meal", label: "Meal", accent: "var(--life)" },
  { id: "money", label: "Money", accent: "var(--money)" },
];

const WORKOUT_TYPES: WorkoutType[] = ["gym", "run", "football", "other"];
const MONEY_TYPES: MoneyType[] = ["spent", "saved", "invested"];

export function QuickAddModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { addEntry } = useStore();
  const [tab, setTab] = useState<Tab>("workout");
  // Portal target: the header's backdrop-filter would otherwise trap `fixed`.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Form fields (kept flat and reset when the modal closes).
  const [workoutType, setWorkoutType] = useState<WorkoutType>("gym");
  const [duration, setDuration] = useState("45");
  const [notes, setNotes] = useState("");
  const [kg, setKg] = useState("");
  const [cookedAtHome, setCookedAtHome] = useState(true);
  const [moneyType, setMoneyType] = useState<MoneyType>("spent");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!open) return;
    // Close on Escape.
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const today = dayKey();

  const reset = () => {
    setWorkoutType("gym");
    setDuration("45");
    setNotes("");
    setKg("");
    setCookedAtHome(true);
    setMoneyType("spent");
    setAmount("");
    setCategory("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const save = () => {
    if (tab === "workout") {
      const mins = Number(duration);
      if (!Number.isFinite(mins) || mins <= 0) return;
      addEntry("workouts", {
        id: newId("wk"),
        date: today,
        type: workoutType,
        duration: mins,
        notes: notes.trim() || undefined,
      });
      onSaved(`Logged a ${mins}-min ${workoutType} workout`);
    } else if (tab === "weight") {
      const w = Number(kg);
      if (!Number.isFinite(w) || w <= 0) return;
      addEntry("weight", { id: newId("w"), date: today, kg: w });
      onSaved(`Logged weight ${w} kg`);
    } else if (tab === "meal") {
      addEntry("meals", { id: newId("m"), date: today, cookedAtHome });
      onSaved(cookedAtHome ? "Logged a home-cooked meal" : "Logged an eating-out meal");
    } else {
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) return;
      addEntry("money", {
        id: newId("mo"),
        date: today,
        type: moneyType,
        amount: amt,
        category: category.trim() || "Uncategorised",
        currency: "AED",
      });
      onSaved(`Logged AED ${amt} ${moneyType}`);
    }
    close();
  };

  const canSave =
    tab === "meal" ||
    (tab === "workout" && Number(duration) > 0) ||
    (tab === "weight" && Number(kg) > 0) ||
    (tab === "money" && Number(amount) > 0);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick add entry"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-border bg-surface p-5 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Quick add</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Type selector */}
        <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-xl bg-surface-2 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                "rounded-lg px-2 py-1.5 text-sm font-medium transition-colors " +
                (tab === t.id ? "bg-surface shadow-sm" : "text-muted hover:text-foreground")
              }
              style={tab === t.id ? { color: t.accent } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="mt-4 space-y-3">
          {tab === "workout" && (
            <>
              <Field label="Type">
                <Segmented
                  options={WORKOUT_TYPES}
                  value={workoutType}
                  onChange={setWorkoutType}
                />
              </Field>
              <Field label="Duration (min)">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Notes (optional)">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Push day"
                  className={inputClass}
                />
              </Field>
            </>
          )}

          {tab === "weight" && (
            <Field label="Weight (kg)">
              <input
                type="number"
                inputMode="decimal"
                min={1}
                step="0.1"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                placeholder="e.g. 79.4"
                autoFocus
                className={inputClass}
              />
            </Field>
          )}

          {tab === "meal" && (
            <Field label="Where did you eat?">
              <Segmented
                options={["home", "out"]}
                value={cookedAtHome ? "home" : "out"}
                onChange={(v) => setCookedAtHome(v === "home")}
                labels={{ home: "Cooked at home", out: "Ate out" }}
              />
            </Field>
          )}

          {tab === "money" && (
            <>
              <Field label="Type">
                <Segmented options={MONEY_TYPES} value={moneyType} onChange={setMoneyType} />
              </Field>
              <Field label="Amount (AED)">
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 120"
                  autoFocus
                  className={inputClass}
                />
              </Field>
              <Field label="Category">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Groceries"
                  className={inputClass}
                />
              </Field>
            </>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save entry
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={
            "rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-colors " +
            (value === o
              ? "border-accent bg-accent/10 text-foreground"
              : "border-border text-muted hover:text-foreground")
          }
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}
