"use client";

import { Card } from "@/components/Card";
import { weeklySessions } from "@/lib/body";
import { useStore } from "@/lib/store-context";

export function WeeklySessions() {
  const { data, hydrated } = useStore();
  const { count, goal, minutes } = weeklySessions(data);

  // Render one pip per goal session, plus any extras beyond the goal.
  const pips = Math.max(goal, count);

  return (
    <Card title="This week" subtitle="Training sessions vs goal">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums" style={{ color: "var(--body)" }}>
            {hydrated ? count : "—"}
          </span>
          <span className="text-sm text-muted">/ {goal} sessions</span>
        </div>
        {hydrated && (
          <span className="text-xs text-muted tabular-nums">{minutes} min total</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {hydrated &&
          Array.from({ length: pips }).map((_, i) => {
            const done = i < count;
            const beyond = i >= goal;
            return (
              <span
                key={i}
                className="h-2.5 flex-1 rounded-full"
                style={{
                  minWidth: 16,
                  background: done
                    ? beyond
                      ? "var(--positive)"
                      : "var(--body)"
                    : "var(--surface-2)",
                }}
              />
            );
          })}
      </div>

      {hydrated && (
        <p className="mt-3 text-sm text-muted">
          {count >= goal ? (
            <span className="text-positive">Goal hit for the week.</span>
          ) : (
            <>
              {goal - count} more to hit your goal of {goal}.
            </>
          )}
        </p>
      )}
    </Card>
  );
}
