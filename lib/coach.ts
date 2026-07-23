// The "smart engine": turns a UserProfile + their data into personalised
// plans. Deterministic given a seed, so "regenerate" reshuffles. No network.

import { dayKey } from "./dates";
import { RECIPES, type Recipe } from "./recipes";
import type {
  AppData,
  DietType,
  FocusArea,
  MealPlan,
  MealSlot,
  PlannedMeal,
  SavingsPlan,
  SavingStyle,
  UserProfile,
} from "./types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS: MealSlot[] = ["Breakfast", "Lunch", "Dinner"];
const SLOT_SHARE: Record<MealSlot, number> = { Breakfast: 0.25, Lunch: 0.35, Dinner: 0.4 };

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Goal interpreter -------------------------------------------------------
// Turns a free-text personal goal into an actionable optimisation: the area it
// belongs to, concrete steps, and a habit to build. Keyword-matched, no LLM.

export interface GoalPlan {
  goal: string;
  area: FocusArea;
  /** Which section of the app helps track it. */
  tracks: string;
  headline: string;
  steps: string[];
  /** Suggested habit label (addable), if any. */
  habit?: string;
}

interface GoalTheme {
  area: FocusArea;
  tracks: string;
  keys: string[];
  headline: string;
  steps: string[];
  habit?: string;
}

const GOAL_THEMES: GoalTheme[] = [
  {
    area: "money",
    tracks: "Money",
    keys: ["debt", "loan", "credit card", "pay off", "payoff"],
    headline: "We'll turn this into a payoff plan.",
    steps: [
      "List balances and target the highest-interest one first.",
      "Set a fixed monthly payment and automate it.",
      "Track every AED that goes toward it in Money.",
    ],
    habit: "No-spend check-in",
  },
  {
    area: "money",
    tracks: "Money",
    keys: ["save", "saving", "house", "deposit", "emergency fund", "money", "wealth", "rich", "invest", "retire", "budget", "financial"],
    headline: "We'll size a savings target and automate it.",
    steps: [
      "Pick a monthly savings number in Setup.",
      "Run the 12-week savings challenge and tick each week.",
      "Auto-invest a slice into a low-cost index fund.",
    ],
    habit: "No-spend check-in",
  },
  {
    area: "body",
    tracks: "Body",
    keys: ["marathon", "run", "5k", "10k", "race", "cardio"],
    headline: "We'll build you toward the distance.",
    steps: [
      "Log every run so the training heatmap fills in.",
      "Add one longer run each week and keep the rest easy.",
      "Aim to hit your weekly session goal consistently.",
    ],
    habit: "10k steps",
  },
  {
    area: "body",
    tracks: "Body",
    keys: ["weight", "lose", "fat", "lean", "slim", "gym", "muscle", "strong", "strength", "fit", "fitness", "exercise", "workout", "health"],
    headline: "We'll track the trend, not the daily number.",
    steps: [
      "Weigh in a few times a week — watch the 7-day average.",
      "Hit your weekly training-session goal.",
      "Keep protein up and cook at home more.",
    ],
    habit: "Hit protein target",
  },
  {
    area: "body",
    tracks: "Body",
    keys: ["cook", "eat", "diet", "nutrition", "calorie", "meal", "vegan", "vegetarian", "protein", "healthy"],
    headline: "We'll build meals around your target.",
    steps: [
      "Set your diet and calories in Setup.",
      "Follow the generated weekly meal plan.",
      "Tick meals off and log home cooking.",
    ],
    habit: "Hit protein target",
  },
  {
    area: "life",
    tracks: "Life",
    keys: ["sleep", "rest", "tired", "early", "wake"],
    headline: "We'll make sleep a tracked habit.",
    steps: [
      "Set a consistent lights-out time.",
      "Check it off daily and watch the streak.",
      "Protect the hour before bed from screens.",
    ],
    habit: "Lights out by 11",
  },
  {
    area: "life",
    tracks: "Life",
    keys: ["stress", "calm", "meditate", "mindful", "anxiety", "balance", "mental", "peace"],
    headline: "We'll build a daily reset.",
    steps: [
      "Add a short daily mindfulness habit.",
      "Keep the streak going — consistency over length.",
      "Review how you feel each week.",
    ],
    habit: "Meditate",
  },
  {
    area: "life",
    tracks: "Life",
    keys: ["read", "learn", "study", "course", "language", "skill", "book", "knowledge"],
    headline: "We'll compound small daily inputs.",
    steps: [
      "Commit to a small daily dose (20 minutes).",
      "Track it as a habit and protect the streak.",
      "Review what you learned weekly.",
    ],
    habit: "Read 20 min",
  },
  {
    area: "life",
    tracks: "Life",
    keys: ["family", "friends", "relationship", "partner", "social", "people", "time with", "connection"],
    headline: "We'll make the time intentional.",
    steps: [
      "Block a recurring time and treat it as non-negotiable.",
      "Track it as a weekly habit.",
      "Protect it from work spillover.",
    ],
    habit: "Weekly quality time",
  },
  {
    area: "create",
    tracks: "Create",
    keys: ["write", "writing", "create", "content", "youtube", "blog", "newsletter", "podcast", "audience", "brand", "business", "startup", "side hustle", "ship", "build", "portfolio"],
    headline: "We'll make shipping a habit.",
    steps: [
      "Break the goal into publishable pieces.",
      "Move items through your Create pipeline.",
      "Ship on a steady cadence — reps beat sprints.",
    ],
    habit: "Create for 30 min",
  },
  {
    area: "life",
    tracks: "Life",
    keys: ["focus", "productivity", "procrastinate", "discipline", "routine", "consistent", "time management", "organise", "organize"],
    headline: "We'll anchor it with a daily routine.",
    steps: [
      "Pick one keystone habit to build first.",
      "Set a daily focus each morning.",
      "Track streaks so momentum is visible.",
    ],
    habit: "Set a daily focus",
  },
];

export function interpretGoal(goal: string): GoalPlan {
  const text = goal.toLowerCase();
  const theme = GOAL_THEMES.find((t) => t.keys.some((k) => text.includes(k)));
  if (theme) {
    return {
      goal,
      area: theme.area,
      tracks: theme.tracks,
      headline: theme.headline,
      steps: theme.steps,
      habit: theme.habit,
    };
  }
  // Fallback: still make it actionable.
  return {
    goal,
    area: "life",
    tracks: "Life",
    headline: "We'll turn this into a trackable weekly habit.",
    steps: [
      "Break it into one small, repeatable weekly action.",
      "Add it as a habit and check it off.",
      "Review progress each week and adjust.",
    ],
    habit: goal.length <= 24 ? goal : undefined,
  };
}

export function interpretGoals(goals: string[]): GoalPlan[] {
  return goals.map(interpretGoal);
}

/** Unique focus areas implied by a set of free-text goals (priority order). */
export function inferAreas(goals: string[]): FocusArea[] {
  const seen: FocusArea[] = [];
  for (const g of goals) {
    const { area } = interpretGoal(g);
    if (!seen.includes(area)) seen.push(area);
  }
  return seen;
}

// --- Meal plan --------------------------------------------------------------

export function generateMealPlan(profile: UserProfile, seed = Date.now()): MealPlan {
  const rng = mulberry32(seed);
  const meals: PlannedMeal[] = [];

  for (const slot of SLOTS) {
    const budget = Math.round(profile.calorieTarget * SLOT_SHARE[slot]);
    let pool = RECIPES.filter((r) => r.slot === slot && r.diets.includes(profile.dietType));
    if (pool.length === 0) pool = RECIPES.filter((r) => r.slot === slot); // safety net

    // Favour recipes near the calorie budget; high-protein diets weight protein.
    const scored = pool
      .map((r) => ({
        r,
        score:
          Math.abs(r.calories - budget) -
          (profile.dietType === "high-protein" ? r.protein * 4 : 0) +
          rng() * 60, // jitter for variety across regenerations
      }))
      .sort((a, b) => a.score - b.score)
      .map((s) => s.r);

    // Rotate through the best picks so the week has variety without repeats.
    const rotation = shuffle(scored.slice(0, Math.max(4, Math.min(7, scored.length))), rng);
    DAYS.forEach((day, i) => {
      const r = rotation[i % rotation.length];
      meals.push({ day, slot, recipeId: r.id, done: false });
    });
  }

  return {
    createdAt: dayKey(),
    dietType: profile.dietType,
    calorieTarget: profile.calorieTarget,
    meals,
  };
}

export function mealPlanCalories(plan: MealPlan): number {
  const perDay = new Map<string, number>();
  for (const m of plan.meals) {
    const r = RECIPES.find((x) => x.id === m.recipeId);
    if (r) perDay.set(m.day, (perDay.get(m.day) ?? 0) + r.calories);
  }
  const totals = [...perDay.values()];
  return totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
}

export function recipesForSlot(slot: MealSlot, diet: DietType): Recipe[] {
  return RECIPES.filter((r) => r.slot === slot && r.diets.includes(diet));
}

// --- Savings plan -----------------------------------------------------------

const STYLE_RATE: Record<SavingStyle, number> = {
  aggressive: 0.28,
  steady: 0.18,
  relaxed: 0.1,
};

export function generateSavingsPlan(
  profile: UserProfile,
  monthlySavingsTarget: number,
  savingsTarget: number,
  seed = Date.now(),
): SavingsPlan {
  const rng = mulberry32(seed);
  const weeks = 12;

  // Weekly base: blend of income-based rate and the user's monthly target.
  const fromIncome = (profile.monthlyIncome * STYLE_RATE[profile.savingStyle]) / 4.33;
  const fromTarget = monthlySavingsTarget / 4.33;
  const base = Math.max(50, Math.round(((fromIncome + fromTarget) / 2) / 10) * 10);

  const plan: SavingsPlan["weeks"] = [];
  for (let w = 1; w <= weeks; w++) {
    let amount = base;
    if (profile.savingStyle === "aggressive") amount = Math.round((base * (0.7 + (w / weeks) * 0.9)) / 10) * 10;
    else if (profile.savingStyle === "relaxed") amount = Math.round((base * (0.9 + rng() * 0.2)) / 10) * 10;
    plan.push({ week: w, amount, done: false });
  }

  const tactics = buildTactics(profile);
  const target = plan.reduce((s, x) => s + x.amount, 0);
  return { createdAt: dayKey(), style: profile.savingStyle, target: Math.min(target, savingsTarget || target), weeks: plan, tactics };
}

function buildTactics(profile: UserProfile): string[] {
  const t: string[] = [];
  if (profile.savingStyle === "aggressive") {
    t.push("Automate a transfer the day your salary lands — pay yourself first.");
    t.push("Run two no-spend days a week; bank what you'd have spent.");
  } else if (profile.savingStyle === "relaxed") {
    t.push("Round every card purchase up to the nearest 10 AED and stash the difference.");
    t.push("Try one no-spend day a week to start the habit gently.");
  } else {
    t.push("Split your salary 50/30/20 — needs, wants, and this challenge.");
    t.push("Cancel one unused subscription and redirect it into savings.");
  }
  t.push("Cook at home more — every home meal is a small, repeatable win.");
  if (profile.monthlyIncome > 0) {
    t.push(`Auto-invest 10% of income (~${Math.round((profile.monthlyIncome * 0.1) / 10) * 10} AED/mo) into a low-cost index fund.`);
  }
  return t;
}

// --- Habit suggestions ------------------------------------------------------

export interface HabitSuggestion {
  id: string;
  label: string;
  rationale: string;
}

export function generateHabitSuggestions(profile: UserProfile): HabitSuggestion[] {
  const s: HabitSuggestion[] = [];
  const has = (a: string) => profile.priorities.includes(a as never);

  if (has("body")) {
    s.push({ id: "sg_steps", label: "10k steps", rationale: "Baseline movement that compounds with your training." });
    s.push({ id: "sg_protein", label: "Hit protein target", rationale: `Supports your ${profile.dietType} diet and recovery.` });
  }
  if (has("money")) {
    s.push({ id: "sg_nospend", label: "No-spend check-in", rationale: "A daily nudge that keeps your savings challenge on track." });
  }
  if (has("life")) {
    s.push({ id: "sg_read", label: "Read 20 min", rationale: "Small daily inputs, big long-term compounding." });
    s.push({ id: "sg_sleep", label: "Lights out by 11", rationale: "Sleep is the multiplier on everything else." });
  }
  if (has("create")) {
    s.push({ id: "sg_ship", label: "Create for 30 min", rationale: "Consistent reps beat occasional sprints." });
  }
  s.push({ id: "sg_water", label: "2L water", rationale: "Cheap, easy win that lifts energy and focus." });
  return s.slice(0, 5);
}

// --- Insights (data-driven) -------------------------------------------------

export interface Insight {
  title: string;
  detail: string;
  tone: "good" | "warn" | "info";
}

export function generateInsights(data: AppData): Insight[] {
  const out: Insight[] = [];
  const last30 = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= Date.now() - 30 * 864e5;
  };

  // Cooking
  const meals30 = data.meals.filter((m) => last30(m.date));
  const cooked = meals30.filter((m) => m.cookedAtHome).length;
  const cookRate = meals30.length ? cooked / meals30.length : 0;
  if (meals30.length) {
    out.push(
      cookRate >= 0.7
        ? { title: "Kitchen game strong", detail: `You cooked ${Math.round(cookRate * 100)}% of meals this month — keep it up.`, tone: "good" }
        : { title: "Cook a little more", detail: `You're at ${Math.round(cookRate * 100)}% home-cooked. Two more home meals a week saves money and calories.`, tone: "warn" },
    );
  }

  // Training
  const workouts30 = data.workouts.filter((w) => last30(w.date)).length;
  const perWeek = Math.round((workouts30 / 30) * 7 * 10) / 10;
  if (data.workouts.length) {
    out.push(
      perWeek >= data.goals.weeklyWorkoutGoal
        ? { title: "Training on target", detail: `~${perWeek} sessions/week, at or above your goal of ${data.goals.weeklyWorkoutGoal}.`, tone: "good" }
        : { title: "Nudge up training", detail: `~${perWeek} sessions/week vs a goal of ${data.goals.weeklyWorkoutGoal}. One extra session gets you closer.`, tone: "info" },
    );
  }

  // Savings pace
  const saved30 = data.money.filter((m) => m.type === "saved" && last30(m.date)).reduce((s, m) => s + m.amount, 0);
  if (saved30 > 0) {
    out.push({
      title: "Savings momentum",
      detail: `You saved ~${Math.round(saved30).toLocaleString("en-US")} AED in the last 30 days. Automating it makes it effortless.`,
      tone: saved30 >= data.goals.monthlySavingsTarget ? "good" : "info",
    });
  }

  if (out.length === 0) {
    out.push({ title: "Start logging", detail: "Log a few days of meals, training and money and I'll tailor tips to your patterns.", tone: "info" });
  }
  return out;
}
