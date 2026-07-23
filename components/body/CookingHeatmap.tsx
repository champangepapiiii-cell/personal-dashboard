"use client";

import { Card } from "@/components/Card";
import { COOK_COLOR, cookingHeatmap } from "@/lib/body";
import { useStore } from "@/lib/store-context";
import { Heatmap } from "./Heatmap";

export function CookingHeatmap() {
  const { data, hydrated } = useStore();
  const grid = cookingHeatmap(data, 12);

  const cooked = hydrated
    ? data.meals.filter((m) => m.cookedAtHome).length
    : 0;
  const logged = hydrated ? data.meals.length : 0;

  return (
    <Card
      title="Cooked at home"
      subtitle="Last 12 weeks"
      right={
        hydrated ? (
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: COOK_COLOR }} />
            {logged ? Math.round((cooked / logged) * 100) : 0}% home-cooked
          </span>
        ) : null
      }
    >
      {hydrated ? <Heatmap grid={grid} /> : <div className="h-28" />}
    </Card>
  );
}
