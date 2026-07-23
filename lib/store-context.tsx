"use client";

// React-context bridge over the localStorage store. Components consume data and
// mutators from here — never from localStorage directly. Keeps a single source
// of truth in React state, hydrated on mount and kept in sync via STORE_EVENT.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { emptyData } from "./seed";
import * as store from "./store";
import type {
  AppData,
  EntryCollection,
  EntryTypeMap,
  Goals,
  Habit,
  MealPlan,
  SavingsPlan,
  UserProfile,
} from "./types";

interface StoreContextValue {
  data: AppData;
  /** False until localStorage has been read on the client (avoids SSR mismatch). */
  hydrated: boolean;
  addEntry: <K extends EntryCollection>(key: K, entry: EntryTypeMap[K]) => void;
  removeEntry: (key: EntryCollection, id: string) => void;
  setEntries: <K extends EntryCollection>(key: K, entries: EntryTypeMap[K][]) => void;
  setGoals: (goals: Goals) => void;
  setHabits: (habits: Habit[]) => void;
  setHabitCompletion: (habitId: string, dateKey: string, completed: boolean) => void;
  setFocus: (dateKey: string, text: string) => void;
  setProfile: (profile: UserProfile) => void;
  setMealPlan: (plan: MealPlan | null) => void;
  setSavingsPlan: (plan: SavingsPlan | null) => void;
  markAchievementsSeen: (ids: string[]) => void;
  importData: (parsed: unknown) => boolean;
  resetToDemo: () => void;
  clearAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Start from empty defaults so server and first client render match.
  const [data, setData] = useState<AppData>(() => emptyData());
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setData(store.getData());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    // Re-read on any store write (including from other tabs).
    const onChange = () => refresh();
    window.addEventListener(store.STORE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(store.STORE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      hydrated,
      addEntry: (key, entry) => store.addEntry(key, entry),
      removeEntry: (key, id) => store.removeEntry(key, id),
      setEntries: (key, entries) => store.setEntries(key, entries),
      setGoals: (goals) => store.setGoals(goals),
      setHabits: (habits) => store.setHabits(habits),
      setHabitCompletion: (habitId, dateKey, completed) =>
        store.setHabitCompletion(habitId, dateKey, completed),
      setFocus: (dateKey, text) => store.setFocus(dateKey, text),
      setProfile: (profile) => store.setProfile(profile),
      setMealPlan: (plan) => store.setMealPlan(plan),
      setSavingsPlan: (plan) => store.setSavingsPlan(plan),
      markAchievementsSeen: (ids) => store.markAchievementsSeen(ids),
      importData: (parsed) => store.importData(parsed),
      resetToDemo: () => store.resetToDemo(),
      clearAll: () => store.clearAll(),
    }),
    [data, hydrated],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
