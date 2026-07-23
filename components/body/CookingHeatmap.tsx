"use client";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { COOK_COLOR, cookingHeatmap } from "@/lib/body";
import { useStore } from "@/lib/store-context";
import { Heatmap } from "./Heatmap";

export function CookingHeatmap() {
  const { data, hydrated } = useStore();
  const grid = cookingHeatmap(data, 12);
  const hasMeals = data.meals.length > 0;

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
      {!hydrated ? (
        <Skeleton className="h-28 w-full" />
      ) : hasMeals ? (
        <Heatmap grid={grid} />
      ) : (
        <EmptyState
          icon="🍳"
          title="No meals logged"
          message="Track a meal from Quick add to start filling in your home-cooking streak."
          compact
        />
      )}
    </Card>
  );
}
