// Deterministic ~90-day demo dataset. Generated relative to "today" so the
// charts always look freshly populated. Seeded PRNG keeps it stable per day.

import type {
  AppData,
  ContentItem,
  Goals,
  Habit,
  HabitEntry,
  InvestmentAllocation,
  MealEntry,
  MoneyEntry,
  RecurringOutgoing,
  UserProfile,
  WeightEntry,
  WorkoutEntry,
  WorkoutType,
} from "./types";

const DAYS = 90;
/** Money history spans a full year so net-worth and 6-month charts look real. */
const MONEY_DAYS = 365;

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
  monthlySavingsTarget: 8000,
  dailySpendTarget: 300,
  weightTargetRange: { min: 74, max: 78 },
  weeklyWorkoutGoal: 4,
  weeklyCookGoal: 5,
  monthlyPublishGoal: 6,
};

/** Starting net-worth (assets that predate the tracked money history), in AED. */
export const NET_WORTH_BASELINE = 40000;

export const DEFAULT_INVESTMENTS: InvestmentAllocation[] = [
  { id: "inv_index", label: "Index funds", amount: 46000 },
  { id: "inv_stocks", label: "Individual stocks", amount: 22000 },
  { id: "inv_crypto", label: "Crypto", amount: 16000 },
  { id: "inv_reits", label: "REITs", amount: 12000 },
  { id: "inv_gold", label: "Gold & cash", amount: 9000 },
];

export const DEFAULT_RECURRING: RecurringOutgoing[] = [
  { id: "rec_rent", label: "Rent", amount: 6500 },
  { id: "rec_utilities", label: "Utilities & internet", amount: 900 },
  { id: "rec_groceries", label: "Groceries", amount: 2200 },
  { id: "rec_car", label: "Car & fuel", amount: 1400 },
  { id: "rec_subs", label: "Subscriptions", amount: 320 },
  { id: "rec_gym", label: "Gym", amount: 250 },
  { id: "rec_phone", label: "Phone", amount: 180 },
];

export const DEFAULT_HABITS: Habit[] = [
  { id: "habit_reading", label: "Reading", active: true },
  { id: "habit_football", label: "Football", active: true },
  { id: "habit_driving", label: "Driving practice", active: true },
  { id: "habit_music", label: "Music discovery", active: true },
  { id: "habit_admin", label: "Admin", active: true },
  { id: "habit_offline", label: "Time offline", active: true },
];

/** New users start un-onboarded so the setup wizard greets them. */
export const DEFAULT_PROFILE: UserProfile = {
  onboarded: false,
  name: "",
  priorities: ["money", "body", "life", "create"],
  customGoals: [],
  dietType: "omnivore",
  calorieTarget: 2200,
  monthlyIncome: 18000,
  savingStyle: "steady",
  currency: "AED",
};

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
    investments: [],
    recurring: [],
    profile: {
      ...DEFAULT_PROFILE,
      priorities: [...DEFAULT_PROFILE.priorities],
      customGoals: [...DEFAULT_PROFILE.customGoals],
    },
    mealPlan: null,
    savingsPlan: null,
    seenAchievements: [],
    goalSections: [],
    goalProgress: {},
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

  // Money — its own 12-month history so net-worth and monthly charts fill out.
  // ~2 transactions/day, biased so monthly saved lands near the ~8k target.
  const investCategories = ["Index funds", "Individual stocks", "Crypto", "REITs"];
  for (let i = MONEY_DAYS; i >= 0; i--) {
    const date = daysAgo(i);
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
          amount: Math.round((150 + rng() * 850) * 100) / 100,
          category: "Savings",
          currency: "AED",
        });
      } else {
        money.push({
          id: makeId("mo"),
          date,
          type: "invested",
          amount: Math.round((200 + rng() * 1500) * 100) / 100,
          category: pick(rng, investCategories),
          currency: "AED",
        });
      }
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
    investments: DEFAULT_INVESTMENTS.map((x) => ({ ...x })),
    recurring: DEFAULT_RECURRING.map((x) => ({ ...x })),
    profile: {
      ...DEFAULT_PROFILE,
      priorities: [...DEFAULT_PROFILE.priorities],
      customGoals: [...DEFAULT_PROFILE.customGoals],
    },
    mealPlan: null,
    savingsPlan: null,
    seenAchievements: [],
    goalSections: [{ id: "goal_confidence", title: "Confidence", createdAt: daysAgo(20) }],
    goalProgress: {},
  };
}
