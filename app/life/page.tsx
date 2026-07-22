"use client";

import { PageStub } from "@/components/PageStub";
import { useStore } from "@/lib/store-context";
import { useTimeframe } from "@/lib/timeframe";
import { withinDays } from "@/lib/dates";

export default function LifePage() {
  const { data } = useStore();
  const { days } = useTimeframe();

  const activeHabits = data.habits.filter((h) => h.active).length;
  const entries = data.habitEntries.filter((e) => withinDays(e.date, days));
  const completed = entries.filter((e) => e.completed).length;
  const rate = entries.length ? Math.round((completed / entries.length) * 100) : 0;

  return (
    <PageStub
      title="Life"
      accent="var(--life)"
      description="Habits and routines."
      stats={[
        { label: "Active habits", value: activeHabits },
        { label: "Completions", value: completed },
        { label: "Logged", value: entries.length },
        { label: "Completion rate", value: `${rate}%` },
      ]}
    />
  );
}
