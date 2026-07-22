// The ONLY module that touches localStorage. Everything else in the app reads
// and writes through these typed functions. Handles JSON serialisation, safe
// defaults, first-load seeding, and change notification.

import { emptyData, generateSeedData } from "./seed";
import type {
  AppData,
  EntryCollection,
  EntryTypeMap,
  Goals,
  Habit,
} from "./types";

const STORAGE_KEY = "the-system:v1";

/** Fired on `window` after any successful write, so React can re-read. */
export const STORE_EVENT = "thesystem:change";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function normalise(parsed: Partial<AppData> | null | undefined): AppData {
  const base = emptyData();
  if (!parsed || typeof parsed !== "object") return base;
  return {
    weight: parsed.weight ?? base.weight,
    workouts: parsed.workouts ?? base.workouts,
    meals: parsed.meals ?? base.meals,
    money: parsed.money ?? base.money,
    habitEntries: parsed.habitEntries ?? base.habitEntries,
    content: parsed.content ?? base.content,
    goals: { ...base.goals, ...parsed.goals },
    habits: parsed.habits ?? base.habits,
    focuses: parsed.focuses ?? base.focuses,
  };
}

function persist(data: AppData): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(STORE_EVENT));
}

/**
 * Read the full dataset. On the very first load (empty storage) this seeds ~90
 * days of demo data and persists it. During SSR (no window) it returns empty
 * defaults without touching anything.
 */
export function getData(): AppData {
  if (!hasWindow()) return emptyData();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw == null) {
    const seeded = generateSeedData();
    persist(seeded);
    return seeded;
  }

  try {
    return normalise(JSON.parse(raw));
  } catch {
    // Corrupt payload — fall back to empty defaults rather than crash.
    return emptyData();
  }
}

export function setData(data: AppData): void {
  persist(data);
}

// --- Per-entity collection helpers -----------------------------------------

export function getEntries<K extends EntryCollection>(key: K): EntryTypeMap[K][] {
  return getData()[key] as EntryTypeMap[K][];
}

export function setEntries<K extends EntryCollection>(
  key: K,
  entries: EntryTypeMap[K][],
): void {
  const data = getData();
  persist({ ...data, [key]: entries });
}

export function addEntry<K extends EntryCollection>(
  key: K,
  entry: EntryTypeMap[K],
): void {
  const data = getData();
  persist({ ...data, [key]: [...(data[key] as EntryTypeMap[K][]), entry] });
}

export function removeEntry<K extends EntryCollection>(key: K, id: string): void {
  const data = getData();
  const next = (data[key] as { id: string }[]).filter((e) => e.id !== id);
  persist({ ...data, [key]: next });
}

// --- Config helpers ---------------------------------------------------------

export function getGoals(): Goals {
  return getData().goals;
}

export function setGoals(goals: Goals): void {
  persist({ ...getData(), goals });
}

export function getHabits(): Habit[] {
  return getData().habits;
}

export function setHabits(habits: Habit[]): void {
  persist({ ...getData(), habits });
}

// --- Daily focus ------------------------------------------------------------

export function getFocus(dateKey: string): string {
  return getData().focuses[dateKey] ?? "";
}

export function setFocus(dateKey: string, text: string): void {
  const data = getData();
  const focuses = { ...data.focuses };
  const trimmed = text.trim();
  if (trimmed) focuses[dateKey] = trimmed;
  else delete focuses[dateKey];
  persist({ ...data, focuses });
}

// --- Bulk lifecycle (wired to Settings buttons) ----------------------------

/** Replace everything with a fresh ~90-day demo dataset. */
export function resetToDemo(): void {
  persist(generateSeedData());
}

/** Wipe all data back to empty defaults. */
export function clearAll(): void {
  persist(emptyData());
}
