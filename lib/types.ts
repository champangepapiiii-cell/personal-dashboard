// Core data model for "The System" — single-user life dashboard.
// Everything persisted in localStorage conforms to these types.

export type ID = string;

/** ISO date string. Entries use date-only ("2026-07-22"); timestamps use full ISO. */
export type ISODate = string;

export type Currency = "AED";

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
  /** Per-day spend ceiling, in AED — a day at or under this counts as "on budget". */
  dailySpendTarget: number;
  weightTargetRange: { min: number; max: number };
  weeklyWorkoutGoal: number;
  weeklyCookGoal: number;
  monthlyPublishGoal: number;
}

export interface Habit {
  id: ID;
  label: string;
  active: boolean;
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
}

/** Names of the array-of-entry collections in AppData. */
export type EntryCollection =
  | "weight"
  | "workouts"
  | "meals"
  | "money"
  | "habitEntries"
  | "content";

/** Maps a collection name to its element type. */
export interface EntryTypeMap {
  weight: WeightEntry;
  workouts: WorkoutEntry;
  meals: MealEntry;
  money: MoneyEntry;
  habitEntries: HabitEntry;
  content: ContentItem;
}
