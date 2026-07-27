"use client";

// The live sidebar/bottom-nav list: Today + the trackers the user enabled +
// their custom goal sections + Coach. Goal sections get their icon/accent from
// the playbook engine so each looks distinct.

import { COACH_ITEM, HOME_ITEM, TRACKER_ITEMS } from "./nav";
import { generatePlaybook } from "./playbooks";
import { useStore } from "./store-context";

export interface NavEntry {
  key: string;
  label: string;
  href: string;
  accent: string;
  /** SVG path for built-in sections. */
  icon?: string;
  /** Emoji for custom goal sections. */
  emoji?: string;
  isGoal?: boolean;
}

export function useNavSections(): NavEntry[] {
  const { data } = useStore();
  const priorities = data.profile.priorities;

  const trackers = TRACKER_ITEMS.filter((t) => !t.area || priorities.includes(t.area)).map(
    (t): NavEntry => ({ key: t.href, label: t.label, href: t.href, accent: t.accent, icon: t.icon }),
  );

  const goals = data.goalSections.map((g): NavEntry => {
    const pb = generatePlaybook(g.title);
    return { key: g.id, label: g.title, href: `/goal/${g.id}`, accent: pb.accent, emoji: pb.icon, isGoal: true };
  });

  return [
    { key: "today", label: HOME_ITEM.label, href: HOME_ITEM.href, accent: HOME_ITEM.accent, icon: HOME_ITEM.icon },
    ...trackers,
    ...goals,
    { key: "coach", label: COACH_ITEM.label, href: COACH_ITEM.href, accent: COACH_ITEM.accent, icon: COACH_ITEM.icon },
  ];
}
