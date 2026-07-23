"use client";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { trainingHeatmap, WORKOUT_COLORS, WORKOUT_LEGEND } from "@/lib/body";
import { useStore } from "@/lib/store-context";
import { Heatmap } from "./Heatmap";

export function TrainingHeatmap() {
  const { data, hydrated } = useStore();
  const grid = trainingHeatmap(data, 12);
  const hasWorkouts = data.workouts.length > 0;

  return (
    <Card
      title="Training"
      subtitle="Last 12 weeks · colour by session type, intensity by duration"
      right={
        hydrated ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {WORKOUT_LEGEND.map((l) => (
              <span key={l.type} className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: WORKOUT_COLORS[l.type] }} />
                {l.label}
              </span>
            ))}
          </div>
        ) : null
      }
    >
      {!hydrated ? (
        <Skeleton className="h-28 w-full" />
      ) : hasWorkouts ? (
        <Heatmap grid={grid} />
      ) : (
        <EmptyState
          icon="🏋️"
          title="No workouts logged"
          message="Log a session from Quick add and it'll light up this 12-week grid."
          compact
        />
      )}
    </Card>
  );
}
