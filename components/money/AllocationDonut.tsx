"use client";

// Investment allocation donut with an inline editor. In edit mode the donut
// previews the draft live as you type; Save commits to the store.

import { useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { Card } from "@/components/Card";
import { newId } from "@/lib/id";
import { aed } from "@/lib/money";
import { useStore } from "@/lib/store-context";
import type { InvestmentAllocation } from "@/lib/types";

const PALETTE = [
  "#22c58a", "#3b82f6", "#a78bfa", "#f59e0b",
  "#f472b6", "#14b8a6", "#ef4444", "#84cc16",
];

export function AllocationDonut() {
  const { data, hydrated, setEntries } = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<InvestmentAllocation[]>([]);

  const items = editing ? draft : data.investments;
  const total = items.reduce((s, x) => s + (Number(x.amount) || 0), 0);
  const chartData = items.filter((x) => (Number(x.amount) || 0) > 0);

  const startEdit = () => {
    setDraft(data.investments.map((x) => ({ ...x })));
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const save = () => {
    const cleaned = draft
      .map((x) => ({ ...x, label: x.label.trim() || "Untitled", amount: Number(x.amount) || 0 }))
      .filter((x) => x.amount > 0);
    setEntries("investments", cleaned);
    setEditing(false);
  };

  const update = (id: string, patch: Partial<InvestmentAllocation>) =>
    setDraft((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const remove = (id: string) => setDraft((d) => d.filter((x) => x.id !== id));
  const add = () =>
    setDraft((d) => [...d, { id: newId("inv"), label: "", amount: 0 }]);

  return (
    <Card
      title="Investment allocation"
      subtitle={hydrated ? aed(total) : undefined}
      right={
        hydrated ? (
          editing ? (
            <div className="flex gap-2">
              <button onClick={cancel} className="text-xs font-medium text-muted hover:text-foreground">
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-accent-fg"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={startEdit}
              className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted hover:text-foreground"
            >
              Edit
            </button>
          )
        ) : null
      }
    >
      {!hydrated ? (
        <div className="h-56" />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative h-52 w-52 shrink-0">
            <PieChart width={208} height={208}>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="64%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {chartData.map((entry, i) => (
                  <Cell key={entry.id} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--foreground)",
                  fontSize: 13,
                }}
                formatter={(v, name) => [aed(Number(v)), name]}
              />
            </PieChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted">Total</span>
              <span className="text-lg font-semibold tabular-nums">{aed(total, false)}</span>
            </div>
          </div>

          <div className="w-full space-y-2">
            {items.map((x, i) => {
              const color = PALETTE[i % PALETTE.length];
              const pct = total > 0 ? Math.round(((Number(x.amount) || 0) / total) * 100) : 0;
              return (
                <div key={x.id} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />
                  {editing ? (
                    <>
                      <input
                        value={x.label}
                        onChange={(e) => update(x.id, { label: e.target.value })}
                        placeholder="Category"
                        className="min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-2 py-1 text-sm outline-none focus:border-accent"
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        value={x.amount}
                        onChange={(e) => update(x.id, { amount: Number(e.target.value) })}
                        className="w-24 rounded-md border border-border bg-surface-2 px-2 py-1 text-right text-sm tabular-nums outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => remove(x.id)}
                        aria-label={`Remove ${x.label || "category"}`}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-negative"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="min-w-0 flex-1 truncate">{x.label}</span>
                      <span className="tabular-nums text-muted">{pct}%</span>
                      <span className="w-24 text-right tabular-nums">{aed(x.amount, false)}</span>
                    </>
                  )}
                </div>
              );
            })}

            {editing && (
              <button
                onClick={add}
                className="mt-1 w-full rounded-lg border border-dashed border-border py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-foreground"
              >
                + Add category
              </button>
            )}
            {!editing && items.length === 0 && (
              <p className="text-sm text-muted">No allocation yet — tap Edit to add categories.</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
