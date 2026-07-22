"use client";

// Weekly completion ring — % of this week's planned actions hit so far.
// Rendered with recharts (RadialBar gauge) per the project's chart stack.

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import type { WeeklyCompletion } from "@/lib/metrics";

export function WeeklyRing({
  completion,
  ready,
}: {
  completion: WeeklyCompletion;
  ready: boolean;
}) {
  const pct = ready ? completion.pct : 0;
  const chartData = [{ name: "completion", value: pct }];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">This week</h2>
          <p className="text-xs text-muted">Planned actions completed</p>
        </div>
        {ready && (
          <span className="text-xs text-muted tabular-nums">
            {completion.hit}/{completion.planned}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative h-[168px] w-[168px] shrink-0">
          <RadialBarChart
            width={168}
            height={168}
            cx="50%"
            cy="50%"
            innerRadius="74%"
            outerRadius="100%"
            barSize={14}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: "var(--surface-2)" }}
              fill="var(--accent)"
              isAnimationActive={ready}
            />
          </RadialBarChart>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tabular-nums text-foreground">
              {ready ? `${pct}%` : "—"}
            </span>
            <span className="text-xs text-muted">complete</span>
          </div>
        </div>

        <ul className="w-full space-y-2">
          {completion.components.map((c) => {
            const ratio = c.planned ? Math.min(1, c.hit / c.planned) : 0;
            return (
              <li key={c.label} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">{c.label}</span>
                  <span className="tabular-nums text-foreground">
                    {ready ? `${Math.min(c.hit, c.planned)}/${c.planned}` : "—"}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: ready ? `${ratio * 100}%` : "0%",
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
