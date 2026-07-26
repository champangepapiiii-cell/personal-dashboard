// Gamification: XP and level derived from real activity (so they can't drift),
// plus achievements computed from thresholds. The store only remembers which
// achievements have been *celebrated*, so we cheer each one exactly once.

import { computeStreaks } from "./metrics";
import type { AppData } from "./types";

// --- XP ---------------------------------------------------------------------

export interface XpItem {
  label: string;
  xp: number;
}

const XP = {
  workout: 15,
  weighIn: 5,
  homeMeal: 8,
  saved: 5,
  invested: 8,
  habit: 4,
  published: 40,
  contentWip: 10,
  focus: 3,
} as const;

export function computeXp(data: AppData): { total: number; items: XpItem[] } {
  const cooked = data.meals.filter((m) => m.cookedAtHome).length;
  const saved = data.money.filter((m) => m.type === "saved").length;
  const invested = data.money.filter((m) => m.type === "invested").length;
  const habitsDone = data.habitEntries.filter((h) => h.completed).length;
  const published = data.content.filter((c) => c.status === "published").length;
  const wip = data.content.filter((c) => c.status !== "published" && c.status !== "idea").length;
  const focuses = Object.keys(data.focuses).length;

  const items: XpItem[] = [
    { label: "Training", xp: data.workouts.length * XP.workout },
    { label: "Weigh-ins", xp: data.weight.length * XP.weighIn },
    { label: "Home cooking", xp: cooked * XP.homeMeal },
    { label: "Saving & investing", xp: saved * XP.saved + invested * XP.invested },
    { label: "Habits", xp: habitsDone * XP.habit },
    { label: "Creating", xp: published * XP.published + wip * XP.contentWip },
    { label: "Daily focus", xp: focuses * XP.focus },
  ].filter((i) => i.xp > 0);

  return { total: items.reduce((s, i) => s + i.xp, 0), items };
}

// --- Levels -----------------------------------------------------------------

const RANKS = [
  "Getting Started",
  "Consistent",
  "Committed",
  "Disciplined",
  "Optimiser",
  "Relentless",
  "Machine",
  "Legend",
];

/** Cumulative XP required to *reach* a given level (level 1 = 0). */
function threshold(level: number): number {
  return 50 * (level - 1) * level; // L2=100, L3=300, L4=600, L5=1000 …
}

export interface LevelInfo {
  level: number;
  title: string;
  total: number;
  /** XP earned into the current level. */
  into: number;
  /** XP span from this level to the next. */
  span: number;
  /** 0–1 progress toward the next level. */
  progress: number;
}

export function levelForXp(total: number): LevelInfo {
  let level = 1;
  while (threshold(level + 1) <= total) level++;
  const base = threshold(level);
  const next = threshold(level + 1);
  const span = next - base;
  const into = total - base;
  return {
    level,
    title: RANKS[Math.min(level - 1, RANKS.length - 1)],
    total,
    into,
    span,
    progress: span > 0 ? into / span : 1,
  };
}

// --- Achievements -----------------------------------------------------------

export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  check: (data: AppData) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_step", label: "First Step", description: "Log your very first entry", icon: "👣",
    check: (d) => d.workouts.length + d.weight.length + d.meals.length + d.money.length > 0 },
  { id: "3_train_week", label: "In the Gym", description: "3 training sessions in a week", icon: "🏋️",
    check: (d) => d.workouts.length >= 3 },
  { id: "train_streak", label: "On a Roll", description: "A 3-day training streak", icon: "🔥",
    check: (d) => computeStreaks(d).trained >= 3 },
  { id: "cook_streak", label: "Home Chef", description: "A 5-day home-cooking streak", icon: "🍳",
    check: (d) => computeStreaks(d).cooked >= 5 },
  { id: "budget_streak", label: "On Budget", description: "5 days under your spend target", icon: "🎯",
    check: (d) => computeStreaks(d).underSpend >= 5 },
  { id: "saver", label: "Saver", description: "Save 10,000 in total", icon: "💰",
    check: (d) => d.money.filter((m) => m.type === "saved").reduce((s, m) => s + m.amount, 0) >= 10000 },
  { id: "investor", label: "Investor", description: "Invest across 3+ categories", icon: "📈",
    check: (d) => new Set(d.money.filter((m) => m.type === "invested").map((m) => m.category)).size >= 3 },
  { id: "creator", label: "Creator", description: "Publish your first piece", icon: "🚀",
    check: (d) => d.content.some((c) => c.status === "published") },
  { id: "habitual", label: "Habitual", description: "Complete 50 habit check-ins", icon: "✅",
    check: (d) => d.habitEntries.filter((h) => h.completed).length >= 50 },
  { id: "consistent", label: "Consistency King", description: "Reach 30 weigh-ins", icon: "⚖️",
    check: (d) => d.weight.length >= 30 },
];

export function unlockedAchievements(data: AppData): string[] {
  return ACHIEVEMENTS.filter((a) => a.check(data)).map((a) => a.id);
}
