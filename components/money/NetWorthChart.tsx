"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/Card";
import { aed, netWorthSeries } from "@/lib/money";
import { useStore } from "@/lib/store-context";
import { useMeasure } from "@/lib/useMeasure";

const axisTick = { fill: "var(--muted)", fontSize: 12 };
const CHART_H = 256;

export function NetWorthChart() {
  const { data, hydrated } = useStore();
  const series = netWorthSeries(data, 12);
  const { ref, width } = useMeasure<HTMLDivElement>();

  const latest = series.length ? series[series.length - 1].value : 0;
  const first = series.length ? series[0].value : 0;
  const delta = latest - first;

  return (
    <Card
      title="Net worth"
      subtitle="Last 12 months"
      right={
        hydrated ? (
          <div className="text-right">
            <div className="text-lg font-semibold tabular-nums">{aed(latest)}</div>
            <div
              className="text-xs font-medium tabular-nums"
              style={{ color: delta >= 0 ? "var(--positive)" : "var(--negative)" }}
            >
              {delta >= 0 ? "+" : "−"}
              {aed(Math.abs(delta), false)} yr
            </div>
          </div>
        ) : null
      }
    >
      <div ref={ref} className="w-full" style={{ height: CHART_H }}>
        {hydrated && width > 0 && (
          <AreaChart data={series} width={width} height={CHART_H} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--money)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--money)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                cursor={{ stroke: "var(--border)" }}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--foreground)",
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--muted)" }}
                formatter={(v) => [aed(Number(v)), "Net worth"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--money)"
                strokeWidth={2}
                fill="url(#nwFill)"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </AreaChart>
        )}
      </div>
    </Card>
  );
}
