"use client";

import { CookingHeatmap } from "@/components/body/CookingHeatmap";
import { TrainingHeatmap } from "@/components/body/TrainingHeatmap";
import { WeeklySessions } from "@/components/body/WeeklySessions";
import { WeightChart } from "@/components/body/WeightChart";

export default function BodyPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ background: "var(--body)" }} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--body)" }}>
            Body
          </h1>
          <p className="text-sm text-muted">Weight trend, training, and cooking.</p>
        </div>
      </div>

      <WeightChart />
      <WeeklySessions />
      <TrainingHeatmap />
      <CookingHeatmap />
    </div>
  );
}
