"use client";

// Prominent, deliberately-uncomfortable counter. The higher it climbs, the
// louder it gets — colour, message, and a warning band escalate with the days.

import { daysSinceLastPublished } from "@/lib/create";
import { useStore } from "@/lib/store-context";

function tier(days: number) {
  if (days <= 3) return { color: "var(--positive)", msg: "Fresh off the press.", loud: false };
  if (days <= 9) return { color: "var(--create)", msg: "Keep the cadence going.", loud: false };
  if (days <= 20) return { color: "#f97316", msg: "It's been a while. Ship something.", loud: true };
  return { color: "var(--negative)", msg: "Too long. Publish today.", loud: true };
}

export function DaysSincePublished() {
  const { data, hydrated } = useStore();
  const days = daysSinceLastPublished(data);

  const t = days == null ? { color: "var(--muted)", msg: "Nothing shipped yet — publish your first piece.", loud: false } : tier(days);

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: t.loud ? t.color : "var(--border)",
        background: t.loud ? `color-mix(in oklab, ${t.color} 8%, var(--surface))` : "var(--surface)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Days since last published
      </p>
      <div className="mt-1 flex items-end gap-3">
        <span
          className="text-6xl font-bold leading-none tabular-nums"
          style={{ color: hydrated ? t.color : "var(--muted)" }}
        >
          {hydrated ? (days == null ? "—" : days) : "—"}
        </span>
        {hydrated && (
          <span className="pb-1.5 text-sm font-medium" style={{ color: t.color }}>
            {t.msg}
          </span>
        )}
      </div>
    </div>
  );
}
