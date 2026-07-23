"use client";

// Manage habits: add new ones, rename inline, and archive/restore. Rename
// inputs are uncontrolled (commit on blur/Enter) to stay snappy.

import { useState } from "react";
import { Card } from "@/components/Card";
import { newId } from "@/lib/id";
import { useStore } from "@/lib/store-context";
import type { Habit } from "@/lib/types";

export function HabitManager() {
  const { data, hydrated, setHabits } = useStore();
  const [draft, setDraft] = useState("");

  const active = data.habits.filter((h) => h.active);
  const archived = data.habits.filter((h) => !h.active);

  const update = (habits: Habit[]) => setHabits(habits);

  const rename = (id: string, label: string) => {
    const clean = label.trim();
    if (!clean) return;
    update(data.habits.map((h) => (h.id === id ? { ...h, label: clean } : h)));
  };
  const setActive = (id: string, activeState: boolean) =>
    update(data.habits.map((h) => (h.id === id ? { ...h, active: activeState } : h)));

  const add = () => {
    const label = draft.trim();
    if (!label) return;
    if (!data.habits.some((h) => h.label.toLowerCase() === label.toLowerCase())) {
      update([...data.habits, { id: newId("habit"), label, active: true }]);
    }
    setDraft("");
  };

  return (
    <Card title="Manage habits" subtitle="Add, rename, or archive">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          disabled={!hydrated}
          placeholder="New habit — e.g. Stretch, Cold shower"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-life"
        />
        <button
          type="button"
          onClick={add}
          disabled={!hydrated || !draft.trim()}
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
          style={{ background: "var(--life)" }}
        >
          Add
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {hydrated &&
          active.map((h) => (
            <div key={h.id} className="flex items-center gap-2 rounded-lg border border-border p-2">
              <input
                key={`${h.id}:${h.label}`}
                defaultValue={h.label}
                onBlur={(e) => rename(h.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1 text-sm outline-none focus:bg-surface-2"
              />
              <button
                type="button"
                onClick={() => setActive(h.id, false)}
                className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted hover:text-foreground"
              >
                Archive
              </button>
            </div>
          ))}
      </div>

      {hydrated && archived.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Archived</p>
          <div className="space-y-2">
            {archived.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border p-2">
                <span className="truncate px-2 text-sm text-muted">{h.label}</span>
                <button
                  type="button"
                  onClick={() => setActive(h.id, true)}
                  className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-life hover:opacity-80"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
