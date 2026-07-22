// Small date helpers shared across views.
//
// Entry dates are stored as date-only ISO keys ("2026-07-22"). To stay
// consistent with how the seed generates them, all keys here are derived by
// normalising to local noon before slicing — so no timezone drift.

/** ISO day key ("2026-07-22") for a given date, normalised to local noon. */
export function dayKey(d: Date = new Date()): string {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}

/** Day key for N days before today (0 = today). Matches the seed generator. */
export function dayKeyDaysAgo(n: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** True if the ISO date falls within the last `days` days (inclusive of today). */
export function withinDays(iso: string, days: number): boolean {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return false;
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return then >= cutoff && then <= now + 24 * 60 * 60 * 1000;
}

/** Day keys for the current week so far, Monday → today (inclusive). */
export function currentWeekKeys(): string[] {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const dow = now.getDay(); // 0 Sun … 6 Sat
  const daysSinceMonday = (dow + 6) % 7; // Mon → 0 … Sun → 6
  const keys: string[] = [];
  for (let i = daysSinceMonday; i >= 0; i--) {
    keys.push(dayKeyDaysAgo(i));
  }
  return keys;
}

/** Human-readable long date, e.g. "Tuesday, 22 July 2026". */
export function formatLongDate(d: Date = new Date()): string {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
