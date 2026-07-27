// Single source of truth for the built-in sections. Used by the desktop
// sidebar, the mobile bottom tabs, and the header. Built-in trackers tagged
// with a focus `area` are shown only when the user selected that area.

import type { FocusArea } from "./types";

export interface NavItem {
  label: string;
  href: string;
  /** Section accent CSS variable name (matches globals.css tokens). */
  accent: string;
  /** Inline SVG path data for a 24x24 icon. */
  icon: string;
  /** Focus area this tracker belongs to; when set, visibility follows the user's priorities. */
  area?: FocusArea;
}

/** Always-visible sections (home + the coach control centre). */
export const HOME_ITEM: NavItem = {
  label: "Today",
  href: "/today",
  accent: "var(--today)",
  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6",
};

export const COACH_ITEM: NavItem = {
  label: "Coach",
  href: "/coach",
  accent: "var(--coach)",
  icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L22 12l-6.714 2.143L13 21l-2.286-6.857L4 12l6.714-2.143L13 3z",
};

/** Built-in trackers, each tied to a focus area the user can toggle. */
export const TRACKER_ITEMS: NavItem[] = [
  {
    label: "Money",
    href: "/money",
    accent: "var(--money)",
    area: "money",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
  },
  {
    label: "Body",
    href: "/body",
    accent: "var(--body)",
    area: "body",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    label: "Life",
    href: "/life",
    accent: "var(--life)",
    area: "life",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Create",
    href: "/create",
    accent: "var(--create)",
    area: "create",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
];

/** Full built-in list (used where every section is needed, e.g. Settings). */
export const NAV_ITEMS: NavItem[] = [HOME_ITEM, ...TRACKER_ITEMS, COACH_ITEM];
