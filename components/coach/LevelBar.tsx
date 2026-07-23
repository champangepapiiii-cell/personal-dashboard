"use client";

import { Card } from "@/components/Card";
import { computeXp, levelForXp } from "@/lib/game";
import { useStore } from "@/lib/store-context";

export function LevelBar() {
  const { data, hydrated } = useStore();
  const { total, items } = computeXp(data);
  const info = levelForXp(total);

  return (
    <Card
      title="Your level"
      subtitle="XP earned from everything you track"
      right={
        hydrated ? (
          <div className="text-right">
            <div className="text-lg font-semibold tabular-nums text-coach">{total.toLocaleString("en-US")} XP</div>
            <div className="text-xs text-muted">total</div>
          </div>
        ) : null
      }
    >
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-coach/15 text-xl font-bold text-coach">
          {hydrated ? info.level : "—"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold tracking-tight">{hydrated ? info.title : ""}</span>
            <span className="text-xs text-muted tabular-nums">
              {hydrated ? `${info.into} / ${info.span} to L${info.level + 1}` : ""}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{ width: hydrated ? `${Math.round(info.progress * 100)}%` : "0%", background: "var(--coach)" }}
            />
          </div>
        </div>
      </div>

      {hydrated && items.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {items.map((i) => (
            <span key={i.label}>
              {i.label} <span className="tabular-nums text-foreground">+{i.xp}</span>
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
