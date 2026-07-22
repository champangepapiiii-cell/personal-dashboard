"use client";

import { useMemo } from "react";
import { DailyFocus } from "@/components/today/DailyFocus";
import { StreakCard } from "@/components/today/StreakCard";
import { WeeklyRing } from "@/components/today/WeeklyRing";
import { computeStreaks, weeklyCompletion } from "@/lib/metrics";
import { useStore } from "@/lib/store-context";

// Icons (24x24 path data).
const ICON_TRAINED =
  "M6.5 6.5l11 11M4 12l1.5 1.5M12 4l1.5 1.5m4.5 12.5L19.5 20M20 12l-1.5-1.5M12 20l-1.5-1.5M8 8L4.5 4.5M16 16l3.5 3.5";
const ICON_COOKED =
  "M12 3c-3.5 0-6 2.5-6 6 0 2.5 1.5 4.2 3 5v3a1 1 0 001 1h4a1 1 0 001-1v-3c1.5-.8 3-2.5 3-5 0-3.5-2.5-6-6-6z";
const ICON_CREATED =
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
const ICON_BUDGET =
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c1.11 0 2.08.402 2.599 1";

export default function TodayPage() {
  const { data, hydrated } = useStore();

  const streaks = useMemo(() => computeStreaks(data), [data]);
  const completion = useMemo(() => weeklyCompletion(data), [data]);

  return (
    <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
      <DailyFocus />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StreakCard
          label="Days trained"
          days={streaks.trained}
          accent="var(--body)"
          icon={ICON_TRAINED}
          ready={hydrated}
        />
        <StreakCard
          label="Days cooked at home"
          days={streaks.cooked}
          accent="var(--life)"
          icon={ICON_COOKED}
          ready={hydrated}
        />
        <StreakCard
          label="Days created something"
          days={streaks.created}
          accent="var(--create)"
          icon={ICON_CREATED}
          ready={hydrated}
        />
        <StreakCard
          label="Days under spend target"
          days={streaks.underSpend}
          accent="var(--money)"
          icon={ICON_BUDGET}
          ready={hydrated}
        />
      </div>

      <WeeklyRing completion={completion} ready={hydrated} />
    </div>
  );
}
