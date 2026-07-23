// Derived metrics for the Create section: shipping cadence and the
// deliberately-uncomfortable "days since last published" counter.

import { lastNMonths, yearMonthOf } from "./dates";
import type { AppData, ContentStatus } from "./types";

export const STATUSES: ContentStatus[] = ["idea", "drafting", "editing", "published"];

export const STATUS_LABEL: Record<ContentStatus, string> = {
  idea: "Idea",
  drafting: "Drafting",
  editing: "Editing",
  published: "Published",
};

/** Whole days since the most recent published piece; null if nothing shipped. */
export function daysSinceLastPublished(data: AppData): number | null {
  const dates = data.content
    .filter((c) => c.status === "published" && c.publishedAt)
    .map((c) => c.publishedAt!);
  if (dates.length === 0) return null;
  const latest = dates.sort().at(-1)!; // ISO date strings sort lexicographically
  const days = Math.floor((Date.now() - new Date(latest).getTime()) / 86_400_000);
  return Math.max(0, days);
}

export interface ShippedPoint {
  label: string;
  count: number;
}

/** Published pieces per calendar month, oldest first. */
export function shippedPerMonth(data: AppData, months = 6): ShippedPoint[] {
  return lastNMonths(months).map((b) => {
    const count = data.content.filter((c) => {
      if (c.status !== "published" || !c.publishedAt) return false;
      const [y, m] = yearMonthOf(c.publishedAt);
      return y === b.year && m === b.month;
    }).length;
    return { label: b.label, count };
  });
}
