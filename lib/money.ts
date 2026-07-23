// Derived money metrics for the Money section. Pure functions over AppData.
// All amounts are AED.

import { lastNMonths, yearMonthOf } from "./dates";
import { NET_WORTH_BASELINE } from "./seed";
import type { AppData, MoneyType } from "./types";

export function sumByType(data: AppData, type: MoneyType): number {
  return data.money.filter((m) => m.type === type).reduce((s, m) => s + m.amount, 0);
}

/** Total saved to date (cumulative "saved" contributions). */
export function currentSavings(data: AppData): number {
  return sumByType(data, "saved");
}

/** Average saved per month across the tracked history (used for projection). */
export function avgMonthlySaved(data: AppData): number {
  const saved = data.money.filter((m) => m.type === "saved");
  if (saved.length === 0) return 0;
  const months = new Set(saved.map((m) => m.date.slice(0, 7)));
  const total = saved.reduce((s, m) => s + m.amount, 0);
  return total / Math.max(1, months.size);
}

export interface SavingsProjection {
  current: number;
  target: number;
  pct: number;
  avgMonthly: number;
  /** Whether the target is already met. */
  reached: boolean;
  /** Whole months until the target at the current pace, or null if unknown. */
  monthsRemaining: number | null;
  /** Projected date the target is hit, or null. */
  date: Date | null;
}

export function savingsProjection(data: AppData): SavingsProjection {
  const current = currentSavings(data);
  const target = data.goals.savingsTarget;
  const avgMonthly = avgMonthlySaved(data);
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const reached = current >= target;

  let monthsRemaining: number | null = null;
  let date: Date | null = null;
  if (!reached && avgMonthly > 0) {
    monthsRemaining = Math.ceil((target - current) / avgMonthly);
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthsRemaining);
    date = d;
  }

  return { current, target, pct, avgMonthly, reached, monthsRemaining, date };
}

export interface NetWorthPoint {
  label: string;
  value: number;
}

/**
 * Monthly net-worth series over the last `months` months. Modelled as a
 * starting baseline plus cumulative saved + invested contributions.
 */
export function netWorthSeries(data: AppData, months = 12): NetWorthPoint[] {
  const buckets = lastNMonths(months);

  // Cumulative contributions up to the END of each bucket month.
  const contributions = data.money.filter(
    (m) => m.type === "saved" || m.type === "invested",
  );

  return buckets.map((b) => {
    const cumulative = contributions
      .filter((m) => {
        const [y, mo] = yearMonthOf(m.date);
        return y < b.year || (y === b.year && mo <= b.month);
      })
      .reduce((s, m) => s + m.amount, 0);
    return { label: b.label, value: Math.round(NET_WORTH_BASELINE + cumulative) };
  });
}

export interface SavedVsTargetPoint {
  label: string;
  saved: number;
  target: number;
}

/** Actual saved vs the monthly target, per month, over the last `months`. */
export function savedVsTarget(data: AppData, months = 6): SavedVsTargetPoint[] {
  const buckets = lastNMonths(months);
  const target = data.goals.monthlySavingsTarget;

  return buckets.map((b) => {
    const saved = data.money
      .filter((m) => {
        if (m.type !== "saved") return false;
        const [y, mo] = yearMonthOf(m.date);
        return y === b.year && mo === b.month;
      })
      .reduce((s, m) => s + m.amount, 0);
    return { label: b.label, saved: Math.round(saved), target };
  });
}

export function investmentsTotal(data: AppData): number {
  return data.investments.reduce((s, x) => s + x.amount, 0);
}

export function recurringTotal(data: AppData): number {
  return data.recurring.reduce((s, x) => s + x.amount, 0);
}

/** Format an AED amount with grouped thousands (locale-fixed for stability). */
export function aed(n: number, withSymbol = true): string {
  const s = Math.round(n).toLocaleString("en-US");
  return withSymbol ? `AED ${s}` : s;
}
