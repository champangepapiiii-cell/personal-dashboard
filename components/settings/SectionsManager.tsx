"use client";

// Choose which built-in trackers appear in the sidebar (via profile priorities)
// and manage custom goal sections.

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { TRACKER_ITEMS } from "@/lib/nav";
import { generatePlaybook } from "@/lib/playbooks";
import { useStore } from "@/lib/store-context";
import type { FocusArea } from "@/lib/types";

export function SectionsManager() {
  const { data, hydrated, setProfile, addGoalSection, removeGoalSection } = useStore();
  const [draft, setDraft] = useState("");

  const priorities = data.profile.priorities;

  const toggleTracker = (area: FocusArea) => {
    const next = priorities.includes(area)
      ? priorities.filter((p) => p !== area)
      : [...priorities, area];
    setProfile({ ...data.profile, priorities: next });
  };

  const add = () => {
    const g = draft.trim();
    if (!g) return;
    addGoalSection(g);
    setDraft("");
  };

  return (
    <Card title="Sections" subtitle="Show only what you care about — and add your own">
      <p className="mb-2 text-xs font-medium text-muted">Built-in trackers</p>
      <div className="flex flex-wrap gap-2">
        {TRACKER_ITEMS.map((t) => {
          const on = !t.area || priorities.includes(t.area);
          return (
            <button
              key={t.href}
              type="button"
              disabled={!hydrated || !t.area}
              onClick={() => t.area && toggleTracker(t.area)}
              aria-pressed={on}
              className={
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
                (on ? "border-transparent text-white" : "border-border text-muted hover:text-foreground")
              }
              style={on ? { background: t.accent } : undefined}
            >
              {t.label}
              {on ? " ✓" : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-muted">Your goal sections</p>
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
            placeholder="Add a goal section — e.g. Confidence"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <button
            type="button"
            onClick={add}
            disabled={!hydrated || !draft.trim()}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90 disabled:opacity-40"
          >
            Add
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {hydrated && data.goalSections.length === 0 && (
            <p className="text-sm text-muted">No custom sections yet.</p>
          )}
          {hydrated &&
            data.goalSections.map((g) => {
              const pb = generatePlaybook(g.title);
              return (
                <div key={g.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                  <span className="text-lg">{pb.icon}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{g.title}</span>
                  <Link href={`/goal/${g.id}`} className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:text-foreground">
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeGoalSection(g.id)}
                    aria-label={`Remove ${g.title}`}
                    className="shrink-0 rounded-md px-1.5 text-muted hover:text-negative"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </Card>
  );
}
