"use client";

import { Card } from "@/components/Card";
import { generateInsights } from "@/lib/coach";
import { useStore } from "@/lib/store-context";

const TONE: Record<string, { dot: string; label: string }> = {
  good: { dot: "var(--positive)", label: "On track" },
  warn: { dot: "var(--create)", label: "Nudge" },
  info: { dot: "var(--coach)", label: "Tip" },
};

export function Insights() {
  const { data, hydrated } = useStore();
  const insights = hydrated ? generateInsights(data) : [];

  return (
    <Card title="Insights" subtitle="Generated from your actual patterns">
      <div className="space-y-2.5">
        {insights.map((ins, i) => {
          const tone = TONE[ins.tone];
          return (
            <div key={i} className="flex gap-3 rounded-xl border border-border p-3">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tone.dot }} />
              <div>
                <p className="text-sm font-medium">{ins.title}</p>
                <p className="text-xs text-muted">{ins.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
