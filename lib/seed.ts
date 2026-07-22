// Deterministic ~90-day demo dataset. Generated relative to "today" so the
// charts always look freshly populated. Seeded PRNG keeps it stable per day.

import type {
  AppData,
  ContentItem,
  Goals,
  Habit,
  HabitEntry,
  MealEntry,
  MoneyEntry,
  WeightEntry,
  WorkoutEntry,
  WorkoutType,
} from "./types";

const DAYS = 90;

/** Small, fast, seedable PRNG (mulberry32). */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** N days before today (0 = today), as a date-only ISO string. */
function daysAgo(n: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return isoDate(d);
}

let idCounter = 0;
function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter.toString(36)}`;
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export const DEFAULT_GOALS: Goals = {
  savingsTarget: 120000,
  dailySpendTarget: 300,
  weightTargetRange: { min: 74, max: 78 },
  weeklyWorkoutGoal: 4,
  weeklyCookGoal: 5,
  monthlyPublishGoal: 6,
};

export const DEFAULT_HABITS: Habit[] = [
  { id: "habit_read", label: "Read 20 min", active: true },
  { id: "habit_water", label: "2L water", active: true },
  { id: "habit_meditate", label: "Meditate", active: true },
  { id: "habit_nocaffeine", label: "No caffeine after 2pm", active: true },
  { id: "habit_journal", label: "Journal", active: false },
];

/** Empty-but-valid dataset: no entries, default config. */
export function emptyData(): AppData {
  return {
    weight: [],
    workouts: [],
    meals: [],
    money: [],
    habitEntries: [],
    content: [],
    goals: { ...DEFAULT_GOALS, weightTargetRange: { ...DEFAULT_GOALS.weightTargetRange } },
    habits: DEFAULT_HABITS.map((h) => ({ ...h })),
    focuses: {},
  };
}

/** ~90 days of realistic demo data. */
export function generateSeedData(): AppData {
  idCounter = 0;
  const rng = mulberry32(0x5eed);

  const weight: WeightEntry[] = [];
  const workouts: WorkoutEntry[] = [];
  const meals: MealEntry[] = [];
  const money: MoneyEntry[] = [];
  const habitEntries: HabitEntry[] = [];

  const habits = DEFAULT_HABITS.map((h) => ({ ...h }));
  const activeHabits = habits.filter((h) => h.active);

  // Weight: gentle downward trend from ~82 toward the target range, with noise.
  let kg = 82;
  const workoutTypes: WorkoutType[] = ["gym", "run", "football", "other"];
  const spendCategories = ["Groceries", "Dining", "Transport", "Shopping", "Bills", "Health", "Leisure"];

  for (let i = DAYS; i >= 0; i--) {
    const date = daysAgo(i);
    const dow = new Date(date).getDay(); // 0 Sun .. 6 Sat

    // Weight — log most days (~5 of 7).
    kg += (rng() - 0.62) * 0.25; // slight downward drift
    kg = Math.max(76, Math.min(83, kg));
    if (rng() > 0.28) {
      weight.push({ id: makeId("w"), date, kg: Math.round(kg * 10) / 10 });
    }

    // Workouts — ~4/week, more likely on weekdays + Sat.
    const workoutChance = dow === 5 ? 0.15 : 0.6; // rest-ish on Fridays
    if (rng() < workoutChance) {
      const type = pick(rng, workoutTypes);
      const duration =
        type === "football" ? 90 : type === "run" ? 30 + Math.floor(rng() * 30) : 45 + Math.floor(rng() * 30);
      workouts.push({
        id: makeId("wk"),
        date,
        type,
        duration,
        notes: type === "gym" ? pick(rng, ["Push", "Pull", "Legs", "Upper", "Full body"]) : undefined,
      });
    }

    // Meals — one summary entry/day: cooked at home ~65% of days.
    meals.push({ id: makeId("m"), date, cookedAtHome: rng() < 0.65 });

    // Money — 1–3 entries/day.
    const nTxns = 1 + Math.floor(rng() * 3);
    for (let t = 0; t < nTxns; t++) {
      const roll = rng();
      if (roll < 0.62) {
        money.push({
          id: makeId("mo"),
          date,
          type: "spent",
          amount: Math.round((15 + rng() * 240) * 100) / 100,
          category: pick(rng, spendCategories),
          currency: "AED",
        });
      } else if (roll < 0.85) {
        money.push({
          id: makeId("mo"),
          date,
          type: "saved",
          amount: Math.round((100 + rng() * 900) * 100) / 100,
          category: "Savings",
          currency: "AED",
        });
      } else {
        money.push({
          id: makeId("mo"),
          date,
          type: "invested",
          amount: Math.round((200 + rng() * 1500) * 100) / 100,
          category: pick(rng, ["Index fund", "Crypto", "Stocks"]),
          currency: "AED",
        });
      }
    }

    // Habits — per active habit, completed ~70% of days.
    for (const h of activeHabits) {
      habitEntries.push({
        id: makeId("h"),
        date,
        habitId: h.id,
        completed: rng() < 0.7,
      });
    }
  }

  // Content — ~18 items across the 90 days, mixed statuses.
  const content: ContentItem[] = [];
  const titles = [
    "Why I quit my SaaS side project",
    "The 3-hour workday experiment",
    "How I read 40 books this year",
    "Dubai vs Lisbon: a founder's take",
    "Building in public, month 6",
    "My minimal money system",
    "Lifting for longevity, not vanity",
    "The newsletter that pays my rent",
    "Notes on taste",
    "Cooking as a creative reset",
    "What 90 days of tracking taught me",
    "The case against morning routines",
    "Shipping small, shipping often",
    "A week of no dopamine",
    "How I price my writing",
    "The football league that saved my cardio",
    "Designing a life dashboard",
    "Quarterly review: Q2",
  ];
  const formats = ["blog", "video", "newsletter", "social"] as const;
  const statuses = ["idea", "drafting", "editing", "published"] as const;
  for (let i = 0; i < titles.length; i++) {
    const createdAt = daysAgo(DAYS - Math.floor((i / titles.length) * DAYS) - Math.floor(rng() * 5));
    const status = i < titles.length - 5 ? "published" : pick(rng, statuses);
    content.push({
      id: makeId("c"),
      title: titles[i],
      format: pick(rng, formats),
      status,
      createdAt,
      publishedAt:
        status === "published"
          ? daysAgo(Math.max(0, DAYS - Math.floor((i / titles.length) * DAYS) - 1 - Math.floor(rng() * 3)))
          : undefined,
    });
  }

  const focuses: Record<string, string> = {
    [daysAgo(0)]: "Ship the Today dashboard",
    [daysAgo(1)]: "Deep work — no meetings before noon",
    [daysAgo(2)]: "Long run + edit the newsletter draft",
  };

  return {
    weight,
    workouts,
    meals,
    money,
    habitEntries,
    content,
    goals: { ...DEFAULT_GOALS, weightTargetRange: { ...DEFAULT_GOALS.weightTargetRange } },
    habits,
    focuses,
  };
}
