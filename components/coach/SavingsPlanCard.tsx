"use client";

// The generated 12-week savings challenge. Ticking a week logs a real "saved"
// entry (so it flows into Money + XP + achievements) and un-ticking removes it.

import { Card } from "@/components/Card";
import { generateSavingsPlan } from "@/lib/coach";
import { dayKey } from "@/lib/dates";
import { useMoney } from "@/lib/useMoney";
import { useStore } from "@/lib/store-context";

export function SavingsPlanCard() {
  const { data, hydrated, setSavingsPlan, addEntry, removeEntry } = useStore();
  const { fmt, code } = useMoney();
  const plan = data.savingsPlan;

  if (!hydrated) return <Card title="Savings challenge"><div className="h-24" /></Card>;

  if (!plan) {
    return (
      <Card title="Savings challenge" subtitle="A 12-week plan to hit your goal">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-muted">No savings challenge yet.</p>
          <button
            type="button"
            onClick={() =>
              setSavingsPlan(
                generateSavingsPlan(data.profile, data.goals.monthlySavingsTarget, data.goals.savingsTarget),
              )
            }
            className="rounded-lg bg-coach px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Generate challenge
          </button>
        </div>
      </Card>
    );
  }

  const saved = plan.weeks.filter((w) => w.done).reduce((s, w) => s + w.amount, 0);
  const pct = plan.target ? Math.min(100, Math.round((saved / plan.target) * 100)) : 0;
  const doneCount = plan.weeks.filter((w) => w.done).length;

  const toggleWeek = (week: number) => {
    const target = plan.weeks.find((w) => w.week === week);
    if (!target) return;
    const nowDone = !target.done;
    setSavingsPlan({
      ...plan,
      weeks: plan.weeks.map((w) => (w.week === week ? { ...w, done: nowDone } : w)),
    });
    const id = `savechal_w${week}`;
    if (nowDone) {
      addEntry("money", {
        id,
        date: dayKey(),
        type: "saved",
        amount: target.amount,
        category: "Savings challenge",
        currency: data.profile.currency,
      });
    } else {
      removeEntry("money", id);
    }
  };

  const regenerate = () =>
    setSavingsPlan(
      generateSavingsPlan(data.profile, data.goals.monthlySavingsTarget, data.goals.savingsTarget, Date.now()),
    );

  return (
    <Card
      title="Savings challenge"
      subtitle={`${cap(plan.style)} · tick a week as you bank it`}
      right={
        <button
          type="button"
          onClick={regenerate}
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground"
        >
          ↻ New plan
        </button>
      }
    >
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-semibold tabular-nums text-coach">{fmt(saved, false)} <span className="text-sm font-normal text-muted">{code}</span></span>
        <span className="text-xs text-muted tabular-nums">
          {doneCount}/{plan.weeks.length} weeks · goal {fmt(plan.target, false)} {code}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%`, background: "var(--coach)" }} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {plan.weeks.map((w) => (
          <button
            key={w.week}
            type="button"
            onClick={() => toggleWeek(w.week)}
            className={
              "rounded-lg border px-2 py-2 text-center transition-colors " +
              (w.done ? "border-transparent bg-coach text-white" : "border-border hover:border-coach/50")
            }
          >
            <div className="text-[10px] uppercase tracking-wide opacity-70">Wk {w.week}</div>
            <div className="text-sm font-semibold tabular-nums">{fmt(w.amount, false)}</div>
          </button>
        ))}
      </div>

      {plan.tactics.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Tactics</p>
          <ul className="space-y-1.5">
            {plan.tactics.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/90">
                <span className="text-coach">•</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
