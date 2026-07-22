// Derived metrics for the Today view. Pure functions over AppData — no I/O,
// no hardcoded numbers. Shared so later phases can reuse the same definitions.

import { currentWeekKeys, dayKeyDaysAgo } from "./dates";
import type { AppData } from "./types";

/**
 * Current consecutive-day streak for a per-day predicate.
 *
 * Today is given grace: if today doesn't yet qualify, the streak is measured
 * from yesterday so an incomplete day-in-progress doesn't read as a break.
 * `maxLookback` bounds the walk so predicates that pass on empty days (e.g.
 * "spent nothing") can't run past the tracked history.
 */
export function currentStreak(
  qualifies: (dayKey: string) => boolean,
  maxLookback = 400,
): number {
  const start = qualifies(dayKeyDaysAgo(0)) ? 0 : 1;
  let streak = 0;
  for (let i = start; i < start + maxLookback; i++) {
    if (!qualifies(dayKeyDaysAgo(i))) break;
    streak++;
  }
  return streak;
}

/** Days on that key with at least one tracked entry of any kind. */
function isTrackedDay(data: AppData, key: string): boolean {
  return (
    data.meals.some((m) => m.date === key) ||
    data.workouts.some((w) => w.date === key) ||
    data.money.some((m) => m.date === key) ||
    data.weight.some((w) => w.date === key) ||
    data.habitEntries.some((h) => h.date === key) ||
    data.content.some((c) => c.createdAt === key || c.publishedAt === key)
  );
}

/** Total spent (AED) on a given day. */
export function spentOn(data: AppData, key: string): number {
  return data.money
    .filter((m) => m.type === "spent" && m.date === key)
    .reduce((sum, m) => sum + m.amount, 0);
}

export interface StreakSet {
  trained: number;
  cooked: number;
  created: number;
  underSpend: number;
}

export function computeStreaks(data: AppData): StreakSet {
  const trained = currentStreak((key) => data.workouts.some((w) => w.date === key));

  const cooked = currentStreak((key) =>
    data.meals.some((m) => m.date === key && m.cookedAtHome),
  );

  const created = currentStreak((key) =>
    data.content.some((c) => c.createdAt === key || c.publishedAt === key),
  );

  const target = data.goals.dailySpendTarget;
  const underSpend = currentStreak(
    (key) => isTrackedDay(data, key) && spentOn(data, key) <= target,
  );

  return { trained, cooked, created, underSpend };
}

export interface WeeklyComponent {
  label: string;
  hit: number;
  planned: number;
}

export interface WeeklyCompletion {
  pct: number;
  hit: number;
  planned: number;
  components: WeeklyComponent[];
}

/**
 * Percentage of this week's planned actions that have been hit, Monday → today.
 * Planned = the weekly goals (publishing prorated from the monthly goal) plus
 * one check per active habit per day of the week.
 */
export function weeklyCompletion(data: AppData): WeeklyCompletion {
  const weekKeys = currentWeekKeys();
  const inWeek = (key?: string) => !!key && weekKeys.includes(key);

  const workouts = data.workouts.filter((w) => inWeek(w.date)).length;
  const cooked = data.meals.filter((m) => m.cookedAtHome && inWeek(m.date)).length;
  const published = data.content.filter(
    (c) => c.status === "published" && inWeek(c.publishedAt),
  ).length;
  const habitDone = data.habitEntries.filter(
    (h) => h.completed && inWeek(h.date),
  ).length;

  const activeHabits = data.habits.filter((h) => h.active).length;
  const weeklyPublishGoal = Math.max(1, Math.round(data.goals.monthlyPublishGoal / 4));

  const components: WeeklyComponent[] = [
    { label: "Workouts", hit: workouts, planned: data.goals.weeklyWorkoutGoal },
    { label: "Home meals", hit: cooked, planned: data.goals.weeklyCookGoal },
    { label: "Publishing", hit: published, planned: weeklyPublishGoal },
    { label: "Habits", hit: habitDone, planned: activeHabits * weekKeys.length },
  ].filter((c) => c.planned > 0);

  const planned = components.reduce((s, c) => s + c.planned, 0);
  const hit = components.reduce((s, c) => s + Math.min(c.hit, c.planned), 0);
  const pct = planned === 0 ? 0 : Math.round((hit / planned) * 100);

  return { pct, hit, planned, components };
}
