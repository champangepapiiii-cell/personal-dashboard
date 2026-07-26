// Core data model for "The System" — single-user life dashboard.
// Everything persisted in localStorage conforms to these types.

export type ID = string;

/** ISO date string. Entries use date-only ("2026-07-22"); timestamps use full ISO. */
export type ISODate = string;

/** Currency code (e.g. "AED", "USD"). See lib/currency.ts for the list. */
export type Currency = string;

// ---------------------------------------------------------------------------
// Entry types — each has an id and an ISO date string.
// ---------------------------------------------------------------------------

export interface WeightEntry {
  id: ID;
  date: ISODate;
  kg: number;
}

export type WorkoutType = "gym" | "run" | "football" | "other";

export interface WorkoutEntry {
  id: ID;
  date: ISODate;
  type: WorkoutType;
  /** Minutes. */
  duration: number;
  notes?: string;
}

export interface MealEntry {
  id: ID;
  date: ISODate;
  cookedAtHome: boolean;
}

export type MoneyType = "saved" | "spent" | "invested";

export interface MoneyEntry {
  id: ID;
  date: ISODate;
  type: MoneyType;
  amount: number;
  category: string;
  currency: Currency;
}

export interface HabitEntry {
  id: ID;
  date: ISODate;
  habitId: ID;
  completed: boolean;
}

export type ContentFormat = "blog" | "video" | "newsletter" | "social";
export type ContentStatus = "idea" | "drafting" | "editing" | "published";

export interface ContentItem {
  id: ID;
  title: string;
  format: ContentFormat;
  status: ContentStatus;
  createdAt: ISODate;
  publishedAt?: ISODate;
}

// ---------------------------------------------------------------------------
// Config objects — user-editable, also persisted in localStorage.
// ---------------------------------------------------------------------------

export interface Goals {
  /** Target total savings, in AED. */
  savingsTarget: number;
  /** Target amount to save each month, in AED. */
  monthlySavingsTarget: number;
  /** Per-day spend ceiling, in AED — a day at or under this counts as "on budget". */
  dailySpendTarget: number;
  weightTargetRange: { min: number; max: number };
  weeklyWorkoutGoal: number;
  weeklyCookGoal: number;
  monthlyPublishGoal: number;
}

/** One editable slice of the investment portfolio, in AED. */
export interface InvestmentAllocation {
  id: ID;
  label: string;
  amount: number;
}

/** One recurring monthly outgoing, in AED. */
export interface RecurringOutgoing {
  id: ID;
  label: string;
  amount: number;
}

export interface Habit {
  id: ID;
  label: string;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Coach: personalised setup, generated plans, and gamification.
// ---------------------------------------------------------------------------

export type FocusArea = "money" | "body" | "life" | "create";

export type DietType =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto"
  | "high-protein";

export type SavingStyle = "aggressive" | "steady" | "relaxed";

/** What a person tells the system about themselves during setup. */
export interface UserProfile {
  onboarded: boolean;
  name: string;
  /** Areas they most want to optimise, in priority order. */
  priorities: FocusArea[];
  /** Free-text personal goals in their own words — the engine interprets these. */
  customGoals: string[];
  dietType: DietType;
  /** Daily calorie target. */
  calorieTarget: number;
  /** Take-home income per month, in the chosen currency. */
  monthlyIncome: number;
  savingStyle: SavingStyle;
  /** Currency code used for all money display (labels only — no conversion). */
  currency: Currency;
}

export type MealSlot = "Breakfast" | "Lunch" | "Dinner";

export interface PlannedMeal {
  day: string; // e.g. "Mon"
  slot: MealSlot;
  recipeId: string;
  done: boolean;
}

/** A generated weekly meal plan the user can tick off and regenerate. */
export interface MealPlan {
  createdAt: ISODate;
  dietType: DietType;
  calorieTarget: number;
  meals: PlannedMeal[];
}

export interface SavingsWeek {
  week: number;
  amount: number;
  done: boolean;
}

/** A generated savings challenge with weekly targets and tactics. */
export interface SavingsPlan {
  createdAt: ISODate;
  style: SavingStyle;
  target: number;
  weeks: SavingsWeek[];
  tactics: string[];
}

// ---------------------------------------------------------------------------
// The full persisted shape.
// ---------------------------------------------------------------------------

export interface AppData {
  weight: WeightEntry[];
  workouts: WorkoutEntry[];
  meals: MealEntry[];
  money: MoneyEntry[];
  habitEntries: HabitEntry[];
  content: ContentItem[];
  goals: Goals;
  habits: Habit[];
  /** One editable focus line per day, keyed by ISO date ("2026-07-22"). */
  focuses: Record<ISODate, string>;
  /** Editable investment allocation (Money section). */
  investments: InvestmentAllocation[];
  /** Editable recurring monthly outgoings (Money section). */
  recurring: RecurringOutgoing[];
  /** Coach: who this person is and what they want to optimise. */
  profile: UserProfile;
  /** Coach: the current generated meal plan, or null before generation. */
  mealPlan: MealPlan | null;
  /** Coach: the current generated savings challenge, or null. */
  savingsPlan: SavingsPlan | null;
  /** Gamification: achievement ids already celebrated (so we only cheer once). */
  seenAchievements: ID[];
}

/** Names of the array collections in AppData that support generic CRUD. */
export type EntryCollection =
  | "weight"
  | "workouts"
  | "meals"
  | "money"
  | "habitEntries"
  | "content"
  | "investments"
  | "recurring";

/** Maps a collection name to its element type. */
export interface EntryTypeMap {
  weight: WeightEntry;
  workouts: WorkoutEntry;
  meals: MealEntry;
  money: MoneyEntry;
  habitEntries: HabitEntry;
  content: ContentItem;
  investments: InvestmentAllocation;
  recurring: RecurringOutgoing;
}
