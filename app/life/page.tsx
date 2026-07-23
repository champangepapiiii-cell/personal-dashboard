"use client";

import { HabitConsistency } from "@/components/life/HabitConsistency";
import { HabitGrid } from "@/components/life/HabitGrid";
import { HabitManager } from "@/components/life/HabitManager";

export default function LifePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ background: "var(--life)" }} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--life)" }}>
            Life
          </h1>
          <p className="text-sm text-muted">Habits and consistency.</p>
        </div>
      </div>

      <HabitGrid />

      <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
        <HabitConsistency />
        <HabitManager />
      </div>
    </div>
  );
}
