"use client";

import { PageStub } from "@/components/PageStub";
import { useStore } from "@/lib/store-context";
import { useTimeframe } from "@/lib/timeframe";
import { withinDays } from "@/lib/dates";

export default function BodyPage() {
  const { data } = useStore();
  const { days } = useTimeframe();

  const weighIns = data.weight.filter((w) => withinDays(w.date, days));
  const latest = data.weight.length ? data.weight[data.weight.length - 1].kg : null;
  const workouts = data.workouts.filter((w) => withinDays(w.date, days));
  const cooked = data.meals.filter((m) => m.cookedAtHome && withinDays(m.date, days)).length;

  return (
    <PageStub
      title="Body"
      accent="var(--body)"
      description="Weight, workouts, and meals."
      stats={[
        { label: "Latest weight", value: latest != null ? `${latest} kg` : "—" },
        { label: "Weigh-ins", value: weighIns.length },
        { label: "Workouts", value: workouts.length },
        { label: "Home meals", value: cooked },
      ]}
    />
  );
}
