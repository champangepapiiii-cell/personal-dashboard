"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { latestWeight, weightSeries } from "@/lib/body";
import { useStore } from "@/lib/store-context";
import { useTimeframe } from "@/lib/timeframe";
import { useMeasure } from "@/lib/useMeasure";

const axisTick = { fill: "var(--muted)", fontSize: 12 };
const CHART_H = 260;

export function WeightChart() {
  const { data, hydrated } = useStore();
  const { days, timeframe } = useTimeframe();
  const { ref, width } = useMeasure<HTMLDivElement>();

  const series = weightSeries(data, days);
  const band = data.goals.weightTargetRange;
  const latest = latestWeight(data);

  const values = series
    .flatMap((p) => [p.kg, p.avg])
    .filter((v): v is number => v != null);
  const lo = Math.floor(Math.min(band.min, ...(values.length ? values : [band.min])) - 1);
  const hi = Math.ceil(Math.max(band.max, ...(values.length ? values : [band.max])) + 1);

  return (
    <Card
      title="Weight"
      subtitle={`Target band ${band.min}–${band.max} kg · ${timeframe.toLowerCase()}`}
      right={
        hydrated && latest != null ? (
          <div className="text-right">
            <div className="text-lg font-semibold tabular-nums">{latest} kg</div>
            <div className="text-xs text-muted">latest</div>
          </div>
        ) : null
      }
    >
      <div ref={ref} className="w-full" style={{ height: CHART_H }}>
        {!hydrated && <Skeleton className="h-full w-full" />}
        {hydrated && values.length === 0 && (
          <EmptyState
            icon="⚖️"
            title="No weigh-ins yet"
            message="Log your weight from Quick add and the trend line (with your target band) appears here."
          />
        )}
        {hydrated && values.length > 0 && width > 0 && (
          <LineChart data={series} width={width} height={CHART_H} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            {/* Target range as a shaded band — a range, not a single line. */}
            <ReferenceArea
              y1={band.min}
              y2={band.max}
              fill="var(--body)"
              fillOpacity={0.12}
              stroke="var(--body)"
              strokeOpacity={0.25}
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="label"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={[lo, hi]}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              width={36}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--foreground)",
                fontSize: 13,
              }}
              labelStyle={{ color: "var(--muted)" }}
              formatter={(v, name) => [v == null ? "—" : `${v} kg`, name === "avg" ? "7-day avg" : "Weigh-in"]}
            />
            {/* Raw weigh-ins as points (no connecting line). */}
            <Line
              dataKey="kg"
              stroke="var(--muted)"
              strokeWidth={0}
              dot={{ r: 2, fill: "var(--muted)", strokeWidth: 0 }}
              isAnimationActive={false}
              connectNulls={false}
            />
            {/* 7-day rolling average as the trend line. */}
            <Line
              dataKey="avg"
              stroke="var(--body)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          </LineChart>
        )}
      </div>
    </Card>
  );
}
