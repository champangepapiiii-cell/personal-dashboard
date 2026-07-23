// Derived metrics for the Body section: weight trend with rolling average,
// GitHub-style heatmap grids, and the weekly session count. Pure functions.

import { currentWeekKeys, dayKey, MONTH_ABBR } from "./dates";
import type { AppData, WorkoutEntry, WorkoutType } from "./types";

// --- Weight -----------------------------------------------------------------

export interface WeightPoint {
  key: string;
  label: string;
  /** Raw weigh-in for the day, or null if none. */
  kg: number | null;
  /** Trailing 7-day rolling average, or null. */
  avg: number | null;
}

export function weightSeries(data: AppData, days: number): WeightPoint[] {
  const byDate = new Map<string, number>();
  for (const w of data.weight) byDate.set(w.date, w.kg);

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));

  const points: WeightPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dayKey(d);
    const kg = byDate.has(key) ? byDate.get(key)! : null;

    // Trailing 7 calendar days rolling average over available weigh-ins.
    let sum = 0;
    let n = 0;
    for (let j = 0; j < 7; j++) {
      const dd = new Date(d);
      dd.setDate(d.getDate() - j);
      const k = dayKey(dd);
      if (byDate.has(k)) {
        sum += byDate.get(k)!;
        n += 1;
      }
    }
    const avg = n > 0 ? Math.round((sum / n) * 10) / 10 : null;
    points.push({ key, label: shortLabel(key), kg, avg });
  }
  return points;
}

/** Most recent weigh-in, or null. */
export function latestWeight(data: AppData): number | null {
  if (data.weight.length === 0) return null;
  return [...data.weight].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!.kg;
}

// --- Heatmaps ---------------------------------------------------------------

export interface HeatCell {
  date: string;
  future: boolean;
  /** Fill colour, or null for an empty (rest / no-data) cell. */
  color: string | null;
  title: string;
}

export const WORKOUT_COLORS: Record<WorkoutType, string> = {
  gym: "#ef4444",
  run: "#3b82f6",
  football: "#22c58a",
  other: "#a78bfa",
};

export const WORKOUT_LEGEND: { type: WorkoutType; label: string }[] = [
  { type: "gym", label: "Gym" },
  { type: "run", label: "Run" },
  { type: "football", label: "Football" },
  { type: "other", label: "Other" },
];

export const COOK_COLOR = "#14b8a6";

/** Columns = weeks (oldest→newest), rows = Mon→Sun. */
function weekColumns(weeks: number): Date[][] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7; // Mon=0 … Sun=6
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - mondayOffset);
  const startMonday = new Date(currentMonday);
  startMonday.setDate(currentMonday.getDate() - (weeks - 1) * 7);

  const cols: Date[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(startMonday);
      dt.setDate(startMonday.getDate() + w * 7 + d);
      col.push(dt);
    }
    cols.push(col);
  }
  return cols;
}

/** Training heatmap — cell hue = dominant session type, intensity = duration. */
export function trainingHeatmap(data: AppData, weeks = 12): HeatCell[][] {
  const byDate = new Map<string, WorkoutEntry[]>();
  for (const w of data.workouts) {
    const arr = byDate.get(w.date) ?? [];
    arr.push(w);
    byDate.set(w.date, arr);
  }
  const today = dayKey();

  return weekColumns(weeks).map((col) =>
    col.map((dt) => {
      const key = dayKey(dt);
      const future = key > today;
      const list = byDate.get(key) ?? [];
      if (future) return { date: key, future, color: null, title: "" };
      if (list.length === 0) {
        return { date: key, future, color: null, title: `${shortLabel(key)} · rest day` };
      }

      const totals = new Map<WorkoutType, number>();
      let totalDuration = 0;
      for (const w of list) {
        totals.set(w.type, (totals.get(w.type) ?? 0) + w.duration);
        totalDuration += w.duration;
      }
      let dominant: WorkoutType = list[0].type;
      let max = -1;
      for (const [t, dur] of totals) {
        if (dur > max) {
          max = dur;
          dominant = t;
        }
      }
      const opacity = 0.45 + Math.min(1, totalDuration / 90) * 0.55;
      const detail = list.map((w) => `${w.type} ${w.duration}m`).join(", ");
      return {
        date: key,
        future,
        color: withOpacity(WORKOUT_COLORS[dominant], opacity),
        title: `${shortLabel(key)} · ${detail}`,
      };
    }),
  );
}

/** Cooked-at-home heatmap — filled when a home-cooked meal was logged. */
export function cookingHeatmap(data: AppData, weeks = 12): HeatCell[][] {
  const byDate = new Map<string, boolean>();
  for (const m of data.meals) byDate.set(m.date, m.cookedAtHome);
  const today = dayKey();

  return weekColumns(weeks).map((col) =>
    col.map((dt) => {
      const key = dayKey(dt);
      const future = key > today;
      if (future) return { date: key, future, color: null, title: "" };
      if (!byDate.has(key)) {
        return { date: key, future, color: null, title: `${shortLabel(key)} · no meal logged` };
      }
      const cooked = byDate.get(key)!;
      return {
        date: key,
        future,
        color: cooked ? COOK_COLOR : null,
        title: `${shortLabel(key)} · ${cooked ? "cooked at home" : "ate out"}`,
      };
    }),
  );
}

/** Month labels for the columns of a heatmap (label placed where month changes). */
export function monthLabels(grid: HeatCell[][]): (string | null)[] {
  let prev = "";
  return grid.map((col) => {
    const [, mo] = col[0].date.split("-");
    const label = MONTH_ABBR[Number(mo) - 1];
    if (label !== prev) {
      prev = label;
      return label;
    }
    return null;
  });
}

// --- Weekly sessions --------------------------------------------------------

export interface WeeklySessions {
  count: number;
  goal: number;
  minutes: number;
}

export function weeklySessions(data: AppData): WeeklySessions {
  const keys = currentWeekKeys();
  const inWeek = data.workouts.filter((w) => keys.includes(w.date));
  return {
    count: inWeek.length,
    goal: data.goals.weeklyWorkoutGoal,
    minutes: inWeek.reduce((s, w) => s + w.duration, 0),
  };
}

// --- helpers ----------------------------------------------------------------

function shortLabel(key: string): string {
  const [, mo, day] = key.split("-");
  return `${Number(day)} ${MONTH_ABBR[Number(mo) - 1]}`;
}

function withOpacity(hex: string, o: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${o.toFixed(2)})`;
}
