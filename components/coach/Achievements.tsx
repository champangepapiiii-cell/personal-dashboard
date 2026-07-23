"use client";

import { Card } from "@/components/Card";
import { ACHIEVEMENTS, unlockedAchievements } from "@/lib/game";
import { useStore } from "@/lib/store-context";

export function Achievements() {
  const { data, hydrated } = useStore();
  const unlocked = new Set(hydrated ? unlockedAchievements(data) : []);
  const count = unlocked.size;

  return (
    <Card
      title="Achievements"
      subtitle="Milestones you've unlocked"
      right={
        hydrated ? (
          <span className="text-xs text-muted tabular-nums">
            {count}/{ACHIEVEMENTS.length}
          </span>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className={
                "rounded-xl border p-3 transition-colors " +
                (got ? "border-coach/40 bg-coach/5" : "border-border bg-surface-2/40")
              }
            >
              <div className={"text-2xl " + (got ? "" : "opacity-30 grayscale")}>{a.icon}</div>
              <p className={"mt-1.5 text-sm font-medium " + (got ? "" : "text-muted")}>{a.label}</p>
              <p className="text-xs text-muted">{a.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
