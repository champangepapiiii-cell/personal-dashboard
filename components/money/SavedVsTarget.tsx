"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { savedVsTarget } from "@/lib/money";
import { useMoney } from "@/lib/useMoney";
import { useStore } from "@/lib/store-context";
import { useMeasure } from "@/lib/useMeasure";

const axisTick = { fill: "var(--muted)", fontSize: 12 };
const CHART_H = 256;

export function SavedVsTarget() {
  const { data, hydrated } = useStore();
  const { fmt } = useMoney();
  const series = savedVsTarget(data, 6);
  const hasSaved = data.money.some((m) => m.type === "saved");
  const { ref, width } = useMeasure<HTMLDivElement>();

  return (
    <Card title="Saved vs target" subtitle="Last 6 months">
      <div ref={ref} className="w-full" style={{ height: CHART_H }}>
        {!hydrated && <Skeleton className="h-full w-full" />}
        {hydrated && !hasSaved && (
          <EmptyState
            icon="🪙"
            title="No savings logged yet"
            message="Log a “saved” entry from Quick add and it'll stack up against your monthly target here."
          />
        )}
        {hydrated && hasSaved && width > 0 && (
          <BarChart data={series} width={width} height={CHART_H} margin={{ top: 8, right: 8, bottom: 0, left: 8 }} barGap={4}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip
                cursor={{ fill: "color-mix(in oklab, var(--muted) 12%, transparent)" }}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--foreground)",
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--muted)" }}
                formatter={(v, name) => [fmt(Number(v)), name === "saved" ? "Saved" : "Target"]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-muted">{value === "saved" ? "Saved" : "Target"}</span>
                )}
              />
              <Bar
                dataKey="target"
                fill="color-mix(in oklab, var(--muted) 40%, transparent)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="saved"
                fill="var(--money)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
        )}
      </div>
    </Card>
  );
}
