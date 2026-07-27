"use client";

// Renders a custom goal's generated playbook: summary, checkable methods,
// techniques, things to read/watch, and addable habits.

import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { newId } from "@/lib/id";
import { generatePlaybook, type ResourceKind } from "@/lib/playbooks";
import { useStore } from "@/lib/store-context";

const KIND_ICON: Record<ResourceKind, string> = {
  read: "📖",
  watch: "▶️",
  listen: "🎧",
  app: "📱",
  tool: "🛠️",
};

export function GoalPlaybook({ id }: { id: string }) {
  const { data, hydrated, toggleGoalMethod, removeGoalSection, setHabits } = useStore();
  const router = useRouter();

  const section = data.goalSections.find((g) => g.id === id);

  if (hydrated && !section) {
    return (
      <EmptyState
        icon="🧭"
        title="Goal not found"
        message="This goal may have been removed. Add a new one from the sidebar."
      />
    );
  }

  const title = section?.title ?? "";
  const pb = generatePlaybook(title);
  const done = new Set(data.goalProgress[id] ?? []);
  const doneCount = pb.methods.filter((m) => done.has(m)).length;
  const pct = pb.methods.length ? Math.round((doneCount / pb.methods.length) * 100) : 0;

  const existingHabits = new Set(data.habits.map((h) => h.label.toLowerCase()));
  const addHabit = (label: string) => {
    if (existingHabits.has(label.toLowerCase())) return;
    setHabits([...data.habits, { id: newId("habit"), label, active: true }]);
  };

  const remove = () => {
    removeGoalSection(id);
    router.push("/coach");
  };

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl text-2xl"
            style={{ background: `color-mix(in oklab, ${pb.accent} 15%, transparent)` }}
          >
            {pb.icon}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: pb.accent }}>
              {hydrated ? title : "…"}
            </h1>
            <p className="text-sm text-muted">Your plan for this goal</p>
          </div>
        </div>
        {hydrated && (
          <button
            type="button"
            onClick={remove}
            className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted hover:text-negative"
          >
            Remove
          </button>
        )}
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90">{pb.summary}</p>

      {/* Methods — checkable */}
      <Card
        title="Methods"
        subtitle="Work through these — tick each as you build it in"
        right={
          hydrated ? (
            <span className="text-xs tabular-nums text-muted">{doneCount}/{pb.methods.length}</span>
          ) : null
        }
      >
        {hydrated && (
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: pb.accent }} />
          </div>
        )}
        <ul className="space-y-2">
          {pb.methods.map((m) => {
            const isDone = done.has(m);
            return (
              <li key={m}>
                <button
                  type="button"
                  disabled={!hydrated}
                  onClick={() => toggleGoalMethod(id, m)}
                  className={
                    "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors " +
                    (isDone ? "border-transparent bg-surface-2" : "border-border hover:border-foreground/20")
                  }
                >
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px]"
                    style={
                      isDone
                        ? { background: pb.accent, borderColor: "transparent", color: "#fff" }
                        : { borderColor: "var(--muted)", color: "transparent" }
                    }
                  >
                    ✓
                  </span>
                  <span className={"text-sm " + (isDone ? "text-muted line-through" : "")}>{m}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Techniques */}
      {pb.techniques.length > 0 && (
        <Card title="Techniques" subtitle="Quick tools you can use right now">
          <div className="grid gap-3 sm:grid-cols-2">
            {pb.techniques.map((t) => (
              <div key={t.name} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="mt-1 text-sm text-muted">{t.how}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resources */}
      {pb.resources.length > 0 && (
        <Card title="Read & watch" subtitle="Curated starting points">
          <ul className="space-y-2">
            {pb.resources.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:border-foreground/20"
                >
                  <span className="text-base" aria-hidden="true">{KIND_ICON[r.kind]}</span>
                  <span className="min-w-0 flex-1 truncate">{r.label}</span>
                  <span className="shrink-0 text-xs text-muted">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Habits */}
      {pb.habits.length > 0 && (
        <Card title="Build the habits" subtitle="Add any to your habit tracker in Life">
          <div className="flex flex-wrap gap-2">
            {pb.habits.map((h) => {
              const added = existingHabits.has(h.toLowerCase());
              return (
                <button
                  key={h}
                  type="button"
                  disabled={!hydrated || added}
                  onClick={() => addHabit(h)}
                  className={
                    "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors " +
                    (added ? "border-transparent bg-surface-2 text-muted" : "border-border hover:border-foreground/30")
                  }
                >
                  {added ? `${h} ✓` : `+ ${h}`}
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
