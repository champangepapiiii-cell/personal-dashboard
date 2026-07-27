"use client";

// Manage goal sections from the Coach hub: add a goal (becomes a sidebar
// section with its own plan), open its playbook, or remove it.

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { generatePlaybook } from "@/lib/playbooks";
import { useStore } from "@/lib/store-context";

export function GoalsCard() {
  const { data, hydrated, addGoalSection, removeGoalSection } = useStore();
  const [draft, setDraft] = useState("");

  const goals = data.goalSections;

  const add = () => {
    const g = draft.trim();
    if (!g) return;
    addGoalSection(g);
    setDraft("");
  };

  return (
    <Card title="Your goals" subtitle="Each becomes a section with its own plan — add anything">
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
          placeholder="Add a goal — e.g. Confidence, better sleep, learn Spanish"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-coach"
        />
        <button
          type="button"
          onClick={add}
          disabled={!hydrated || !draft.trim()}
          className="shrink-0 rounded-lg bg-coach px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {hydrated && goals.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          No goals yet. Add what matters to you and the coach builds a plan around it.
        </p>
      )}

      <div className="mt-4 space-y-2">
        {hydrated &&
          goals.map((g) => {
            const pb = generatePlaybook(g.title);
            return (
              <div key={g.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg"
                  style={{ background: `color-mix(in oklab, ${pb.accent} 15%, transparent)` }}
                >
                  {pb.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{g.title}</p>
                  <p className="truncate text-xs text-muted">{pb.summary}</p>
                </div>
                <Link
                  href={`/goal/${g.id}`}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-coach hover:opacity-80"
                >
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
    </Card>
  );
}
