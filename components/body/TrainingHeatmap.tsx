"use client";

import { Card } from "@/components/Card";
import { trainingHeatmap, WORKOUT_COLORS, WORKOUT_LEGEND } from "@/lib/body";
import { useStore } from "@/lib/store-context";
import { Heatmap } from "./Heatmap";

export function TrainingHeatmap() {
  const { data, hydrated } = useStore();
  const grid = trainingHeatmap(data, 12);

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
      {hydrated ? <Heatmap grid={grid} /> : <div className="h-28" />}
    </Card>
  );
}
