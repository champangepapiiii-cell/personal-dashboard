"use client";

// Recurring monthly outgoings. Rows are addable and deletable; the footer keeps
// a running total. Writes straight to the store.

import { useState } from "react";
import { Card } from "@/components/Card";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { newId } from "@/lib/id";
import { aed, recurringTotal } from "@/lib/money";
import { useStore } from "@/lib/store-context";

export function RecurringTable() {
  const { data, hydrated, addEntry, removeEntry } = useStore();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const total = recurringTotal(data);

  const canAdd = label.trim().length > 0 && Number(amount) > 0;
  const add = () => {
    if (!canAdd) return;
    addEntry("recurring", { id: newId("rec"), label: label.trim(), amount: Number(amount) });
    setLabel("");
    setAmount("");
  };

  return (
    <Card
      title="Recurring outgoings"
      subtitle="Every month"
      right={
        hydrated ? (
          <div className="text-right">
            <div className="text-xs text-muted">Monthly total</div>
            <div className="text-lg font-semibold tabular-nums">{aed(total)}</div>
          </div>
        ) : null
      }
    >
      {!hydrated ? (
        <SkeletonLines rows={4} className="py-2" />
      ) : (
        <>
          <div className="divide-y divide-border">
            {data.recurring.map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1 truncate text-sm">{r.label}</span>
                <span className="tabular-nums text-sm">{aed(r.amount)}</span>
                <button
                  onClick={() => removeEntry("recurring", r.id)}
                  aria-label={`Delete ${r.label}`}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-negative"
                >
                  ✕
                </button>
              </div>
            ))}
            {data.recurring.length === 0 && (
              <p className="py-3 text-sm text-muted">
                Nothing recurring yet — add rent, subscriptions or bills below.
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-semibold tabular-nums">{aed(total)}</span>
          </div>

          {/* Add row */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="e.g. Insurance"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder="AED"
                className="w-28 rounded-lg border border-border bg-surface-2 px-3 py-2 text-right text-sm tabular-nums outline-none focus:border-accent"
              />
              <button
                onClick={add}
                disabled={!canAdd}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
