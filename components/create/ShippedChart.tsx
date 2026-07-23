"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { shippedPerMonth } from "@/lib/create";
import { useStore } from "@/lib/store-context";
import { useMeasure } from "@/lib/useMeasure";

const axisTick = { fill: "var(--muted)", fontSize: 12 };
const CHART_H = 256;

export function ShippedChart() {
  const { data, hydrated } = useStore();
  const series = shippedPerMonth(data, 6);
  const target = data.goals.monthlyPublishGoal;
  const hasShipped = data.content.some((c) => c.status === "published");
  const { ref, width } = useMeasure<HTMLDivElement>();

  const maxCount = Math.max(target, ...series.map((s) => s.count), 1);

  return (
    <Card title="Pieces shipped" subtitle={`Last 6 months · target ${target}/mo`}>
      <div ref={ref} className="w-full" style={{ height: CHART_H }}>
        {!hydrated && <Skeleton className="h-full w-full" />}
        {hydrated && !hasShipped && (
          <EmptyState
            icon="🚀"
            title="Nothing shipped yet"
            message="Publish a piece on the board and your monthly cadence shows up here against the target."
          />
        )}
        {hydrated && hasShipped && width > 0 && (
          <BarChart data={series} width={width} height={CHART_H} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              width={28}
              allowDecimals={false}
              domain={[0, Math.ceil(maxCount + 1)]}
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
              formatter={(v) => [`${v} shipped`, ""]}
            />
            <ReferenceLine
              y={target}
              stroke="var(--create)"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{ value: `target ${target}`, position: "right", fill: "var(--create)", fontSize: 11 }}
            />
            <Bar dataKey="count" fill="var(--create)" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              <LabelList dataKey="count" position="top" fill="var(--muted)" fontSize={12} />
            </Bar>
          </BarChart>
        )}
      </div>
    </Card>
  );
}
